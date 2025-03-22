const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Create or update user profile (POST for new, PUT for update)
router.post('/', protect, restrictTo('user'), upload.single('picture'), createUserProfile);
router.put('/', protect, restrictTo('user'), upload.single('picture'), updateUserProfile);

// Routes with specific profile ID
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, upload.single('picture'), updateUserProfile);
router.delete('/:id', protect, deleteUserProfile);

// Get user profile (current user)
router.get('/', protect, restrictTo('user'), getUserProfile);

// Delete user profile (current user)
router.delete('/', protect, restrictTo('user'), deleteUserProfile);

module.exports = router; // Ensure proper export