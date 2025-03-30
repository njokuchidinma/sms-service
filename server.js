import express from 'express';
import dotenv from 'dotenv';
import smsRoutes from './routes/smsRoutes.js';



dotenv.config();

const app = express();
app.use(express.json());
app.use(smsRoutes);



const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server is running on http://${HOST}:${PORT}`));


export { app }