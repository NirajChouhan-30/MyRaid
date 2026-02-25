const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} payload - The payload to encode in the token (typically user ID and email)
 * @returns {string} The generated JWT token
 */
function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  // Token expires in 24 hours
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.verify(token, secret);
}

module.exports = {
  generateToken,
  verifyToken
};
