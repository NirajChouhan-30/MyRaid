const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { getClearCookieOptions } = require('../config/cookieConfig');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', validateLogin, loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout a user (clear cookie)
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', getClearCookieOptions());
  
  return res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
