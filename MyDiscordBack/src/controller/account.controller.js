const Joi = require("joi");
const { ApiResponse } = require("../util/ApiResponse");
const StatusCode = require("../util/StatusCode");
const userService = require("../service/account.service");
const Constant = require("../util/Constant");

const handleJoiValidationError = (error, res, status = StatusCode.BAD_REQUEST) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const getAccounts = async (req, res) => {
  try {
    const querySchema = Joi.object({
      limit: Joi.number().integer().min(1).default(Constant.LIMIT),
      offset: Joi.number().integer().min(0).default(Constant.OFFSET),
      search: Joi.string().min(0).default(""),
    });

    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return handleJoiValidationError(error, res);
    }

    const users = await userService.getAccounts(value);

    const response = users
      ? ApiResponse.success(StatusCode.OK, users)
      : ApiResponse.error(StatusCode.NOT_FOUND, "Users not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error } = idSchema.validate(id);
    if (error) {
      return handleJoiValidationError(error.message, res);
    }

    const user = await userService.getAccountById(id);

    const response = user
      ? ApiResponse.success(StatusCode.OK, user)
      : ApiResponse.error(StatusCode.NOT_FOUND, "User not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const createAccount = async (req, res) => {
  try {
    const verifyError = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      nickname: Joi.string().required(),
      mail: Joi.string().email().required(),
      password: Joi.string().required(),
      image: Joi.string(),
    });

    const { error: verify } = verifyError.validate(req.body);
    if (verify) {
      return handleJoiValidationError(verify, res);
    }

    const user = await userService.createAccount(req.body);

    const response = ApiResponse.success(StatusCode.CREATED, user);
    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const verifyError = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      nickname: Joi.string(),
      mail: Joi.string().email(),
      password: Joi.string(),
      image: Joi.string(),
    });

    const idSchema = Joi.string().uuid().required();
    const { error: idError } = idSchema.validate(id);
    const { error: verify } = verifyError.validate(req.body);
    if (idError) {
      return handleJoiValidationError(idError, res, StatusCode.INVALID_ID);
    }
    if (verify) {
      return handleJoiValidationError(verify, res);
    }

    const [updated] = await userService.updateAccount(id, req.body);

    const response = updated
      ? ApiResponse.success(StatusCode.OK, await userService.getUserById(id))
      : ApiResponse.error(StatusCode.NOT_FOUND, "Account not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const idSchema = Joi.string().uuid().required();
    const { error: idError } = idSchema.validate(id);
    if (idError) {
      return handleJoiValidationError(idError, res, StatusCode.INVALID_ID);
    }

    const deleted = await userService.deleteAccount(id);

    const response = deleted
      ? ApiResponse.success(StatusCode.OK, "Account deleted")
      : ApiResponse.error(StatusCode.NOT_FOUND, "Account not found");

    res.status(response.status).json(response);
  } catch (error) {
    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, error.message);
    res.status(response.status).json(response);
  }
};

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
