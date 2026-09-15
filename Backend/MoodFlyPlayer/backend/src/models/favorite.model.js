const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: [true, 'Song is required'],
    },
    favoritedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only favorite the same song once
favoriteSchema.index({ user: 1, song: 1 }, { unique: true });

const favoriteModel = mongoose.model('Favorite', favoriteSchema);

module.exports = favoriteModel;
