import { Router } from 'express';
import { Pool } from 'pg';
import { ReviewController } from '../controllers/ReviewController';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { GameRepository } from '../repositories/GameRepository';
import { authenticateToken } from '../middleware/auth.middleware';

export const createReviewRouter = (pool: Pool) => {
  const router = Router();
  
  const reviewRepo = new ReviewRepository(pool);
  const gameRepo = new GameRepository(pool);
  const reviewController = new ReviewController(reviewRepo, gameRepo);

  router.post('/', authenticateToken, (req, res, next) => reviewController.createReview(req, res, next));

  router.delete('/:id', authenticateToken, (req, res, next) => reviewController.deleteReview(req, res, next));

  router.post('/:id/like', authenticateToken, (req, res, next) => reviewController.likeReview(req, res, next));

  router.post('/:id/dislike', authenticateToken, (req, res, next) => reviewController.dislikeReview(req, res, next));

  return router;
};