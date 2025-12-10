import { Response, NextFunction } from 'express';
import { TrackRepository } from '../repositories/TrackRepository';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError } from '../exceptions/ValidationError';
import { TrackRecord } from '../models/Track';

export class TrackController {
  constructor(private trackRepo: TrackRepository) {}

  async getAllTracks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      const tracks = await this.trackRepo.findAllTracks(gameId);
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }

  async getTrackById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trackId = parseInt(req.params.id);
      const track = await this.trackRepo.findTrackById(trackId);
      
      if (!track) {
        throw new ValidationError('Track not found');
      }

      res.json(track);
    } catch (error) {
      next(error);
    }
  }

  async getUserRecords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      
      const records = await this.trackRepo.findUserRecords(userId, gameId);
      res.json(records);
    } catch (error) {
      next(error);
    }
  }

  async getTrackLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trackId = parseInt(req.params.trackId);
      const gameId = parseInt(req.params.gameId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const leaderboard = await this.trackRepo.findTrackLeaderboard(trackId, gameId, limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  async submitRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { trackId, carId, gameId, lapTime, sector1, sector2, sector3, weather, tyreCompound, isAssisted } = req.body;

      if (!trackId || !carId || !gameId || !lapTime) {
        throw new ValidationError('Track ID, Car ID, Game ID, and lap time are required');
      }

      if (lapTime <= 0) {
        throw new ValidationError('Invalid lap time');
      }

      const record = new TrackRecord(userId, trackId, carId, gameId, lapTime);
      record.sector1 = sector1;
      record.sector2 = sector2;
      record.sector3 = sector3;
      record.weather = weather;
      record.tyreCompound = tyreCompound;
      record.isAssisted = isAssisted || false;

      const created = await this.trackRepo.createRecord(record);

      res.status(201).json({ 
        message: 'Record submitted successfully', 
        record: created 
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBestLap(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const trackId = parseInt(req.params.trackId);
      const gameId = parseInt(req.params.gameId);

      const record = await this.trackRepo.getUserBestLap(userId, trackId, gameId);
      
      if (!record) {
        return res.json({ message: 'No record found' });
      }

      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async getTrackStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await this.trackRepo.getTrackStats(userId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}