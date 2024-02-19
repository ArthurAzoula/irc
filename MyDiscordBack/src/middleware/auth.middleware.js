const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../util/ApiResponse');
const StatusCode = require('../util/StatusCode');

const checkToken = (req, res, next) => {
    const accessToken = req.signedCookies['token'];
  
    if (!accessToken) {
      const response = ApiResponse.error(StatusCode.UNAUTHORIZED, 'Unauthorized');
      return res.status(401).json(response);
    }
  
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
module.exports = checkToken;