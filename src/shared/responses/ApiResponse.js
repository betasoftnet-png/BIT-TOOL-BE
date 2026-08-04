const { StatusCodes } = require('http-status-codes');

class ApiResponse {
  static success(res, data, message = 'Success', statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = null) {
    const response = {
      status: 'error',
      message
    };
    
    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
