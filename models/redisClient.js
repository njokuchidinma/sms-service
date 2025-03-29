import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

await client.connect();

export default client;
