import { Router } from 'express';
import { AchievementController } from '../controllers/AchievementController';
import { AchievementRepository } from '../repositories/AchievementRepository';
import { authenticateToken } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createAchievementRouter = (pool: Pool) => {
  const router = Router();
  const achievementRepo = new AchievementRepository(pool);
  const controller = new AchievementController(achievementRepo);

  router.get('/all', (req, res, next) => controller.getAllAchievements(req, res, next));

  router.use(authenticateToken);

  router.get('/my-achievements', (req, res, next) => 
    controller.getUserAchievements(req, res, next)
  );
  router.get('/stats', (req, res, next) => controller.getAchievementStats(req, res, next));

  return router;
};