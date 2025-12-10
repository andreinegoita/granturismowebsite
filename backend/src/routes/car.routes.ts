import { Router } from 'express';
import { CarController } from '../controllers/CarController';
import { CarRepository } from '../repositories/CarRepository';
import { authenticateToken } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createCarRouter = (pool: Pool) => {
  const router = Router();
  const carRepo = new CarRepository(pool);
  const controller = new CarController(carRepo);

  router.get('/all', (req, res, next) => controller.getAllCars(req, res, next));

  router.use(authenticateToken);

  router.get('/garage', (req, res, next) => controller.getUserGarage(req, res, next));
  router.get('/stats', (req, res, next) => controller.getCarStats(req, res, next));
  router.post('/add', (req, res, next) => controller.addCarToGarage(req, res, next));
  router.put('/:id/favorite', (req, res, next) => controller.toggleFavorite(req, res, next));
  router.post('/usage', (req, res, next) => controller.recordCarUsage(req, res, next));

  return router;
};