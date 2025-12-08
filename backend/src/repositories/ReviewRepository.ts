import { Pool } from 'pg';
import { Review } from '../models/Review';

export class ReviewRepository {
  update(reviewId: number, arg1: { rating: any; comment: any; }) {
      throw new Error("Method not implemented.");
  }
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private mapRowToReview(row: any): any {
    return {
      id: row.id,
      userId: row.user_id,       
      gameId: row.game_id,       
      rating: row.rating,
      comment: row.comment,
      likes: row.likes,
      dislikes: row.dislikes,
      createdAt: row.created_at, 
      updatedAt: row.updated_at,
      username: row.username || 'Unknown User'
    };
  }

  async findByGameId(gameId: number): Promise<any[]> {
    const query = `
      SELECT r.*, u.username 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.game_id = $1
      ORDER BY r.created_at DESC
    `;
    
    const result = await this.pool.query(query, [gameId]);
    
    return result.rows.map(row => this.mapRowToReview(row));
  }

  async create(review: Review): Promise<Review> {
    const query = `
      INSERT INTO reviews (user_id, game_id, rating, comment, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      review.userId, 
      review.gameId, 
      review.rating, 
      review.comment
    ]);


    return this.mapRowToReview(result.rows[0]);
  }

  async findById(id: number): Promise<Review | null> {
    const query = `SELECT * FROM reviews WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    const review = new Review(row.user_id, row.game_id, row.rating, row.comment);
    review.id = row.id;
    review.likes = row.likes;
    review.dislikes = row.dislikes;
    return review;
  }

  async delete(id: number): Promise<void> {
    await this.pool.query('DELETE FROM reviews WHERE id = $1', [id]);
  }

  async updateLikes(id: number, increment: boolean): Promise<void> {
    await this.pool.query('UPDATE reviews SET likes = likes + 1 WHERE id = $1', [id]);
  }

  async updateDislikes(id: number, increment: boolean): Promise<void> {
    await this.pool.query('UPDATE reviews SET dislikes = dislikes + 1 WHERE id = $1', [id]);
  }

  async getAverageRating(gameId: number): Promise<number> {
    const result = await this.pool.query(
      'SELECT AVG(rating) as average FROM reviews WHERE game_id = $1',
      [gameId]
    );
    return parseFloat(result.rows[0].average) || 0;
  }
}