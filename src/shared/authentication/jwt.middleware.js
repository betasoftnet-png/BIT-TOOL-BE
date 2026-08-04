const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../exceptions/AppError');
const config = require('../../config');

const requireAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // JWT from BNX Mail contains: email, appName, userId
    if (!decoded.email || !decoded.appName) {
      return next(new AppError('Invalid token payload. Missing required fields.', StatusCodes.UNAUTHORIZED));
    }

    req.user = {
      email: decoded.email,
      appName: decoded.appName,
      userId: decoded.userId || null
    };

    next();
  } catch (err) {
    return next(new AppError('Invalid token or token has expired', StatusCodes.UNAUTHORIZED));
  }
};

module.exports = requireAuth;
