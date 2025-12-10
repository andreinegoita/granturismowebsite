import { Response, NextFunction } from 'express';
import { LicenseRepository } from '../repositories/LicenseRepository';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError } from '../exceptions/ValidationError';
import { UserLicense } from '../models/License';

export class LicenseController {
  constructor(private licenseRepo: LicenseRepository) {}

  async getAllLicenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const licenses = await this.licenseRepo.findAllLicenses();
      res.json(licenses);
    } catch (error) {
      next(error);
    }
  }

  async getUserLicenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      
      const licenses = await this.licenseRepo.findUserLicenses(userId, gameId);
      res.json(licenses);
    } catch (error) {
      next(error);
    }
  }

  async startLicense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { licenseId, gameId } = req.body;

      if (!licenseId || !gameId) {
        throw new ValidationError('License ID and Game ID are required');
      }

      const existing = await this.licenseRepo.findUserLicense(userId, licenseId, gameId);
      if (existing) {
        return res.status(400).json({ message: 'License already started' });
      }

      const userLicense = new UserLicense(userId, licenseId, gameId);
      const created = await this.licenseRepo.createUserLicense(userLicense);

      res.status(201).json({ message: 'License started', license: created });
    } catch (error) {
      next(error);
    }
  }

  async updateLicenseProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const licenseId = parseInt(req.params.id);
      const { status, testsCompleted, bestTime } = req.body;

      const license = await this.licenseRepo.findUserLicense(userId, licenseId, req.body.gameId);
      if (!license) {
        throw new ValidationError('License not found');
      }

      const updated = await this.licenseRepo.updateUserLicense(license.id!, {
        status,
        testsCompleted,
        bestTime
      });

      res.json({ message: 'License progress updated', license: updated });
    } catch (error) {
      next(error);
    }
  }

  async getLicenseStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await this.licenseRepo.getLicenseStats(userId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}