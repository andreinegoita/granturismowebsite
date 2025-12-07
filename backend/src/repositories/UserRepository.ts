import { Pool } from "pg";
import { User } from "../models/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User>{
    constructor(pool:Pool){
        super(pool, 'users');
    }

    async findAll(): Promise<User[]> {
        const result = await this.pool.query('SELECT * FROM users ORDER BY created_at DESC');
        return result.rows;
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    async findByEmail(email:string): Promise<User | null>{
        const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }

    async create(user: User): Promise<User> {
        const result = await this.pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.username, user.email, user.password, user.role]
        ); 
        return result.rows[0];
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        const fields = Object.keys(user).map((key, i) => '${key} = $${i+2}').join(', ');
        const values= Object.values(user);

        if(fields.length === 0 ) return null;

        const result = await this.pool.query(
            `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
            [id, ...values]
        );
        return result.rows[0]  || null;
    }
}