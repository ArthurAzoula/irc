const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret, options } = require('../config/jwt.config');
const database = require('../db/models/index');
const { ApiResponse } = require('../util/ApiResponse');
const StatusCode = require('../util/StatusCode');
const Joi = require('joi');
const { Op } = require('sequelize');
const { generateCookie } = require('../config/cookie.config');

const handleJoiValidationError = (error, res, status = StatusCode.BAD_REQUEST) => {
  const response = ApiResponse.error(status, error.message);
  res.status(response.status).json(response);
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, nickname, email, password } = req.body;

    const validationSchema = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      nickname: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }
    
    // Check if nickname or email already exists
    const account = await database.sequelize.models.account.findOne({ where: { nickname } });
    if (account) {
      const response = ApiResponse.error(StatusCode.BAD_REQUEST, 'Nickname already exists');
      return res.status(response.status).json(response);
    }
    const emailExists = await database.sequelize.models.account.findOne({ where: { email } });
    if (emailExists) {
      const response = ApiResponse.error(StatusCode.BAD_REQUEST, 'Email already exists');
      return res.status(response.status).json(response);
    }

    const newUser = await database.sequelize.models.account.create({ firstName, lastName, nickname, email, password });

    const response = ApiResponse.success(StatusCode.CREATED, newUser);
    res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    res.status(response.status).json(response);
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const validationSchema = Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleJoiValidationError(error, res);
    }
    
    const account = await database.sequelize.models.account.findOne({
        where: {
            [Op.or]: [
            { nickname: identifier },
            { email: identifier },
            ],
        },
    });

    if (!account) {
      const response = ApiResponse.error(StatusCode.BAD_REQUEST, 'Nickname or email is wrong');
      return res.status(response.status).json(response);
    }

    const validPassword = await bcrypt.compare(password, account.password);

    if (!validPassword) {
      const response = ApiResponse.error(StatusCode.BAD_REQUEST, 'Password is wrong');
      return res.status(response.status).json(response);
    }

    // delete password from account object
    delete account.dataValues.password;

    const token = jwt.sign({ id: account.id, isAnonymous: false }, process.env.JWT_SECRET, options);

    generateCookie(token, res);

    const response = ApiResponse.success(StatusCode.OK, account);
    res.status(response.status).json(response);
  } catch (error) {
    console.error(error);

    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    res.status(response.status).json(response);
  }
};

const getUserConnected = async (req, res) => {
  try {
    const token = req.signedCookies['token'];
    if(!token) {
      const response = ApiResponse.error(StatusCode.UNAUTHORIZED, 'Unauthorized');
      return res.status(response.status).json(response);
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await database.sequelize.models.account.findOne({ where: { id: decoded.id }, attributes: { exclude: ['password'] } });

    if (user) {
      const response = ApiResponse.success(StatusCode.OK, user);
      return res.status(response.status).json(response);
    }

    const anonymous = await database.sequelize.models.anonymous.findOne({ where: { id: decoded.id } });

    if (anonymous) {
      anonymous.dataValues.isAnonymous = true;
      const response = ApiResponse.success(StatusCode.OK, anonymous);
      return res.status(response.status).json(response);
    }

    const response = ApiResponse.error(StatusCode.NOT_FOUND, 'Account or Anonymous not found');
    res.status(response.status).json(response);
  } catch (error) { 
    console.error(error);

    const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error', error.message);
    res.status(response.status).json(response);
  }
};

const logout = async (req, res) => {
    try {
        generateCookie('', res, 0);
    
        const response = ApiResponse.success(StatusCode.OK, 'User disconnected');
        res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
    
        const response = ApiResponse.error(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error', error.message);
        res.status(response.status).json(response);
    }
};

module.exports = {
  register,
  login,
  getUserConnected,
  logout,
};
