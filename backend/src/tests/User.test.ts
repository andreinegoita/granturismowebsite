import { User } from '../models/User';

describe('User Model', () => {
  test('should create a user with correct properties', () => {
    const user = new User('testuser', 'test@example.com', 'password123');
    
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('password123');
    expect(user.role).toBe('user');
  });

  test('isAdmin should return true for admin users', () => {
    const admin = new User('admin', 'admin@example.com', 'pass', 'admin');
    expect(admin.isAdmin()).toBe(true);
  });

  test('isAdmin should return false for regular users', () => {
    const user = new User('user', 'user@example.com', 'pass');
    expect(user.isAdmin()).toBe(false);
  });
});