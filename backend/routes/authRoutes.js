const express = require('express');
const { doctorSignup, userSignup, verifyEmail, login, refreshToken, forgotPassword, resetPassword, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Doctor signup (requires code)
router.post('/doctor/signup', doctorSignup);

// User signup (no code required)
router.post('/user/signup', userSignup);

// Shared verification for both doctor and user
router.post('/verify-email', verifyEmail);

// Shared login for both doctor and user
router.post('/login', login);

// Shared refresh token for both doctor and user
router.post('/refresh-token', refreshToken);

// Shared forgot password for both doctor and user
router.post('/forgot-password', forgotPassword);

// Shared reset password for both doctor and user
router.post('/reset-password', resetPassword);

// Shared get current user (includes role)
router.get('/user', protect, getCurrentUser);

module.exports = router; // Ensure proper export