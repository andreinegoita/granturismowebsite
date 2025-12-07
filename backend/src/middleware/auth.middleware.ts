import { Request,Response,NextFunction } from "express";
import { AuthenticationError } from "../exceptions/AuthenticationError";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) =>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            throw new AuthenticationError('Token not provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        req.user = decoded;
        next();
    } catch (error){
        next(new AuthenticationError('Invalid or expired token'));
    }
    
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(req.user?.role !== 'admin'){
        return next(new AuthenticationError('Admin acces required'));
    }
    next();
};