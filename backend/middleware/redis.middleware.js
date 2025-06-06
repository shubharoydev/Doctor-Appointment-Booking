const redisClientPromise = require('../config/redis');

// Redis caching middleware
const redisCacheMiddleware = (cacheKeyPrefix) => async (req, res, next) => {
  const redisClient = await redisClientPromise; // Await the Redis client
  try {
    // Generate cache key
    let cacheKey;
    let isByUserEndpoint = false;
    
    if (req.params.id) {
      cacheKey = `${cacheKeyPrefix}:id:${req.params.id}`; // For getDoctor
    } else if (req.params.userId) {
      cacheKey = `${cacheKeyPrefix}:user:full:${req.params.userId}`; // For getDoctorsByUser with full data
      isByUserEndpoint = true;
    } else if (req.query.user) {
      cacheKey = `${cacheKeyPrefix}:user:limited:${req.query.user}`; // For getDoctorsByUser with query (limited data)
    } else if (req.user) {
      cacheKey = `${cacheKeyPrefix}:user:limited:${req.user._id}`; // For authenticated user (limited data)
    } else {
      cacheKey = cacheKeyPrefix; // For getAllDoctors
    }

    try {
      // Check Redis cache
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
      console.log(`Cache miss for key: ${cacheKey}`);
    } catch (cacheError) {
      console.log(`Cache retrieval error for key ${cacheKey}:`, cacheError.message);
      // Continue execution even if cache retrieval fails
    }
    
    // Override res.json to cache successful responses
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          // Use the new set method with EX option instead of setex
          await redisClient.set(cacheKey, JSON.stringify(data), {
            EX: 3600, // Set expiration to 1 hour (3600 seconds)
          });
          console.log(`Cached data for key: ${cacheKey}`);
        } catch (cacheError) {
          console.log(`Cache storage error for key ${cacheKey}:`, cacheError.message);
          // Continue execution even if caching fails
        }
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Redis cache middleware error:', {
      message: error.message,
      stack: error.stack,
    });
    next(); // Continue even if Redis fails
  }
};

module.exports = { redisCacheMiddleware };