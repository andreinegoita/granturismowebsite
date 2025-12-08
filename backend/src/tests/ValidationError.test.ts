import { ValidationError } from '../exceptions/ValidationError';

describe('ValidationError', () => {
  test('should create error with errors array', () => {
    const errors = ['Field1 required', 'Field2 invalid'];
    const error = new ValidationError('Validation failed', errors);
    
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(errors);
  });
});