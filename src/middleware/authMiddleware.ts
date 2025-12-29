import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to authenticate requests using JWT tokens.
 *
 * This middleware checks for the presence of a Bearer token in the `Authorization` header.
 * If a valid token is provided, it verifies the token using the secret key specified in the
 * `JWT_SECRET` environment variable. Upon successful verification, the decoded token payload
 * is attached to the `req.user` property for downstream middleware and route handlers.
 *
 * If the token is missing, malformed, or invalid, the middleware responds with a 401 Unauthorized error.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @returns Responds with 401 Unauthorized if authentication fails, otherwise calls `next()` to proceed.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};