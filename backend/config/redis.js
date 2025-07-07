const { createClient } = require('redis');

// Create a mock Redis client that works when Redis is not available
class MockRedisClient {
  constructor() {
    this.cache = {};
   // console.log('Using in-memory cache instead of Redis');
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

  async connect() {
    return true;
  }

  async quit() {
    return 'OK';
  }
}

// Initialize Redis client
const initializeRedisClient = async () => {
  let redisClient;

  try {
    // Use the provided REDIS_URL
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }
   // console.log('Attempting to connect to Redis with URL:', redisUrl.replace(/:[^@]+@/, ':****@')); // Mask password in logs

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
           // console.log('Max retries reached, switching to mock client');
            return new Error('Max retries reached');
          }
          const delay = Math.min(retries * 50, 2000);
          return delay;
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    redisClient.on('end', () => {
      console.log('Redis connection closed');
    });

    // Connect to Redis
    await redisClient.connect();
    console.log('Redis connection established, testing with ping');

    // Test connection with ping
    const pingResult = await redisClient.ping();
    console.log('Redis ping result:', pingResult);

    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error.message);
    redisClient = new MockRedisClient();
    await redisClient.connect(); // Mock connect for compatibility
    return redisClient;
  }
};

// Export the initialized client
module.exports = initializeRedisClient();