import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(payload)
        // attach the user request object
        // req.user = payload
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export default auth;