import { Pool } from 'pg';
import { License, UserLicense } from '../models/License';

export class LicenseRepository {
  constructor(private pool: Pool) {}

  async findAllLicenses(): Promise<License[]> {
    const result = await this.pool.query('SELECT * FROM licenses ORDER BY difficulty ASC');
    return result.rows;
  }

  async findUserLicenses(userId: number, gameId?: number): Promise<any[]> {
    let query = `
      SELECT 
        ul.*,
        l.name as license_name,
        l.code as license_code,
        l.description as license_description,
        l.difficulty,
        l.icon_url,
        g.title as game_title
      FROM user_licenses ul
      JOIN licenses l ON ul.license_id = l.id
      JOIN games g ON ul.game_id = g.id
      WHERE ul.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (gameId) {
      query += ' AND ul.game_id = $2';
      params.push(gameId);
    }
    
    query += ' ORDER BY l.difficulty ASC, ul.obtained_at DESC';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findUserLicense(userId: number, licenseId: number, gameId: number): Promise<UserLicense | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_licenses WHERE user_id = $1 AND license_id = $2 AND game_id = $3',
      [userId, licenseId, gameId]
    );
    return result.rows[0] || null;
  }

  async createUserLicense(userLicense: UserLicense): Promise<UserLicense> {
    const result = await this.pool.query(`
      INSERT INTO user_licenses (user_id, license_id, game_id, status, tests_completed, total_tests, best_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      userLicense.userId,
      userLicense.licenseId,
      userLicense.gameId,
      userLicense.status,
      userLicense.testsCompleted,
      userLicense.totalTests,
      userLicense.bestTime
    ]);
    return result.rows[0];
  }

  async updateUserLicense(id: number, updates: Partial<UserLicense>): Promise<UserLicense> {
    const result = await this.pool.query(`
      UPDATE user_licenses 
      SET 
        status = COALESCE($2, status),
        tests_completed = COALESCE($3, tests_completed),
        best_time = COALESCE($4, best_time)
      WHERE id = $1
      RETURNING *
    `, [id, updates.status, updates.testsCompleted, updates.bestTime]);
    return result.rows[0];
  }

  async getLicenseStats(userId: number): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_licenses,
        COUNT(CASE WHEN status = 'gold' THEN 1 END) as gold_count,
        COUNT(CASE WHEN status = 'silver' THEN 1 END) as silver_count,
        COUNT(CASE WHEN status = 'bronze' THEN 1 END) as bronze_count
      FROM user_licenses
      WHERE user_id = $1
    `, [userId]);
    return result.rows[0];
  }
}