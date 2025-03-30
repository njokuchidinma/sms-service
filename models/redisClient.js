import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Build the Redis URL from environment variables
const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || '6379';
const redisPassword = process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : '';
const redisUrl = `redis://${redisPassword}${redisHost}:${redisPort}`;

console.log(`Connecting to Redis at ${redisUrl}`);

const client = createClient({
  url: redisUrl,
  socket: {
    tls: false,
  },
});

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Error:', err));

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('Successfully connected to Redis!');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
})();

export default client;
