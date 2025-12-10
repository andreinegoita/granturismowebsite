import { Response, NextFunction } from 'express';
import { AchievementRepository } from '../repositories/AchievementRepository';
import { AuthRequest } from '../middleware/auth.middleware';

export class AchievementController {
  constructor(private achievementRepo: AchievementRepository) {}

  async getAllAchievements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const achievements = await this.achievementRepo.findAllAchievements();
      res.json(achievements);
    } catch (error) {
      next(error);
    }
  }

  async getUserAchievements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      
      const achievements = await this.achievementRepo.findUserAchievements(userId, gameId);
      res.json(achievements);
    } catch (error) {
      next(error);
    }
  }

  async getAchievementStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await this.achievementRepo.getAchievementStats(userId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}