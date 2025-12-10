import { Router } from 'express';
import { TrackController } from '../controllers/TrackController';
import { TrackRepository } from '../repositories/TrackRepository';
import { authenticateToken } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createTrackRouter = (pool: Pool) => {
  const router = Router();
  const trackRepo = new TrackRepository(pool);
  const controller = new TrackController(trackRepo);

  router.get('/all', (req, res, next) => controller.getAllTracks(req, res, next));
  router.get('/:id', (req, res, next) => controller.getTrackById(req, res, next));
  router.get('/leaderboard/:trackId/:gameId', (req, res, next) => 
    controller.getTrackLeaderboard(req, res, next)
  );

  router.use(authenticateToken);

  router.get('/my-records/all', (req, res, next) => controller.getUserRecords(req, res, next));
  router.get('/best-lap/:trackId/:gameId', (req, res, next) => 
    controller.getUserBestLap(req, res, next)
  );
  router.get('/stats/user', (req, res, next) => controller.getTrackStats(req, res, next));
  router.post('/record', (req, res, next) => controller.submitRecord(req, res, next));

  return router;
};