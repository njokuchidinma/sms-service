import basicAuth from 'basic-auth';
import Account from '../models/Account.js';


async function authenticate(req, res, next) {
    const credentials = basicAuth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
        return res.status(403).json({ message: '', error: 'Authentication failed' });
    }

    const { name: username, pass: auth_id } = credentials;

    try {
        const account = await Account.findOne({ where: { username,  auth_id } });

        if (!account) {
            return res.status(403).json({ message: '', error: 'Authentication failed' });
        }

        req.account = account;
        next();
    } catch(error) {
        console.error('Authentication Error:', error);
        return res.status(500).json({ message: '', error: 'unknown failure' });
    }
}

export default authenticate;