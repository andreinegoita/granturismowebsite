import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../repositories/UserRepository';
import { Pool } from 'pg';

export const createAuthRouter = (pool: Pool) => {
  const router = Router();
  const userRepo = new UserRepository(pool);
  const authController = new AuthController(userRepo);

  router.post('/register', (req, res, next) => authController.register(req, res, next));
  router.post('/login', (req, res, next) => authController.login(req, res, next));

  return router;
};