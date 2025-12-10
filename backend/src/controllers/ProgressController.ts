import { Response, NextFunction } from 'express';
import { ProgressRepository } from '../repositories/ProgressRepository';
import { LicenseRepository } from '../repositories/LicenseRepository';
import { CarRepository } from '../repositories/CarRepository';
import { TrackRepository } from '../repositories/TrackRepository';
import { AchievementRepository } from '../repositories/AchievementRepository';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError } from '../exceptions/ValidationError';
import { UserGameProgress } from '../models/UserGameProgress';

export class ProgressController {
  constructor(
    private progressRepo: ProgressRepository,
    private licenseRepo: LicenseRepository,
    private carRepo: CarRepository,
    private trackRepo: TrackRepository,
    private achievementRepo: AchievementRepository
  ) {}

  async getUserProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const progress = await this.progressRepo.findByUserId(userId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getGameProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = parseInt(req.params.gameId);
      
      const progress = await this.progressRepo.findByUserAndGame(userId, gameId);
      if (!progress) {
        return res.json({ message: 'No progress found for this game' });
      }
      
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async startGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { gameId } = req.body;

      if (!gameId) {
        throw new ValidationError('Game ID is required');
      }

      let progress = await this.progressRepo.findByUserAndGame(userId, gameId);
      
      if (!progress) {
        const newProgress = new UserGameProgress(userId, gameId);
        progress = await this.progressRepo.create(newProgress);
      }

      res.json({ message: 'Game started', progress });
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = parseInt(req.params.gameId);
      const { completionPercentage, hoursPlayed, creditsEarned, totalRaces, racesWon } = req.body;

      const progress = await this.progressRepo.update(userId, gameId, {
        completionPercentage,
        hoursPlayed,
        creditsEarned,
        totalRaces,
        racesWon
      });

      const stats = {
        racesWon,
        completionPercentage,
        licensesObtained: (await this.licenseRepo.findUserLicenses(userId, gameId)).length,
        goldLicenses: (await this.licenseRepo.getLicenseStats(userId)).gold_count,
        carsCollected: (await this.carRepo.getCarStats(userId)).total_cars,
        trackRecords: (await this.trackRepo.getTrackStats(userId)).tracks_mastered
      };

      const newAchievements = await this.achievementRepo.checkAndUnlockAchievements(userId, gameId, stats);

      res.json({ 
        message: 'Progress updated', 
        progress,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined
      });
    } catch (error) {
      next(error);
    }
  }

  async recordRace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { gameId, won, hoursPlayed, creditsEarned } = req.body;

      if (!gameId) {
        throw new ValidationError('Game ID is required');
      }

      await this.progressRepo.incrementRaceStats(userId, gameId, won, hoursPlayed || 0, creditsEarned || 0);

      res.json({ message: 'Race recorded successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getOverallStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const progressStats = await this.progressRepo.getUserStats(userId);
      const licenseStats = await this.licenseRepo.getLicenseStats(userId);
      const carStats = await this.carRepo.getCarStats(userId);
      const trackStats = await this.trackRepo.getTrackStats(userId);
      const achievementStats = await this.achievementRepo.getAchievementStats(userId);

      res.json({
        progress: progressStats,
        licenses: licenseStats,
        cars: carStats,
        tracks: trackStats,
        achievements: achievementStats
      });
    } catch (error) {
      next(error);
    }
  }
}