import { Response, NextFunction } from 'express';
import { GameRepository } from '../repositories/GameRepository';
import { Game } from '../models/Game';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError } from '../exceptions/ValidationError';

export class GameController {
  constructor(private gameRepo: GameRepository) {}

  async getAllGames(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const games = await this.gameRepo.findAll();
      res.json(games);
    } catch (error) {
      next(error);
    }
  }

  async getGameById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const game = await this.gameRepo.findById(id);
      
      if (!game) {
        throw new ValidationError('Game not found');
      }

      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async createGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, releaseYear, platform, description, imageUrls } = req.body;

      const errors: string[] = [];
      if (!title) errors.push('Title is required');
      if (!releaseYear) errors.push('Release year is required');
      if (!platform) errors.push('Platform is required');

      if (errors.length > 0) {
        throw new ValidationError('Game validation failed', errors);
      }

      const game = new Game(title, releaseYear, platform, description, imageUrls || []);
      const createdGame = await this.gameRepo.create(game);

      res.status(201).json(createdGame);
    } catch (error) {
      next(error);
    }
  }

  async updateGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const updatedGame = await this.gameRepo.update(id, req.body);

      if (!updatedGame) {
        throw new ValidationError('Game not found');
      }

      res.json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  async deleteGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.gameRepo.delete(id);

      if (!deleted) {
        throw new ValidationError('Game not found');
      }

      res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}