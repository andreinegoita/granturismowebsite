export class AuthenticationError extends Error{
    statusCode: number;

    constructor( message: string = 'Authentication failed'){
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode= 401;
        Error.captureStackTrace(this, this.constructor);
    }
}