import PhoneNumber from '../models/PhoneNumber.js';
import redisService from './redisService.js';

async function validatePhoneNumber(number, accountId, type = 'to') {
    const phoneRecord = await PhoneNumber.findOne({ where: { number, account_id: accountId } });
    if (!phoneRecord) throw new Error(`${type} parameter is not found`);
    return phoneRecord;
}

async function handleInboundSms({ from, to, text, accountId }) {
    await validatePhoneNumber(to, accountId, 'to');

    const normalizedText = text.trim().toUpperCase();
    if (["STOP", "STOP\n", "STOP\r", "STOP\r\n"].includes(normalizedText)) {
        await redisService.cacheStopRequest(from, to);
    }

    return { message: 'inbound sms ok', error: '' };
}

async function handleOutboundSms({ from, to, text, accountId }) {
    await validatePhoneNumber(from, accountId, 'from');

    const blocked = await redisService.checkStopRequest(from, to);
    if (blocked) throw new Error(`sms from ${from} to ${to} blocked by STOP request`);

    const rate = await redisService.getRateLimitCount(from);
    if (rate >= 50) throw new Error(`limit reached for from ${from}`);

    await redisService.incrementRateLimit(from);
    return { message: 'outbound sms ok', error: '' };
}

export default { handleInboundSms, handleOutboundSms };
