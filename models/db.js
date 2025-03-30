import pg from "pg";
import dotenv from 'dotenv';



const { Pool } = pg;

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Set to true if you have proper SSL certs
    }
});


pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error', err);
});


export default pool;