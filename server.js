import express from 'express';
import dotenv from 'dotenv';
import smsRoutes from './routes/smsRoutes.js';



dotenv.config();

const app = express();
app.use(express.json());
app.use(smsRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


export { app }