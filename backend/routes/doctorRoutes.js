const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { createDoctor, getDoctor, updateDoctor, deleteDoctor, getDoctorsByUser, getAllDoctors } = require('../controllers/doctorController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Specific routes first
router.get('/all/doctors', getAllDoctors); // Public access to all doctors
router.get('/by-user/:userId', getDoctorsByUser); // Get doctor by user ID

// CRUD operations
router.post('/', protect, restrictTo('doctor'), upload.single('picture'), createDoctor); // Doctor registration
router.get('/:id', getDoctor); // Public access to individual doctor
router.put('/:id', protect, restrictTo('doctor'), upload.single('picture'), updateDoctor); // Edit doctor
router.delete('/:id', protect, restrictTo('doctor'), deleteDoctor); // Delete doctor

// Generic routes last
router.get('/', getDoctorsByUser); // Doctor's own profiles (with query param)

module.exports = router;