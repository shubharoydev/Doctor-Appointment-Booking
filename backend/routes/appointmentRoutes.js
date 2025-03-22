const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { bookAppointment, getDoctorAppointments, getUserAppointments } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/book', protect, restrictTo('user'), bookAppointment);
router.get('/doctor/:doctorId', protect, getDoctorAppointments);
router.get('/user/:userId', protect, getUserAppointments);
router.get('/user', protect, restrictTo('user'), getUserAppointments);

module.exports = router;