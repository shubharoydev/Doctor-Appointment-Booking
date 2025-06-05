const redis = require('redis');

// Create a mock Redis client that works when Redis is not available
class MockRedisClient {
  constructor() {
    this.cache = {};
    console.log('Using in-memory cache instead of Redis');
  }

  async get(key) {
    return this.cache[key] || null;
  }

  async setex(key, ttl, value) {
    this.cache[key] = value;
    setTimeout(() => {
      delete this.cache[key]; // Simulate TTL expiration
    }, ttl * 1000);
    return 'OK';
  }

  async del(key) {
    if (Array.isArray(key)) {
      let deleted = 0;
      key.forEach(k => {
        if (this.cache[k]) {
          delete this.cache[k];
          deleted++;
        }
      });
      return deleted;
    }
    if (this.cache[key]) {
      delete this.cache[key];
      return 1;
    }
    return 0;
  }

  async keys(pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Object.keys(this.cache).filter(key => regex.test(key));
  }

  async ping() {
    return 'PONG';
  }
}

// Initialize Redis client
const initializeRedisClient = async () => {
  let redisClient;

  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      connect_timeout: 5000, // 5 seconds
      retry_strategy: (options) => {
        if (options.attempt > 3) {
          return null; // Stop retrying after 3 attempts
        }
        const delay = Math.min(options.attempt * 50, 2000);
        return delay;
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    // Promisify Redis methods
    const util = require('util');
    redisClient.get = util.promisify(redisClient.get);
    redisClient.setex = util.promisify(redisClient.setex);
    redisClient.del = util.promisify(redisClient.del);
    redisClient.keys = util.promisify(redisClient.keys);
    redisClient.ping = util.promisify(redisClient.ping);

    // Test connection with ping
    await redisClient.ping();
    console.log('Redis connection test successful');
    return redisClient;
  } catch (error) {
    console.log('Failed to initialize Redis client:', error.message);
    return new MockRedisClient();
  }
};

// Export the initialized client
module.exports = initializeRedisClient();