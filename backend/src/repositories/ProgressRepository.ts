import { Pool } from 'pg';
import { UserGameProgress } from '../models/UserGameProgress';

export class ProgressRepository {
  constructor(private pool: Pool) {}

  async findByUserId(userId: number): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        ugp.*,
        g.title as game_title,
        g.image_urls,
        g.release_year
      FROM user_game_progress ugp
      JOIN games g ON ugp.game_id = g.id
      WHERE ugp.user_id = $1
      ORDER BY ugp.last_played DESC
    `, [userId]);
    return result.rows;
  }

  async findByUserAndGame(userId: number, gameId: number): Promise<UserGameProgress | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_game_progress WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );
    return result.rows[0] || null;
  }

  async create(progress: UserGameProgress): Promise<UserGameProgress> {
    const result = await this.pool.query(`
      INSERT INTO user_game_progress 
      (user_id, game_id, completion_percentage, hours_played, credits_earned, total_races, races_won)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      progress.userId,
      progress.gameId,
      progress.completionPercentage,
      progress.hoursPlayed,
      progress.creditsEarned,
      progress.totalRaces,
      progress.racesWon
    ]);
    return result.rows[0];
  }

  async update(userId: number, gameId: number, progress: Partial<UserGameProgress>): Promise<UserGameProgress> {
    const result = await this.pool.query(`
      UPDATE user_game_progress 
      SET 
        completion_percentage = COALESCE($3, completion_percentage),
        hours_played = COALESCE($4, hours_played),
        credits_earned = COALESCE($5, credits_earned),
        total_races = COALESCE($6, total_races),
        races_won = COALESCE($7, races_won),
        last_played = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND game_id = $2
      RETURNING *
    `, [
      userId,
      gameId,
      progress.completionPercentage,
      progress.hoursPlayed,
      progress.creditsEarned,
      progress.totalRaces,
      progress.racesWon
    ]);
    return result.rows[0];
  }

  async incrementRaceStats(userId: number, gameId: number, won: boolean, hoursPlayed: number, credits: number): Promise<void> {
    await this.pool.query(`
      UPDATE user_game_progress 
      SET 
        total_races = total_races + 1,
        races_won = races_won + $3,
        hours_played = hours_played + $4,
        credits_earned = credits_earned + $5,
        last_played = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND game_id = $2
    `, [userId, gameId, won ? 1 : 0, hoursPlayed, credits]);
  }

  async getUserStats(userId: number): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(DISTINCT game_id) as games_started,
        SUM(total_races) as total_races,
        SUM(races_won) as total_wins,
        SUM(hours_played) as total_hours,
        SUM(credits_earned) as total_credits,
        AVG(completion_percentage) as avg_completion
      FROM user_game_progress
      WHERE user_id = $1
    `, [userId]);
    return result.rows[0];
  }
}