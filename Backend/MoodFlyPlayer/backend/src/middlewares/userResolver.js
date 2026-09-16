const mongoose = require('mongoose');
const { User } = require('../models');

/**
 * Middleware to resolve the active user for user-dependent routes
 * (Playlists, Favorites, Recents, Mood Logs).
 * 
 * Resolution strategy:
 * 1. Checks 'x-user-id' header
 * 2. Checks 'authorization' header (Bearer <id>)
 * 3. Checks req.body.userId or req.query.userId
 * 4. Fallback: Automatically resolves the 'demo@moodfly.io' user or first user in DB
 * 
 * This ensures frontend and API testing work seamlessly without authentication hurdles.
 */
async function userResolver(req, res, next) {
  try {
    let targetUserId =
      req.headers['x-user-id'] ||
      req.query.userId ||
      (req.body && req.body.userId);

    // Also support "Bearer <userId>" if passed
    if (!targetUserId && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && mongoose.Types.ObjectId.isValid(parts[1])) {
        targetUserId = parts[1];
      }
    }

    let user = null;

    if (targetUserId && mongoose.Types.ObjectId.isValid(targetUserId)) {
      user = await User.findById(targetUserId);
    }

    // Fallback to demo user if no explicit user provided or not found
    if (!user) {
      user = await User.findOne({ email: 'demo@moodfly.io' });
    }

    // If demo user doesn't exist, fallback to any existing user
    if (!user) {
      user = await User.findOne();
    }

    if (user) {
      req.user = user;
      req.userId = user._id;
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = userResolver;
