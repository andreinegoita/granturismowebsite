import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';
import { ValidationError } from '../exceptions/ValidationError';
import { AuthenticationError } from '../exceptions/AuthenticationError';

export class AuthController {
  constructor(private userRepo: UserRepository) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, role } = req.body;

      const errors: string[] = [];
      if (!username || username.length < 3) errors.push('Username must be at least 3 characters');
      if (!email || !email.includes('@')) errors.push('Valid email is required');
      if (!password || password.length < 6) errors.push('Password must be at least 6 characters');

      if (errors.length > 0) {
        throw new ValidationError('Registration validation failed', errors);
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        throw new ValidationError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User(username, email, hashedPassword, role || 'user');
      const createdUser = await this.userRepo.create(user);

      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email, role: createdUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
}