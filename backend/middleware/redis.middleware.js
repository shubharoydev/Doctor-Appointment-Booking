const redisClientPromise = require('../config/redis');

// Redis caching middleware
const redisCacheMiddleware = (cacheKeyPrefix) => async (req, res, next) => {
  const redisClient = await redisClientPromise;
  try {
    // Generate cache key based on the endpoint
    let cacheKey;
    if (req.path === '/all/doctors' || req.path.endsWith('/all/doctors')) {
      cacheKey = 'all_doctors_list';
    } else if (req.params.id) {
      cacheKey = `${cacheKeyPrefix}:${req.params.id}`;
    } else if (req.params.userId) {
      cacheKey = `${cacheKeyPrefix}:user:${req.params.userId}`;
    } else {
      cacheKey = cacheKeyPrefix;
    }

    // Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }
    console.log(`Cache miss for key: ${cacheKey}`);

    // Override res.json to cache successful responses
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          await redisClient.set(cacheKey, JSON.stringify(data), {
            EX: 3600, // 1 hour
          });
          console.log(`Cached data for key: ${cacheKey}`);
        } catch (cacheError) {
          console.error('Cache storage error:', cacheError.message);
        }
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Redis cache middleware error:', error);
    next(); // Continue to next middleware even if Redis fails
  }
};

module.exports = { redisCacheMiddleware };