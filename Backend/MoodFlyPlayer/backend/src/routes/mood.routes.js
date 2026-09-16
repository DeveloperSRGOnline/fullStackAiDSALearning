const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');
const userResolver = require('../middlewares/userResolver');

// POST /api/v1/moods/detect (and /api/v1/mood/detect) - Facial telemetry scan & auto-curation
router.post('/detect', userResolver, moodController.detectMood);

// GET /api/v1/moods/recommendations (and /api/v1/mood/recommendations?mood=...)
router.get('/recommendations', moodController.getRecommendations);

// GET /api/v1/moods/history (and /api/v1/mood/history) - User biometric mood scan logs
router.get('/history', userResolver, moodController.getMoodHistory);

// GET /api/v1/moods/vibe/:tag (and /api/v1/mood/vibe/:tag) - Tracks matching specific mood tag
router.get('/vibe/:tag', moodController.getTracksByVibe);

module.exports = router;
