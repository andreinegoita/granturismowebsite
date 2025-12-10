import { Response, NextFunction } from 'express';
import { CarRepository } from '../repositories/CarRepository';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError } from '../exceptions/ValidationError';
import { UserCar } from '../models/Car';

export class CarController {
  constructor(private carRepo: CarRepository) {}

  async getAllCars(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      const cars = await this.carRepo.findAllCars(gameId);
      res.json(cars);
    } catch (error) {
      next(error);
    }
  }

  async getUserGarage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      
      const cars = await this.carRepo.findUserCars(userId, gameId);
      res.json(cars);
    } catch (error) {
      next(error);
    }
  }

  async addCarToGarage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { carId, gameId } = req.body;

      if (!carId || !gameId) {
        throw new ValidationError('Car ID and Game ID are required');
      }

      const userCar = new UserCar(userId, carId, gameId);
      const added = await this.carRepo.addCarToUser(userCar);

      res.status(201).json({ message: 'Car added to garage', car: added });
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const carId = parseInt(req.params.id);
      const { isFavorite } = req.body;

      const updated = await this.carRepo.updateUserCar(carId, { isFavorite });

      res.json({ message: 'Favorite status updated', car: updated });
    } catch (error) {
      next(error);
    }
  }

  async getCarStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await this.carRepo.getCarStats(userId);
      const mostUsed = await this.carRepo.getMostUsedCars(userId);

      res.json({ stats, mostUsed });
    } catch (error) {
      next(error);
    }
  }

  async recordCarUsage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { carId, gameId, mileage } = req.body;

      if (!carId || !gameId || !mileage) {
        throw new ValidationError('Car ID, Game ID, and mileage are required');
      }

      await this.carRepo.incrementCarUsage(userId, carId, gameId, mileage);

      res.json({ message: 'Car usage recorded' });
    } catch (error) {
      next(error);
    }
  }
}