const Joi = require("joi");
const { ApiResponse } = require("../util/ApiResponse");
const StatusCode = require("../util/StatusCode");
const messageService = require("../service/message.service");
const Constant = require("../util/Constant");

const handleJoiValidationError = (error, res, status = StatusCode.BAD_REQUEST) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const getMessages = async (req, res) => {
  try {
    const querySchema = Joi.object({
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
    });

    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const messages = await messageService.getMessages(value);

    const response = messages
      ? ApiResponse.success(StatusCode.OK, messages)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Messages not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const message = await messageService.getMessageById(id);

    const response = message
      ? ApiResponse.success(StatusCode.OK, message)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Message not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const createMessage = async (req, res) => {
  try {
    const verifyError = Joi.object({
      idUserChannel: Joi.string().uuid().required(),
      idChannel: Joi.string().uuid().required(),
      content: Joi.string().required(),
      image: Joi.string(),
    });

    const { error: verifyValidationError } = verifyError.validate(req.body);
    if (verifyValidationError) {
      return handleJoiValidationError(verifyValidationError, res);
    }

    const message = await messageService.createMessage(req.body);

    const response = message
      ? ApiResponse.success(StatusCode.CREATED, message)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Message not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const verifyError = Joi.object({
      content: Joi.string(),
      image: Joi.string(),
    });

    const { error } = verifyError.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const message = await messageService.updateMessage(id, req.body);

    const response = message
      ? ApiResponse.success(StatusCode.OK, message)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Message not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const message = await messageService.deleteMessage(id);

    const response = message
      ? ApiResponse.success(StatusCode.NO_CONTENT, message)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Message not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
