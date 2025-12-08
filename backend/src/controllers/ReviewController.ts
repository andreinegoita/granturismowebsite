import { Response, NextFunction } from "express";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { GameRepository } from "../repositories/GameRepository";
import { Review } from "../models/Review";
import { AuthRequest } from "../middleware/auth.middleware";
import { ValidationError } from "../exceptions/ValidationError";

export class ReviewController {
  constructor(
    private reviewRepo: ReviewRepository,
    private gameRepo: GameRepository
  ) {}

  async getReviewsByGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gameId = parseInt(req.params.gameId);
      const reviews = await this.reviewRepo.findByGameId(gameId);
      const avgRating = await this.reviewRepo.getAverageRating(gameId);

      res.json({
        reviews,
        averageRating: avgRating,
        totalReviews: reviews.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { gameId, rating, comment } = req.body;
      const userId = req.user!.id;
      const errors: string[] = [];
      if (!rating || rating < 1 || rating > 5) {
        errors.push("Rating must be between 1 and 5");
      }
      if (!comment || comment.length < 10) {
        errors.push("Comment must be at least 10 characters");
      }
      if (comment && comment.length > 1000) {
        errors.push("Comment must not exceed 1000 characters");
      }

      if (errors.length > 0) {
        throw new ValidationError("Review validation failed", errors);
      }

      const game = await this.gameRepo.findById(gameId);
      if (!game) {
        throw new ValidationError("Game not found");
      }

      const review = new Review(userId, gameId, rating, comment);
      const createdReview = await this.reviewRepo.create(review);

      // Update game average rating
      const avgRating = await this.reviewRepo.getAverageRating(gameId);
      await this.gameRepo.update(gameId, { rating: avgRating });

      res.status(201).json(createdReview);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.id);
      const userId = req.user!.id;
      const { rating, comment } = req.body;

      const review = await this.reviewRepo.findById(reviewId);
      if (!review) {
        throw new ValidationError("Review not found");
      }

      // Verifică ownership
      if (review.userId !== userId && req.user!.role !== "admin") {
        throw new ValidationError("Not authorized to update this review");
      }

      const updatedReview = await this.reviewRepo.update(reviewId, {
        rating,
        comment,
      });

      // Update game average rating
      if (review.gameId) {
        const avgRating = await this.reviewRepo.getAverageRating(review.gameId);
        await this.gameRepo.update(review.gameId, { rating: avgRating });
      }

      res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.id);
      const userId = req.user!.id;

      const review = await this.reviewRepo.findById(reviewId);
      if (!review) {
        throw new ValidationError("Review not found");
      }

      // Verifică ownership
      if (review.userId !== userId && req.user!.role !== "admin") {
        throw new ValidationError("Not authorized to delete this review");
      }

      const gameId = review.gameId;
      await this.reviewRepo.delete(reviewId);

      // Update game average rating
      const avgRating = await this.reviewRepo.getAverageRating(gameId);
      await this.gameRepo.update(gameId, { rating: avgRating });

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async likeReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.id);
      await this.reviewRepo.updateLikes(reviewId, true);
      res.json({ message: "Review liked" });
    } catch (error) {
      next(error);
    }
  }

  async dislikeReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.id);
      await this.reviewRepo.updateDislikes(reviewId, true);
      res.json({ message: "Review disliked" });
    } catch (error) {
      next(error);
    }
  }
}
