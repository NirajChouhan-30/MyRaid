const User = require('../models/User');
const { hashPassword } = require('../utils/passwordUtils');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { getCookieOptions } = require('../config/cookieConfig');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });
    
    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        error: field === 'email' ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS',
        message: `A user with this ${field} already exists`,
        statusCode: 400
      });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const user = new User({
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    
    await user.save();
    
    // Return success response (exclude password from response)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      statusCode: 201,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = error.keyPattern.email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        error: field === 'email' ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS',
        message: `A user with this ${field} already exists`,
        statusCode: 400
      });
    }
    
    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred during registration',
      statusCode: 500
    });
  }
}

/**
 * Login a user
 * @route POST /api/auth/login
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401
      });
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401
      });
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      email: user.email
    });
    
    // Set HTTP-only cookie with Secure flag
    res.cookie('token', token, getCookieOptions());
    
    // Return success response with 200 status
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      statusCode: 200,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An error occurred during login',
      statusCode: 500
    });
  }
}

module.exports = {
  registerUser,
  loginUser
};
