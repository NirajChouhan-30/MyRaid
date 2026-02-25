const { body, validationResult } = require('express-validator');

/**
 * Validation middleware for user registration
 */
const validateRegistration = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  }
];

/**
 * Validation middleware for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  }
];

/**
 * Validation middleware for task creation
 */
const validateTaskCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  }
];

/**
 * Validation middleware for task update
 */
const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('status')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Status cannot be empty')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateTaskCreation,
  validateTaskUpdate
};
