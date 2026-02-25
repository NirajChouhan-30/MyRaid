const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 */
const connectDB = async (retries = 5, delay = 5000) => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  let attempt = 0;

  while (attempt < retries) {
    try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection attempt ${attempt} failed:`, error.message);
      
      if (attempt >= retries) {
        console.error('Max retry attempts reached. Exiting...');
        process.exit(1);
      }
      
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to application termination');
  process.exit(0);
});

module.exports = connectDB;
