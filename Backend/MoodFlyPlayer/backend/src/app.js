const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Standard body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStateCode = mongoose.connection.readyState;

  res.status(200).json({
    status: 'ok',
    service: 'Moodfly Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStates[dbStateCode] || 'unknown',
      readyState: dbStateCode,
      name: mongoose.connection.name || null,
    },
  });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎧 Welcome to Moodfly Music API',
    status: 'online',
    version: '1.0.0',
    docs: '/health',
  });
});

module.exports = app;
