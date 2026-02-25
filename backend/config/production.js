/**
 * Production Environment Configuration
 * This file contains production-specific settings and validations
 */

/**
 * Validate required environment variables for production
 */
const validateProductionEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
    'PORT'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables for production:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    throw new Error('Production environment validation failed');
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('WARNING: JWT_SECRET should be at least 32 characters for production');
  }

  // Validate MongoDB URI format for production
  if (!process.env.MONGODB_URI.startsWith('mongodb://') && 
      !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGODB_URI format');
  }

  console.log('Production environment validation passed');
};

/**
 * Production-specific configurations
 */
const productionConfig = {
  // Database options for production
  mongooseOptions: {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    family: 4 // Use IPv4, skip trying IPv6
  },

  // CORS options for production
  corsOptions: {
    origin: process.env.FRONTEND_URL.split(',').map(url => url.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400
  },

  // Security settings
  security: {
    enforceHttps: process.env.ENFORCE_HTTPS === 'true',
    cookieSecure: true,
    cookieSameSite: 'strict'
  },

  // Rate limiting (if implemented)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

module.exports = {
  validateProductionEnv,
  productionConfig
};
