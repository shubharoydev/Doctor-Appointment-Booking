const redisClientPromise = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour in seconds

const redisCache = (key, ttl = CACHE_TTL) => {
  return async (req, res, next) => {
    const redis = await redisClientPromise; // Await the Redis client
    try {
      // Generate cache key based on request parameters
      const cacheKey = typeof key === 'function' ? key(req) : key;
      
      // Try to get from Redis first
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }
      console.log(`Cache miss for key: ${cacheKey}`);

      // If not in Redis, proceed with the request
      // Store the original res.json method
      const originalJson = res.json;

      // Override res.json method
      res.json = async function(data) {
        // Cache the response in Redis
        await redis.setex(cacheKey, ttl, JSON.stringify(data))
          .catch(err => console.error('Redis caching error:', err));

        // Call the original res.json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Redis cache middleware error:', error);
      next();
    }
  };
};

// Helper function to clear cache
const clearCache = async (pattern) => {
  const redis = await redisClientPromise; // Await the Redis client
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

module.exports = {
  redisCache,
  clearCache
};