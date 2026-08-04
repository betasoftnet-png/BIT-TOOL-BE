const logger = require('../logger');
const config = require('../../config');
const AppError = require('./AppError');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../responses/ApiResponse');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }
  
  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  return ApiResponse.error(res, 'Something went very wrong!', StatusCodes.INTERNAL_SERVER_ERROR);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    
    if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token. Please log in again.', StatusCodes.UNAUTHORIZED);
    }
    if (error.name === 'TokenExpiredError') {
      error = new AppError('Your token has expired! Please log in again.', StatusCodes.UNAUTHORIZED);
    }
    
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
