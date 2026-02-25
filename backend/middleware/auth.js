const { verifyToken } = require('../utils/jwtUtils');

/**
 * Authentication middleware to protect routes
 * Extracts JWT from HTTP-only cookie, verifies it, and attaches user info to request
 */
function authenticate(req, res, next) {
  try {
    // Extract token from cookie
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication token is required',
        statusCode: 401
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request object
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
        statusCode: 401
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
        statusCode: 401
      });
    }
    
    // Generic authentication error
    return res.status(401).json({
      success: false,
      error: 'AUTHENTICATION_FAILED',
      message: 'Authentication failed',
      statusCode: 401
    });
  }
}

module.exports = authenticate;
