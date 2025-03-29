import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Ensure required environment variables are available
const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || '6379';
const redisUrl = `redis://${redisHost}:${redisPort}`;

console.log(`Connecting to Redis at ${redisUrl}`);

const client = createClient({ url: redisUrl });

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

try {
  await client.connect();
} catch (err) {
  console.error('Failed to connect to Redis:', err);
  process.exit(1); // Exit the app if Redis connection fails
}

export default client;
