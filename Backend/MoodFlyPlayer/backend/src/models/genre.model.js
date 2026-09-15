const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Genre name is required'],
      unique: true,
      trim: true,
      index: true,
    },
    vibeDescriptor: {
      type: String,
      trim: true,
      default: '', // e.g., "Rhythm", "Organic", "Atmosphere", "Energy", "Relaxed", "Soul"
    },
    accentColor: {
      type: String,
      default: '#10b981', // Emerald, Cyan, or Violet Hex code
    },
    coverImage: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const genreModel = mongoose.model('Genre', genreSchema);

module.exports = genreModel;
