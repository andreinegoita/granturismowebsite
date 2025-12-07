export class ValidationError extends Error{
    statusCode: number;
    errors: string[];

    constructor(message : string = 'Validation failed', errors: string[] = []){
        super(message);
        this.name= 'ValidationError';
        this.statusCode = 400;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}