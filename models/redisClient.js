import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Use the REDIS_URL directly from the environment variables
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('REDIS_URL is not defined. Ensure it is set in the environment variables.');
  process.exit(1);
}

console.log(`Connecting to Redis at ${redisUrl}`);

// Create the Redis client using the connection URL with TLS
const client = createClient({
  url: redisUrl,
  socket: {
    tls: true,
    rejectUnauthorized: false, // Bypass certificate validation (needed for Railway)
  }
});

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
