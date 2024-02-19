const Joi = require("joi");
const { ApiResponse } = require("../util/ApiResponse");
const StatusCode = require("../util/StatusCode");
const userChannelService = require("../service/user-channel.service");
const Constant = require("../util/Constant");
const Logger = require("../helper/Logger.helper");

const handleJoiValidationError = (
  error,
  res,
  status = StatusCode.BAD_REQUEST
) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const getUserChannels = async (req, res) => {
  try {
    const querySchema = Joi.object({
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
    });

    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannels = await userChannelService.getUserChannels(value);

    const response = userChannels
      ? ApiResponse.success(StatusCode.OK, userChannels)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannels not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const getAllUserChannelsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannels = await userChannelService.getAllUserChannelsByUserId(
      id
    );

    const response = userChannels
      ? ApiResponse.success(StatusCode.OK, userChannels)
      : ApiResponse.error(
          StatusCode.NOT_FOUND,
          "channel for this user not found"
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

const getUserChannelByUserIdAndChannelId = async (req, res) => {
  try {
    const { userId, channelId } = req.params;

    const idSchema = Joi.string().uuid().required();

    const { errorId } = idSchema.validate(userId);
    const { errorChannelId } = idSchema.validate(channelId);

    if (errorId || errorChannelId) {
      return handleJoiValidationError(errorId || errorChannelId, res);
    }

    const userChannel = await userChannelService.getUserChannelByUserIdAndChannelId(
      userId,
      channelId
    );

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};


const getAllChannelsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { errorId } = idSchema.validate(id);

    if (errorId) {
      return handleJoiValidationError(error, res);
    }

    const querySchema = Joi.object({
      type: Joi.array().items(Joi.string().valid("all", "public", "private", "group")).default(["all"]),
    });

    Logger.success("Query", req.query);

    const { error, value } = querySchema.validate(req.query);

    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannels = await userChannelService.getAllChannelsByUserId(id, value);

    const response = userChannels
      ? ApiResponse.success(StatusCode.OK, userChannels)
      : ApiResponse.error(
          StatusCode.NOT_FOUND,
          "channel for this user not found"
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

const getAllUserChannelsByChannelId = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);

    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannels = await userChannelService.getAllUserChannelsByChannelId(
      id
    );

    const response = userChannels
      ? ApiResponse.success(StatusCode.OK, userChannels)
      : ApiResponse.error(
          StatusCode.NOT_FOUND,
          "User channel not found for this channel"
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

const getUserChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannel = await userChannelService.getUserChannelById(id);

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const createUserChannel = async (req, res) => {
  try {
    const verifyError = Joi.object({
      idAccount: Joi.string().uuid(),
      idAnonymous: Joi.string().uuid(),
      idChannel: Joi.string().uuid().required(),
      nickname: Joi.string().required(),
      connectedAt: Joi.date().required(),
      disconnectedAt: Joi.date(),
      isAdmin: Joi.boolean().default(false),
    });

    const { error: verify } = verifyError.validate(req.body);
    if (verify) {
      return handleJoiValidationError(verify, res);
    }

    const userChannel = await userChannelService.createUserChannel(req.body);

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const updateUserChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const verifyError = Joi.object({
      idUser: Joi.string().uuid(),
      idAnonymous: Joi.string().uuid(),
      idChannel: Joi.string().uuid(),
      nickname: Joi.string(),
      connectedAt: Joi.date(),
      disconnectedAt: Joi.date(),
    });

    const { error } = verifyError.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannel = await userChannelService.updateUserChannel(
      id,
      req.body
    );

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const deleteUserChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannel = await userChannelService.deleteUserChannel(id);

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(
      StatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
    res.status(response.status).json(response);
  }
};

const updateUserNickname = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname } = req.body;

    const verifyError = Joi.object({
      nickname: Joi.string().required(),
    });

    const { error } = verifyError.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const userChannel = await userChannelService.updateUserNickname(id, nickname);

    const response = userChannel
      ? ApiResponse.success(StatusCode.OK, userChannel)
      : ApiResponse.error(StatusCode.NOT_FOUND, "UserChannel not found");

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
  getUserChannels,
  getUserChannelById,
  getAllUserChannelsByUserId,
  getAllUserChannelsByChannelId,
  getAllChannelsByUserId,
  createUserChannel,
  updateUserChannel,
  deleteUserChannel,
  updateUserNickname,
  getUserChannelByUserIdAndChannelId,
};
