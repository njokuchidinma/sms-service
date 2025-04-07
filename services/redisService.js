import client from '../models/redisClient.js';

export async function cacheStopRequest(from, to) {
    const key = `${from}:${to}`;
    await client.set(key, 'blocked', { EX: 14400 });
}

export async function checkStopRequest(from, to) {
    const key = `${from}:${to}`;
    const result = await client.get(key);
    return Boolean(result);
}

export async function incrementRateLimit(from) {
    const key = `rate_limit:${from}`;
    const count = await client.incr(key);
    if (count === 1) {
        await client.expire(key, 86400);
    }
    return count;
}

export async function getRateLimitCount(from) {
    const key = `rate_limit:${from}`;
    const count = await client.get(key);
    return parseInt(count || '0', 10);
}

export default { cacheStopRequest, checkStopRequest, incrementRateLimit, getRateLimitCount };