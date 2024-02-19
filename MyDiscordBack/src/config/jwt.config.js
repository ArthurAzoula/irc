const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || generateSecretToken();
const refreshSecret = process.env.JWT_REFRESH_SECRET || generateRefreshToken();

const   options = {
  expiresIn: 60 * 60 * 24,
};

const refreshOptions = {
  expiresIn: '7d', 
};

function generateSecretToken() {
  return crypto.randomBytes(64).toString('hex');
}


function generateRefreshToken() {
  return crypto.randomBytes(128).toString('hex');
}

function signToken(payload, options, secret) {
  return jwt.sign(payload, secret, options);
}

module.exports = {
  secret,
  options,
  refreshOptions,
  refreshSecret,
  generateSecretToken,
  generateRefreshToken,
  signToken,
};
