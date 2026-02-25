/**
 * Centralized error handling middleware
 * Handles different error types and returns appropriate HTTP status codes
 * Formats errors consistently and avoids exposing sensitive information
 */

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * Must be placed after all routes
 */
function errorHandler(err, req, res, next) {
  // Default error values
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = {};

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    errorCode = 'DUPLICATE_ERROR';
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    details = { field };
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = 'Invalid ID format';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Handle express-validator errors
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    const errors = err.array();
    details = errors.reduce((acc, error) => {
      acc[error.path || error.param] = error.msg;
      return acc;
    }, {});
  }

  // Log error for debugging (avoid logging in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', {
      statusCode,
      errorCode,
      message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }

  // Build error response
  const errorResponse = {
    success: false,
    error: errorCode,
    message,
    statusCode
  };

  // Add details only if they exist
  if (Object.keys(details).length > 0) {
    errorResponse.details = details;
  }

  // In development, include stack trace (but not in production)
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 * Handles requests to undefined routes
 */
function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    'NOT_FOUND'
  );
  next(error);
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError
};
