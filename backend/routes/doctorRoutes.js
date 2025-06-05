const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByUser,
  getAllDoctors,
  getDoctorAppointments
} = require('../controllers/doctorController');
const upload = require('../middleware/uploadMiddleware');
const redisClientPromise = require('../config/redis');
const { authenticateToken } = require('../middleware/auth');
const { redisCacheMiddleware } = require('../middleware/redis.middleware');
const { redisCache, clearCache } = require('../middleware/redisCache');

const router = express.Router();

// Middleware to validate GraphQL API key (unused in current routes)
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (!apiKey || apiKey !== process.env.GRAPHQL_API_KEY) {
    console.log('Invalid or missing GraphQL API key');
    return res.status(401).json({ message: 'Invalid API key' });
  }
  req.apiKey = apiKey;
  console.log('GraphQL API key validated');
  next();
};

// Clear Redis cache for doctor-related keys
const clearDoctorListCache = async () => {
  const redisClient = await redisClientPromise; // Await the Redis client
  try {
    const keys = await redisClient.keys('doctors:*');
    const allDoctorKeys = await redisClient.keys('all_doctors:*');
    if (keys.length > 0) await redisClient.del(keys);
    if (allDoctorKeys.length > 0) await redisClient.del(allDoctorKeys);
    await redisClient.del('all_doctors');
    console.log('Cleared doctor-related cache');
  } catch (error) {
    console.error('Error clearing Redis cache:', error);
  }
};

// Routes
router.get('/all/doctors', redisCacheMiddleware('doctors'), getAllDoctors);
router.get('/by-user/:userId', protect, restrictTo('doctor'), redisCacheMiddleware('doctors:user'), getDoctorsByUser);
router.get('/', protect, restrictTo('doctor'), redisCacheMiddleware('doctors:user'), getDoctorsByUser);
router.get('/id/:id', redisCacheMiddleware('doctors:id'), getDoctor);
router.post('/', protect, restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  createDoctor(req, res, next);
});
router.put('/:id', protect, restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  updateDoctor(req, res, next);
});
router.delete('/:id', protect, restrictTo('doctor'), async (req, res, next) => {
  await clearDoctorListCache();
  deleteDoctor(req, res, next);
});

// Get doctor by ID (cached) - Make this route public by removing protect and authenticateToken
router.get('/:id', redisCache(req => `doctor:${req.params.id}`), getDoctor);

// Get doctor appointments (cached)
router.get('/:id/appointments', 
  authenticateToken,
  redisCache(req => `appointments:${req.params.id}`),
  getDoctorAppointments
);

// Update doctor profile (clears cache)
router.put('/:id', 
  authenticateToken, 
  async (req, res, next) => {
    const redisClient = await redisClientPromise;
    await redisClient.del(`doctor:${req.params.id}`);
    await redisClient.del(`all_doctors:${req.params.id}:partial`);
    next();
  }, 
  updateDoctor
);

// Delete doctor (clears cache)
router.delete('/:id', 
  authenticateToken, 
  async (req, res, next) => {
    const redisClient = await redisClientPromise;
    await redisClient.del(`doctor:${req.params.id}`);
    await redisClient.del(`all_doctors:${req.params.id}:partial`);
    await redisClient.del('all_doctors');
    next();
  }, 
  deleteDoctor
);

module.exports = router;