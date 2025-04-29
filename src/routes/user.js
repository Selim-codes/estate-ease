const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUserProperties
} = require('../controllers/user');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/properties', authenticate, getUserProperties);

module.exports = router;