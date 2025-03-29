import express from 'express';
import { inboundSms, outboundSms } from '../controllers/smsController.js';
import authenticate from '../middlewares/authMiddleware.js';


const router = express.Router();


router.post('/inbound/sms/', authenticate, inboundSms);
router.post('/outbound/sms/', authenticate, outboundSms);


router.all('*', (req, res) => {
    res.status(405).json({ message: '', error: '405 Method Not Allowed' });
});

export default router;