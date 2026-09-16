const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/environment');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// ==========================================
// Global Middlewares Pipeline
// ==========================================

// 1. Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 2. HTTP Request Logger
const morganFormat = config.nodeEnv === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// 3. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Base Routes
// ==========================================

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

// Welcome / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🎧 Welcome to Moodfly Music API',
    status: 'online',
    version: '1.0.0',
    docs: '/health',
  });
});

// ==========================================
// Error Handling Pipeline
// ==========================================

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
