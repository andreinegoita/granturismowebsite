import { AuthenticationError } from "../exceptions/AuthenticationError";
import { ValidationError } from "../exceptions/ValidationError";
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    if(err instanceof AuthenticationError){
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        });
    }

    if(err instanceof ValidationError){
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
            errors: err.errors
        });
    }

    return res.status(500).json({
        error: 'InternalServerError',
        message: "Something went wrong"
    });
};