import smsService from '../services/smsService.js';



export async function inboundSms(req, res) {
    const { from, to, text } = req.body;
    try {
        const result = await smsService.handleInboundSms({ from, to, text, accountId: req.account.id });
        return res.status(200).json(result);
    } catch (error) {
        const code = error.message.includes('not found') ? 400 : 500;
        return res.status(code).json({message: '', error: error.message || 'unknown failure' });
    }
}

export async function outboundSms(req, res) {
    const { from, to, text } = req.body;
    try {
        const result = await smsService.handleOutboundSms({ from, to, text, accountId: req.account.id });
        return res.status(200).json(result);
    } catch (error) {
        const code = error.message.includes('not found') ? 400 : 500;
        return res.status(400).json({ message: '', error: error.message || 'unknown failure' });
    }
}


