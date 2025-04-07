import express from 'express';
import { inboundSms, outboundSms } from '../controllers/smsController.js';
import authenticate from '../middlewares/authMiddleware.js';
import validateSchema from '../middlewares/validateSchema.js';
import { inboundSmsSchema, outboundSmsSchema } from '../schemas/smsSchemas.js';


const router = express.Router();


router.post('/inbound/sms/', authenticate, validateSchema(inboundSmsSchema), inboundSms);
router.post('/outbound/sms/', authenticate, validateSchema(outboundSmsSchema), outboundSms);


router.all('*', (req, res) => {
    res.status(405).json({ message: '', error: '405 Method Not Allowed' });
});

export default router;