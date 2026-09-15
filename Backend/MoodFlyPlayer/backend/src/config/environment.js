const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
};

if (!config.mongoUri) {
  console.warn('⚠️ WARNING: MONGODB_URI is not defined in the environment variables.');
}

module.exports = config;
