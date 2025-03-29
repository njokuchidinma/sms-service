import pool from '../models/db.js';
import client from '../models/redisClient.js';

export async function inboundSms(req, res) {
    const { from, to, text } = req.body;

    if (!from) return res.status(400).json({ message: '', error: 'from is missing' });
    if (!to) return res.status(400).json({ message: '', error: 'to is missing' });
    if (!text) return res.status(400).json({ message: '', error: 'text is missing' });

    if (from.length < 6 || from.length > 16) return res.status(400).json({ message: '', error: 'from is invalid' });
    if (to.length < 6 || to.length > 16) return res.status(400).json({ message: '', error: 'to is invalid' });
    if (text.length < 1 || text.length > 120) return res.status(400).json({ message: '', error: 'text is invalid' });

    try {
        const query = 'SELECT * FROM phone_number WHERE number = $1 AND account_id = $2';
        const toresult = await pool.query(query, [to, req.account.id]);
        const fromresult = await pool.query(query, [from, req.account.id]);

        if (toresult.rowCount === 0) {
            return res.status(400).json({ message: '', error: 'to parameter is not found' });
        }

        if (fromresult.rowCount === 0) {
            return res.status(400).json({ message: '', error: 'from parameter is not found' });
        }

        const normalizedText = text.trim().toUpperCase();
        if (/^STOP(\r\n?|\n)?$/.test(normalizedText)) {
            const cacheKey = `${from}:${to}`;
            try {
                await client.set(cacheKey, 'blocked', { EX: 14400 });
            } catch (redisError) {
                console.error('Redis Set Error:', redisError);
            }
        }

        const rateLimitKey = `rate_limit:${from}`;
        const currentCount = parseInt(await client.get(rateLimitKey)) || 0;

        if (currentCount >= 50) {
            return res.status(400).json({ message: '', error: `limit reached for from ${from}` });
        }
        await client.incr(rateLimitKey);
        await client.expire(rateLimitKey, 86400);

        return res.status(200).json({ message: 'inbound sms ok', error: '' });
    } catch (error) {
        console.error('Inbound SMS Error:', error);
        return res.status(500).json({ message: '', error: 'unknown failure' });
    }
}

export async function outboundSms(req, res) {
    const { from, to, text } = req.body;

    if (!from) return res.status(400).json({ message: '', error: 'from is missing' });
    if (!to) return res.status(400).json({ message: '', error: 'to is missing' });
    if (!text) return res.status(400).json({ message: '', error: 'text is missing' });

    if (from.length < 6 || from.length > 16) return res.status(400).json({ message: '', error: 'from is invalid' });
    if (to.length < 6 || to.length > 16) return res.status(400).json({ message: '', error: 'to is invalid' });
    if (text.length < 1 || text.length > 120) return res.status(400).json({ message: '', error: 'text is invalid' });

    try {
        const query = 'SELECT * FROM phone_number WHERE number = $1 AND account_id = $2';
        const fromresult = await pool.query(query, [from, req.account.id]);
        const toresult = await pool.query(query, [from, req.account.id]);

        if (fromresult.rowCount === 0) {
            return res.status(400).json({ message: '', error: 'from parameter is not found' });
        }

        if (toresult.rowCount === 0) {
            return res.status(400).json({ message: '', error: 'to parameter is not found' });
        }

        const cacheKey = `${from}:${to}`;
        try {
            const stopRequest = await client.get(cacheKey);
            if (stopRequest) {
                return res.status(400).json({ message: '', error: `sms from ${from} to ${to} blocked by STOP request` });
            }
        } catch (redisError) {
            console.error('Redis Get Error:', redisError);
            return res.status(500).json({ message: '', error: 'service temporarily unavailable, please try again later' });
        }

        const rateLimitKey = `rate_limit:${from}`;
        const currentCount = parseInt(await client.get(rateLimitKey)) || 0;

        if (currentCount >= 50) {
            return res.status(400).json({ message: '', error: `limit reached for from ${from}` });
        }

        await client.incr(rateLimitKey);
        await client.expire(rateLimitKey, 86400);

        console.info(`Outbound SMS Request: From=${from}, To=${to}, Text="${text}"`);

        return res.status(200).json({ message: 'outbound sms ok', error: '' });
    } catch (error) {
        console.error('Outbound SMS Error:', error);
        return res.status(500).json({ message: '', error: 'unknown failure' });
    }
}
