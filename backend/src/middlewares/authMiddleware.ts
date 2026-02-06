import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // DEV MODE: Bypass Auth
    req.userId = 1;
    req.userEmail = 'admin@age26.com';
    return next();

    /* 
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const { id, email } = decoded as TokenPayload;

        req.userId = id;
        req.userEmail = email;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
    */
}
