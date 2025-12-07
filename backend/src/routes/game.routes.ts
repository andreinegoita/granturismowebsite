import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { GameRepository } from '../repositories/GameRepository';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { Pool } from 'pg';

export const createGameRouter = (pool: Pool) => {
  const router = Router();
  const gameRepo = new GameRepository(pool);
  const gameController = new GameController(gameRepo);

  router.get('/', (req, res, next) => gameController.getAllGames(req, res, next));
  router.get('/:id', (req, res, next) => gameController.getGameById(req, res, next));
  router.post('/', authenticateToken, requireAdmin, (req, res, next) => 
    gameController.createGame(req, res, next)
  );
  router.put('/:id', authenticateToken, requireAdmin, (req, res, next) => 
    gameController.updateGame(req, res, next)
  );
  router.delete('/:id', authenticateToken, requireAdmin, (req, res, next) => 
    gameController.deleteGame(req, res, next)
  );

  return router;
};