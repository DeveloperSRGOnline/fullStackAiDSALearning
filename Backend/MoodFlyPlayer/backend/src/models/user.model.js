const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default in queries
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    role: {
      type: String,
      enum: ['user', 'artist', 'admin'],
      default: 'user',
    },
    preferences: {
      favoriteGenres: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Genre',
        },
      ],
      preferredMoods: [
        {
          type: String,
          trim: true,
        },
      ],
      webcamMoodDetectionEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
