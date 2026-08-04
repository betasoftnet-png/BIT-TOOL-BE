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
    
    // JWT from BNX Mail contains: sub (email), app_name
    const email = decoded.sub || decoded.email;
    const appName = decoded.app_name || decoded.appName;

    if (!email || !appName) {
      return next(new AppError('Invalid token payload. Missing required fields.', StatusCodes.UNAUTHORIZED));
    }

    req.user = {
      email: email,
      appName: appName,
      userId: decoded.userId || null
    };

    next();
  } catch (err) {
    return next(new AppError('Invalid token or token has expired', StatusCodes.UNAUTHORIZED));
  }
};

module.exports = requireAuth;
