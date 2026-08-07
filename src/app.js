const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');

const config = require('./config');
const globalErrorHandler = require('./shared/exceptions/errorHandler');
const AppError = require('./shared/exceptions/AppError');
const ApiResponse = require('./shared/responses/ApiResponse');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Development logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Base routes
app.get('/health', (req, res) => {
  return ApiResponse.success(res, null, 'Bit Tool Backend is running healthily');
});

// Module routes
const calculatorRoutes = require('./modules/calculator/routes/calculator.routes');
const compareRoutes = require('./modules/calculator/routes/compare.routes');
const commonRoutes = require('./modules/common/routes/common.routes');
const contactRoutes = require('./modules/contacts/routes/contact.routes');

// Mount routes
app.use('/api/calculator', calculatorRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api', commonRoutes);

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
