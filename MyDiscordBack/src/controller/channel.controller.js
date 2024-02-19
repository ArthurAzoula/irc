const Joi = require("joi");
const { ApiResponse } = require("../util/ApiResponse");
const StatusCode = require("../util/StatusCode");
const channelService = require("../service/channel.service");
const Constant = require("../util/Constant");
const { createUserChannel } = require("../service/user-channel.service");
const { getAccountById } = require("../service/account.service");
const { getAnonymousById } = require("../service/anonymous.service");
const io = require("../../app");

const handleJoiValidationError = (
  error,
  res,
  status = StatusCode.BAD_REQUEST
) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const getChannels = async (req, res) => {
  try {
    const querySchema = Joi.object({
      type: Joi.array()
        .items(Joi.string().valid("all", "public", "private", "group"))
        .default(["all"]),
      idUser: Joi.string().uuid(),
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
    });

    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const channels = await channelService.getChannels(value);

    const response = channels
      ? ApiResponse.success(StatusCode.OK, channels)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Channels not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const channel = await channelService.getChannelById(id);

    const response = channel
      ? ApiResponse.success(StatusCode.OK, channel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Channel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const getMessagesByIdChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const verifyError = Joi.object({
      id: Joi.string().uuid().required(),
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
    });

    const { error } =
      verifyError.validate(req.query) && verifyError.validate(req.params);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const messages = await channelService.getMessagesByChannelId(id, req.query);

    const response = messages
      ? ApiResponse.success(StatusCode.OK, messages)
      : ApiResponse.error(
          StatusCode.NOT_FOUND,
          "Messages not found for this channel : " + id
        );

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const createChannel = async (req, res) => {
  try {
    const verifyError = Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
      image: Joi.string(),
      owner: Joi.object().required(),
      members: Joi.array().items(Joi.string().uuid()),
    });

    const { error } = verifyError.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const channel = await channelService.createChannel(req.body);

    try {
      let isAnonymous = false;

      ownerUser = await getAccountById(req.body.owner.id);

      if (!ownerUser) {
        ownerUser = await getAnonymousById(req.body.owner.id);

        if (!ownerUser) {
          res
            .status(StatusCode.NOT_FOUND)
            .json(ApiResponse.error(StatusCode.NOT_FOUND, "Owner not found"));
        } else {
          isAnonymous = true;
        }
      }

      if (isAnonymous) {
        await createUserChannel({
          idAnonymous: ownerUser.id,
          nickname: ownerUser.nickname,
          idChannel: channel.id,
          isAdmin: true,
        });
      } else {
        await createUserChannel({
          idAccount: ownerUser.id,
          nickname: ownerUser.nickname,
          idChannel: channel.id,
          isAdmin: true,
        });
      }

      req.socketIo.of("/").sockets.forEach((socket) => {
        if (socket.user.id == ownerUser.id) {
          socket.join(channel.id);
        }
      });

    } catch (error) {
      console.error("Error creating owner user-channel : ", error);
      deleteChannel(channel.id);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json(
          ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message)
        );
    }

    if (req.body.members) {
      req.body.members.forEach(async (memberId) => {
        try {
          const memberUser = await getAccountById(memberId);

          if (memberUser) {
            await createUserChannel({
              idAccount: memberUser.id,
              nickname: memberUser.nickname,
              idChannel: channel.id,
            });
          }

          const sockets = req.socketIo.of("/").sockets;

          sockets.forEach((socket) => {
            if (socket.user.id == memberId) {
              socket.join(channel.id);
            }
          });

          req.socketIo.emit("refreshChannels");
        } catch (error) {
          console.error("Error creating member user-channel : ", error);
        }
      });
    }

    req.socketIo.emit("refreshChannels");

    const response = channel
      ? ApiResponse.success(StatusCode.CREATED, channel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Channel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const verifyError = Joi.object({
      name: Joi.string(),
      category: Joi.string(),
      image: Joi.string(),
    });

    const idSchema = Joi.string().uuid().required();
    const { idError } = idSchema.validate(id);
    if (idError) {
      return handleJoiValidationError(idError, res);
    }

    const { error } = verifyError.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const channel = await channelService.updateChannel(id, req.body);

    req.socketIo.emit("refreshChannels");

    const response = channel
      ? ApiResponse.success(StatusCode.OK, channel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Channel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const channel = await channelService.deleteChannel(id);

    req.socketIo.emit("refreshChannels");

    const response = channel
      ? ApiResponse.success(StatusCode.OK, channel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Channel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

module.exports = {
  getChannels,
  getChannelById,
  getMessagesByIdChannel,
  createChannel,
  updateChannel,
  deleteChannel,
};
