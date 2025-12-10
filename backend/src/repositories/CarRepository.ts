import { Pool } from 'pg';
import { Car, UserCar } from '../models/Car';

export class CarRepository {
  constructor(private pool: Pool) {}

  async findAllCars(gameId?: number): Promise<Car[]> {
    let query = 'SELECT * FROM cars';
    const params: any[] = [];
    
    if (gameId) {
      query += ' WHERE game_id = $1';
      params.push(gameId);
    }
    
    query += ' ORDER BY manufacturer, name';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findCarById(carId: number): Promise<Car | null> {
    const result = await this.pool.query('SELECT * FROM cars WHERE id = $1', [carId]);
    return result.rows[0] || null;
  }

  async findUserCars(userId: number, gameId?: number): Promise<any[]> {
    let query = `
      SELECT 
        uc.*,
        c.name as car_name,
        c.manufacturer,
        c.year,
        c.class,
        c.horsepower,
        c.weight,
        c.price,
        c.image_url,
        g.title as game_title
      FROM user_cars uc
      JOIN cars c ON uc.car_id = c.id
      JOIN games g ON uc.game_id = g.id
      WHERE uc.user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (gameId) {
      query += ' AND uc.game_id = $2';
      params.push(gameId);
    }
    
    query += ' ORDER BY uc.is_favorite DESC, uc.acquired_at DESC';
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async addCarToUser(userCar: UserCar): Promise<UserCar> {
    const result = await this.pool.query(`
      INSERT INTO user_cars (user_id, car_id, game_id, mileage, times_used, is_favorite)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, car_id, game_id) DO NOTHING
      RETURNING *
    `, [userCar.userId, userCar.carId, userCar.gameId, userCar.mileage, userCar.timesUsed, userCar.isFavorite]);
    return result.rows[0];
  }

  async updateUserCar(id: number, updates: Partial<UserCar>): Promise<UserCar> {
    const result = await this.pool.query(`
      UPDATE user_cars 
      SET 
        mileage = COALESCE($2, mileage),
        times_used = COALESCE($3, times_used),
        is_favorite = COALESCE($4, is_favorite)
      WHERE id = $1
      RETURNING *
    `, [id, updates.mileage, updates.timesUsed, updates.isFavorite]);
    return result.rows[0];
  }

  async incrementCarUsage(userId: number, carId: number, gameId: number, mileageAdded: number): Promise<void> {
    await this.pool.query(`
      UPDATE user_cars 
      SET 
        mileage = mileage + $4,
        times_used = times_used + 1
      WHERE user_id = $1 AND car_id = $2 AND game_id = $3
    `, [userId, carId, gameId, mileageAdded]);
  }

  async getCarStats(userId: number): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_cars,
        SUM(mileage) as total_mileage,
        SUM(times_used) as total_uses,
        COUNT(CASE WHEN is_favorite THEN 1 END) as favorite_count
      FROM user_cars
      WHERE user_id = $1
    `, [userId]);
    return result.rows[0];
  }

  async getMostUsedCars(userId: number, limit: number = 5): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        uc.*,
        c.name as car_name,
        c.manufacturer,
        c.image_url
      FROM user_cars uc
      JOIN cars c ON uc.car_id = c.id
      WHERE uc.user_id = $1
      ORDER BY uc.times_used DESC, uc.mileage DESC
      LIMIT $2
    `, [userId, limit]);
    return result.rows;
  }
}