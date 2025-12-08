import { AuthenticationError } from '../exceptions/AuthenticationError';

describe('AuthenticationError', () => {
  test('should create error with default message', () => {
    const error = new AuthenticationError();
    expect(error.message).toBe('Authentication failed');
    expect(error.statusCode).toBe(401);
  });

  test('should create error with custom message', () => {
    const error = new AuthenticationError('Invalid token');
    expect(error.message).toBe('Invalid token');
  });
});