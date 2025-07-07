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
    //console.log('Invalid or missing GraphQL API key');
    return res.status(401).json({ message: 'Invalid API key' });
  }
  req.apiKey = apiKey;
  //console.log('GraphQL API key validated');
  next();
};

// Clear Redis cache for all doctor-related keys
const clearDoctorListCache = async () => {
  const redisClient = await redisClientPromise;
  try {
    // Clear all doctor-related cache keys
    const [doctorKeys, allDoctorKeys, doctorListKeys] = await Promise.all([
      redisClient.keys('doctors:*'),      // Individual doctor caches
      redisClient.keys('all_doctors*'),   // All doctors list cache
      redisClient.keys('doctor:*')        // Alternative doctor cache keys
    ]);
    
    const allKeys = [...new Set([...doctorKeys, ...allDoctorKeys, ...doctorListKeys])];
    
    if (allKeys.length > 0) {
      await redisClient.del(allKeys);
      //console.log('Cleared doctor-related cache keys:', allKeys);
      
      // Also clear the specific keys we know about
      await redisClient.del('all_doctors_list');
      //console.log('Cleared all_doctors_list cache');
    } else {
      //console.log('No doctor-related cache keys found to clear');
    }
  } catch (error) {
    console.error('Error clearing Redis cache:', error);
  }
};

// New endpoint to clear only private profile cache
router.delete('/clear-private-cache', protect, restrictTo('doctor'), async (req, res) => {
  const redisClient = await redisClientPromise;
  try {
    // Delete only private profile keys (doctors:user:*)
    const privateKeys = await redisClient.keys('doctors:user:*');
    if (privateKeys.length > 0) {
      await redisClient.del(privateKeys);
      //console.log(`Cleared private profile cache keys: ${privateKeys.join(', ')}`);
    } else {
      //console.log('No private profile cache keys found to clear');
    }
    res.status(200).json({ message: 'Private profile cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing private profile cache:', error);
    res.status(500).json({ message: 'Failed to clear private profile cache', error: error.message });
  }
});

// Public routes - no authentication required
router.get('/all/doctors', redisCacheMiddleware('doctors'), getAllDoctors);

// Get doctor by ID (cached) - Public route
router.get('/:id', redisCacheMiddleware('doctors'), getDoctor);

// Protected routes - require authentication
router.use(protect);

// Doctor-specific routes
router.get('/by-user/:userId', restrictTo('doctor'), getDoctorsByUser);
router.post('/', restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  createDoctor(req, res, next);
});
router.put('/:id', restrictTo('doctor'), upload.single('picture'), async (req, res, next) => {
  await clearDoctorListCache();
  updateDoctor(req, res, next);
});
router.delete('/:id', restrictTo('doctor'), async (req, res, next) => {
  await clearDoctorListCache();
  deleteDoctor(req, res, next);
});

// Get doctor appointments (no caching)
router.get('/:id/appointments', authenticateToken, getDoctorAppointments);

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
  protect, 
  restrictTo('doctor'), 
  async (req, res, next) => {
    try {
      const redisClient = await redisClientPromise;
    const keysToClear = [
  `doctor:${req.params.id}`,
  `doctors:id:${req.params.id}`, // ✅ Add this!
  `all_doctors:${req.params.id}:partial`,
  'all_doctors',
  'doctors',
];


      // Add wildcard pattern for any variations (e.g., doctors:query)
      const wildcardKeys = await redisClient.keys('doctors:*');
      if (wildcardKeys.length > 0) {
        keysToClear.push(...wildcardKeys);
      }

      // Log keys before deletion
      //console.log('Keys to clear:', keysToClear);

      // Delete each key individually and log the result
      for (const key of keysToClear) {
        try {
          const deleted = await redisClient.del(key);
          //console.log(`Deleted key ${key}: ${deleted} (1 = success, 0 = key not found)`);
        } catch (err) {
          console.error(`Error deleting key ${key}:`, err.message);
        }
      }

      // Publish invalidation for each key
      for (const key of keysToClear) {
        await publishCacheInvalidation(redisClient, key);
      }

      //console.log(`Completed cache clearing for doctor:${req.params.id}`);
      next();
    } catch (cacheError) {
      console.error('Redis cache deletion error:', cacheError.message);
      next();
    }
  }, 
  deleteDoctor
);



module.exports = router;