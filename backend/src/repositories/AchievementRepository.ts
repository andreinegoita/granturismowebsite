import { Pool } from 'pg';
import { Achievement, UserAchievement } from '../models/Achievement';

export class AchievementRepository {
  constructor(private pool: Pool) {}

  async findAllAchievements(): Promise<Achievement[]> {
    const result = await this.pool.query('SELECT * FROM achievements ORDER BY points ASC');
    return result.rows;
  }

  async findUserAchievements(userId: number, gameId?: number): Promise<any[]> {
    let query = `
      SELECT 
        ua.*,
        a.name as achievement_name,
        a.description,
        a.category,
        a.points,
        a.icon_url,
        a.requirement_type,
        a.requirement_value,
        a.rarity,
        g.title as game_title
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      JOIN games g ON ua.game_id = g.id
      WHERE ua.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (gameId) {
      query += ' AND ua.game_id = $2';
      params.push(gameId);
    }
    
    query += ' ORDER BY ua.unlocked DESC, a.points DESC';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findOrCreateUserAchievement(userId: number, achievementId: number, gameId: number): Promise<UserAchievement> {
    const result = await this.pool.query(`
      INSERT INTO user_achievements (user_id, achievement_id, game_id, progress)
      VALUES ($1, $2, $3, 0)
      ON CONFLICT (user_id, achievement_id, game_id) DO UPDATE SET user_id = EXCLUDED.user_id
      RETURNING *
    `, [userId, achievementId, gameId]);
    return result.rows[0];
  }

  async updateProgress(userId: number, achievementId: number, gameId: number, progress: number): Promise<UserAchievement> {
    const result = await this.pool.query(`
      UPDATE user_achievements 
      SET 
        progress = $4,
        unlocked = CASE WHEN $4 >= (SELECT requirement_value FROM achievements WHERE id = $2) THEN true ELSE unlocked END,
        unlocked_at = CASE WHEN $4 >= (SELECT requirement_value FROM achievements WHERE id = $2) AND unlocked = false THEN CURRENT_TIMESTAMP ELSE unlocked_at END
      WHERE user_id = $1 AND achievement_id = $2 AND game_id = $3
      RETURNING *
    `, [userId, achievementId, gameId, progress]);
    return result.rows[0];
  }

  async checkAndUnlockAchievements(userId: number, gameId: number, stats: any): Promise<UserAchievement[]> {
    // Găsește toate achievement-urile care pot fi deblocate
    const achievements = await this.pool.query(`
      SELECT a.*, ua.progress, ua.unlocked
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1 AND ua.game_id = $2
      WHERE ua.unlocked IS NULL OR ua.unlocked = false
    `, [userId, gameId]);

    const unlocked: UserAchievement[] = [];

    for (const achievement of achievements.rows) {
      let currentProgress = 0;

      // Calculează progresul bazat pe tip
      switch (achievement.requirement_type) {
        case 'races_won':
          currentProgress = stats.racesWon || 0;
          break;
        case 'licenses_obtained':
          currentProgress = stats.licensesObtained || 0;
          break;
        case 'gold_licenses':
          currentProgress = stats.goldLicenses || 0;
          break;
        case 'cars_collected':
          currentProgress = stats.carsCollected || 0;
          break;
        case 'track_records':
          currentProgress = stats.trackRecords || 0;
          break;
        case 'completion':
          currentProgress = stats.completionPercentage || 0;
          break;
      }

      // Update sau creează achievement-ul
      await this.findOrCreateUserAchievement(userId, achievement.id, gameId);
      const updated = await this.updateProgress(userId, achievement.id, gameId, currentProgress);
      
      if (updated.unlocked) {
        unlocked.push(updated);
      }
    }

    return unlocked;
  }

  async getAchievementStats(userId: number): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_achievements,
        COUNT(CASE WHEN unlocked THEN 1 END) as unlocked_count,
        SUM(CASE WHEN unlocked THEN a.points ELSE 0 END) as total_points
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
    `, [userId]);
    return result.rows[0];
  }
}