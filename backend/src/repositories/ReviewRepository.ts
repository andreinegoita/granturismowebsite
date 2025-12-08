import { Review } from '../models/Review';
import { BaseRepository } from './BaseRepository';
import { Pool } from 'pg';

export class ReviewRepository extends BaseRepository<Review> {
  constructor(pool: Pool) {
    super(pool, 'reviews');
  }

  async findAll(): Promise<Review[]> {
    const result = await this.pool.query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    return result.rows;
  }

  async findByGameId(gameId: number): Promise<Review[]> {
    const result = await this.pool.query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.game_id = $1
      ORDER BY r.created_at DESC
    `, [gameId]);
    return result.rows;
  }

  async findById(id: number): Promise<Review | null> {
    const result = await this.pool.query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async create(review: Review): Promise<Review> {
    const result = await this.pool.query(`
      INSERT INTO reviews (user_id, game_id, rating, comment)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [review.userId, review.gameId, review.rating, review.comment]);
    return result.rows[0];
  }

  async update(id: number, review: Partial<Review>): Promise<Review | null> {
    const result = await this.pool.query(`
      UPDATE reviews 
      SET rating = COALESCE($2, rating),
          comment = COALESCE($3, comment),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `, [id, review.rating, review.comment]);
    return result.rows[0] || null;
  }

  async getAverageRating(gameId: number): Promise<number> {
    const result = await this.pool.query(`
      SELECT AVG(rating)::numeric(3,2) as avg_rating
      FROM reviews
      WHERE game_id = $1
    `, [gameId]);
    return parseFloat(result.rows[0].avg_rating) || 0;
  }

  async updateLikes(reviewId: number, increment: boolean): Promise<void> {
    await this.pool.query(`
      UPDATE reviews 
      SET likes = likes + $2
      WHERE id = $1
    `, [reviewId, increment ? 1 : -1]);
  }

  async updateDislikes(reviewId: number, increment: boolean): Promise<void> {
    await this.pool.query(`
      UPDATE reviews 
      SET dislikes = dislikes + $2
      WHERE id = $1
    `, [reviewId, increment ? 1 : -1]);
  }
}