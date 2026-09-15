const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      required: [true, 'Artist avatar is required'],
    },
    bannerImage: {
      type: String,
      default: '',
    },
    monthlyListeners: {
      type: Number,
      default: 0,
    },
    monthlyListenersDisplay: {
      type: String, // e.g. "192M Monthly"
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    socialLinks: {
      spotify: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const artistModel = mongoose.model('Artist', artistSchema);

module.exports = artistModel;
