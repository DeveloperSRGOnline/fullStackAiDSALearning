const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/environment');

const PORT = config.port || 5000;

async function startServer() {
  // 1. Establish Database Connection
  await connectDB();

  // 2. Start Express Server
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
}

startServer();
