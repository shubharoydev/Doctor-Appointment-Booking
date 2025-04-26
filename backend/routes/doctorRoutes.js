const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { createDoctor, getDoctor, updateDoctor, deleteDoctor, getDoctorsByUser, getAllDoctors } = require('../controllers/doctorController');
const upload = require('../middleware/uploadMiddleware');
const redisClient = require('../config/redis');

const router = express.Router();

// Clear Redis cache for doctor list
const clearDoctorListCache = async () => {
  try {
    const keys = await redisClient.keys('doctors:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log('Cleared doctor list cache');
    }
  } catch (error) {
    console.error('Error clearing Redis cache:', error);
  }
};

// Routes
router.get('/all/doctors', getAllDoctors); // Public access
router.get('/by-user/:userId', protect, restrictTo('doctor'), getDoctorsByUser);
router.post('/', protect, restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  createDoctor(req, res, next);
});
router.get('/:id', getDoctor);
router.put('/:id', protect, restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  updateDoctor(req, res, next);
});
router.delete('/:id', protect, restrictTo('doctor'), async (req, res, next) => {
  await clearDoctorListCache();
  deleteDoctor(req, res, next);
});
router.get('/', protect, restrictTo('doctor'), getDoctorsByUser);

module.exports = router;