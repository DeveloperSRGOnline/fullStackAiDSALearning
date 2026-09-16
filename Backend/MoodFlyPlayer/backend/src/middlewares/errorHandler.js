const config = require('../config/environment');

/**
 * Middleware to handle 404 - Not Found errors for unhandled routes
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Resource not found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Centralized global error handling middleware
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = config.nodeEnv === 'development';

  // Log error details for debugging
  console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Error: ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
