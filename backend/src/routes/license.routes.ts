import { Router } from 'express';
import { LicenseController } from '../controllers/LicenseController';
import { LicenseRepository } from '../repositories/LicenseRepository';
import { authenticateToken } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createLicenseRouter = (pool: Pool) => {
  const router = Router();
  const licenseRepo = new LicenseRepository(pool);
  const controller = new LicenseController(licenseRepo);

  router.get('/all', (req, res, next) => controller.getAllLicenses(req, res, next));

  router.use(authenticateToken);

  router.get('/my-licenses', (req, res, next) => controller.getUserLicenses(req, res, next));
  router.get('/stats', (req, res, next) => controller.getLicenseStats(req, res, next));
  router.post('/start', (req, res, next) => controller.startLicense(req, res, next));
  router.put('/:id', (req, res, next) => controller.updateLicenseProgress(req, res, next));

  return router;
};