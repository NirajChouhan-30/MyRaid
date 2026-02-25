/**
 * Centralized cookie configuration
 * Ensures consistent cookie settings across the application
 */

/**
 * Get cookie options for authentication tokens
 * @returns {Object} Cookie options
 */
function getCookieOptions() {
  return {
    httpOnly: true, // Prevents JavaScript access to cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/' // Cookie available for all paths
  };
}

/**
 * Get cookie options for clearing cookies
 * @returns {Object} Cookie options for clearing
 */
function getClearCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };
}

module.exports = {
  getCookieOptions,
  getClearCookieOptions
};
