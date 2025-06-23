const redisClientPromise = require('../config/redis');

const redisCache = (generateCacheKey) => async (req, res, next) => {
  const redisClient = await redisClientPromise;
  const cacheKey = generateCacheKey(req);
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cachedData}:`);
      return res.status(200).json(JSON.parse(cachedData));
    }
    const originalJson = res.json.bind(res);
    res.json = async (data) => {
      try {
        await redisClient.set(cacheKey, JSON.stringify(data), { 
          EX: 3600 // Set expiration to 1 hour (3600 seconds)
        });
      } catch (error) {
        console.error(`Error setting key ${cacheKey}:`, error);
      }
      return originalJson(data);
    };
    next();
  } catch (error) {
    console.error('Redis cache error:', error);
    next();
  }
};

const clearCache = async (cacheKey) => {
  const redisClient = await redisClientPromise;
  try {
    const result = await redisClient.del(cacheKey);
    console.log(`Cleared cache for ${cacheKey}: ${result}`);
  } catch (error) {
    console.error(`Error clearing cache for ${cacheKey}:`, error);
  }
};

module.exports = { redisCache, clearCache };