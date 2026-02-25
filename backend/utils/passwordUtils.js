const bcrypt = require('bcrypt');

/**
 * Hash a plaintext password using bcrypt
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} The hashed password
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plaintext password with a hashed password
 * @param {string} plaintext - The plaintext password
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
async function comparePassword(plaintext, hash) {
  return await bcrypt.compare(plaintext, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
