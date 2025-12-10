import { Router } from 'express';
import { ProgressController } from '../controllers/ProgressController';
import { ProgressRepository } from '../repositories/ProgressRepository';
import { LicenseRepository } from '../repositories/LicenseRepository';
import { CarRepository } from '../repositories/CarRepository';
import { TrackRepository } from '../repositories/TrackRepository';
import { AchievementRepository } from '../repositories/AchievementRepository';
import { authenticateToken } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createProgressRouter = (pool: Pool) => {
  const router = Router();
  
  const progressRepo = new ProgressRepository(pool);
  const licenseRepo = new LicenseRepository(pool);
  const carRepo = new CarRepository(pool);
  const trackRepo = new TrackRepository(pool);
  const achievementRepo = new AchievementRepository(pool);
  
  const controller = new ProgressController(
    progressRepo,
    licenseRepo,
    carRepo,
    trackRepo,
    achievementRepo
  );

  router.use(authenticateToken);

  router.get('/', (req, res, next) => controller.getUserProgress(req, res, next));
  router.get('/stats', (req, res, next) => controller.getOverallStats(req, res, next));
  router.get('/:gameId', (req, res, next) => controller.getGameProgress(req, res, next));
  router.post('/start', (req, res, next) => controller.startGame(req, res, next));
  router.put('/:gameId', (req, res, next) => controller.updateProgress(req, res, next));
  router.post('/race', (req, res, next) => controller.recordRace(req, res, next));

  return router;
};