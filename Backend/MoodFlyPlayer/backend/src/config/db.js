const mongoose = require('mongoose');
const config = require('./environment');

/**
 * Connects to MongoDB database using Mongoose.
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB() {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGODB_URI is missing in environment configuration.');
    }

    const conn = await mongoose.connect(config.mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Register runtime connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected.');
    });

    return conn;
  } catch (error) {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
