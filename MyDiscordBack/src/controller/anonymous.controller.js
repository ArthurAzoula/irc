const Joi = require("joi");
const { ApiResponse } = require("../util/ApiResponse");
const StatusCode = require("../util/StatusCode");
const anonymousService = require("../service/anonymous.service");
const Constant = require("../util/Constant");
const { generateCookie } = require('../config/cookie.config');
const jwt = require("jsonwebtoken");
const { secret, options } = require("../config/jwt.config");

const handleJoiValidationError = (error, res, status = StatusCode.BAD_REQUEST) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const getAnonymous = async (req, res) => {
  try {
    const querySchema = Joi.object({
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
    });

    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const anonymous = await anonymousService.getAnonymous(value);

    const response = anonymous
      ? ApiResponse.success(StatusCode.OK, anonymous)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Anonymous not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const getAnonymousById = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const anonymous = await anonymousService.getAnonymousById(id);

    const response = anonymous
      ? ApiResponse.success(StatusCode.OK, anonymous)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Anonymous not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const createAnonymous = async (req, res) => {
  try {
    const verifySchema = Joi.object({
      nickname: Joi.string().required(),
    });

    const { error: verifyError } = verifySchema.validate(req.body);
    if (verifyError) {
      return handleJoiValidationError(verifyError, res);
    }

    const anonymous = await anonymousService.createAnonymous(req.body);

    const token = jwt.sign({ id: anonymous.id, isAnonymous: true }, process.env.JWT_SECRET, options);

    generateCookie(token, res);

    const response = ApiResponse.success(StatusCode.CREATED, anonymous);

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const updateAnonymous = async (req, res) => {
  try {
    const { id } = req.params;

    const verifySchema = Joi.object({
      nickname: Joi.string().required(),
    });

    const { error: verifyError } = verifySchema.validate(req.body);
    const { error: idError } = Joi.uuid().required().validate(id);

    if (idError) {
      return handleJoiValidationError(idError, res);
    }

    if (verifyError) {
      return handleJoiValidationError(verifyError, res);
    }

    const anonymous = await anonymousService.updateAnonymous(id, req.body);

    const response = anonymous
      ? ApiResponse.success(StatusCode.OK, anonymous)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Anonymous not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const deleteAnonymous = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error: idError } = idSchema.validate(id);
    if (idError) {
      return handleJoiValidationError(idError, res);
    }

    const deleted = await anonymousService.deleteAnonymous(id);

    const response = deleted
      ? ApiResponse.success(StatusCode.NO_CONTENT, null)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Anonymous not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

module.exports = {
  getAnonymous,
  getAnonymousById,
  createAnonymous,
  updateAnonymous,
  deleteAnonymous,
};
