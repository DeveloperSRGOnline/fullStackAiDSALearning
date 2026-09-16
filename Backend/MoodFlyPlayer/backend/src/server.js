const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/environment');

const PORT = config.port || 5000;

async function startServer() {
  try {
    // 1. Establish Database Connection first
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();

    // 2. Start Express Server listening on PORT
    const server = app.listen(PORT, () => {
      console.log(`🚀 Moodfly API server listening on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🩺 Health check available at: http://localhost:${PORT}/health`);
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('🔒 HTTP server closed.');
        const mongoose = require('mongoose');
        await mongoose.connection.close(false);
        console.log('📦 MongoDB connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    return server;
  } catch (error) {
    console.error(`❌ Critical server startup error: ${error.message}`);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = { startServer };
