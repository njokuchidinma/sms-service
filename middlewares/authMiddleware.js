import basicAuth from 'basic-auth';
import pool from '../models/db.js';


async function authenticate(req, res, next) {
    const credentials = basicAuth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
        return res.status(403).json({ message: '', error: 'Authentication failed' });
    }

    const { name: username, pass: auth_id } = credentials;

    try {
        const query = 'SELECT * FROM account WHERE username = $1 AND auth_id = $2';
        const result = await pool.query(query, [username, auth_id]);

        if (result.rowCount === 0) {
            return res.status(403).json({ message: '', error: 'Authentication failed' });
        }

        req.account = result.rows[0];
        next();
    } catch(error) {
        console.error('Authentication Error:', error);
        return res.status(500).json({ message: '', error: 'unknown failure' });
    }
}

export default authenticate;