/**
 * Centralized cookie configuration
 * Ensures consistent cookie settings across the application
 */

/**
 * Get cookie options for authentication tokens
 * @returns {Object} Cookie options
 */
function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true, // Prevents JavaScript access to cookie
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/' // Cookie available for all paths
  };
}

/**
 * Get cookie options for clearing cookies
 * @returns {Object} Cookie options for clearing
 */
function getClearCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
}

module.exports = {
  getCookieOptions,
  getClearCookieOptions
};
