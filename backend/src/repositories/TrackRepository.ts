import { Pool } from 'pg';
import { Track, TrackRecord } from '../models/Track';

export class TrackRepository {
  constructor(private pool: Pool) {}

  async findAllTracks(gameId?: number): Promise<Track[]> {
    let query = 'SELECT * FROM tracks';
    const params: any[] = [];
    
    if (gameId) {
      query += ' WHERE game_id = $1';
      params.push(gameId);
    }
    
    query += ' ORDER BY name';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findTrackById(trackId: number): Promise<Track | null> {
    const result = await this.pool.query('SELECT * FROM tracks WHERE id = $1', [trackId]);
    return result.rows[0] || null;
  }

  async findUserRecords(userId: number, gameId?: number): Promise<any[]> {
    let query = `
      SELECT 
        tr.*,
        t.name as track_name,
        t.length_km,
        t.corners,
        t.image_url as track_image,
        c.name as car_name,
        c.manufacturer,
        g.title as game_title
      FROM track_records tr
      JOIN tracks t ON tr.track_id = t.id
      JOIN cars c ON tr.car_id = c.id
      JOIN games g ON tr.game_id = g.id
      WHERE tr.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (gameId) {
      query += ' AND tr.game_id = $2';
      params.push(gameId);
    }
    
    query += ' ORDER BY tr.achieved_at DESC';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findTrackLeaderboard(trackId: number, gameId: number, limit: number = 10): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        tr.*,
        u.username,
        c.name as car_name,
        c.manufacturer
      FROM track_records tr
      JOIN users u ON tr.user_id = u.id
      JOIN cars c ON tr.car_id = c.id
      WHERE tr.track_id = $1 AND tr.game_id = $2
      ORDER BY tr.lap_time ASC
      LIMIT $3
    `, [trackId, gameId, limit]);
    return result.rows;
  }

  async createRecord(record: TrackRecord): Promise<TrackRecord> {
    const result = await this.pool.query(`
      INSERT INTO track_records 
      (user_id, track_id, car_id, game_id, lap_time, sector_1, sector_2, sector_3, weather, tyre_compound, is_assisted)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_id, track_id, car_id, game_id) 
      DO UPDATE SET 
        lap_time = CASE WHEN EXCLUDED.lap_time < track_records.lap_time THEN EXCLUDED.lap_time ELSE track_records.lap_time END,
        sector_1 = EXCLUDED.sector_1,
        sector_2 = EXCLUDED.sector_2,
        sector_3 = EXCLUDED.sector_3,
        weather = EXCLUDED.weather,
        tyre_compound = EXCLUDED.tyre_compound,
        is_assisted = EXCLUDED.is_assisted,
        achieved_at = CASE WHEN EXCLUDED.lap_time < track_records.lap_time THEN CURRENT_TIMESTAMP ELSE track_records.achieved_at END
      RETURNING *
    `, [
      record.userId,
      record.trackId,
      record.carId,
      record.gameId,
      record.lapTime,
      record.sector1,
      record.sector2,
      record.sector3,
      record.weather,
      record.tyreCompound,
      record.isAssisted
    ]);
    return result.rows[0];
  }

  async getUserBestLap(userId: number, trackId: number, gameId: number): Promise<TrackRecord | null> {
    const result = await this.pool.query(`
      SELECT * FROM track_records
      WHERE user_id = $1 AND track_id = $2 AND game_id = $3
      ORDER BY lap_time ASC
      LIMIT 1
    `, [userId, trackId, gameId]);
    return result.rows[0] || null;
  }

  async getTrackStats(userId: number): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(DISTINCT track_id) as tracks_mastered,
        AVG(lap_time) as avg_lap_time,
        MIN(lap_time) as best_lap_time
      FROM track_records
      WHERE user_id = $1
    `, [userId]);
    return result.rows[0];
  }
}