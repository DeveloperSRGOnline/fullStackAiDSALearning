const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
      index: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Primary artist is required'],
    },
    featuredArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    releaseYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    totalTracks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const albumModel = mongoose.model('Album', albumSchema);

module.exports = albumModel;
