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
const allowedOrigins = [
  'https://bit-tool.com',
  'https://www.bit-tool.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, or requests without Origin header
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || config.env === 'development') {
      return callback(null, true);
    }
    // Allow any other origins or allow dynamic reflection
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

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
const calendarRoutes = require('./modules/calendar/routes/calendar.routes');
const noteRoutes = require('./modules/notes/routes/note.routes');
const notificationRoutes = require('./modules/notifications/routes/notification.routes');

// Mount routes
app.use('/api/calculator', calculatorRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', commonRoutes);

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
