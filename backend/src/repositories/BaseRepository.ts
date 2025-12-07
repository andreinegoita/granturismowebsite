import { Pool } from 'pg';
import { IRepository } from "../interfaces/IRepository";

export abstract class BaseRepository<T> implements IRepository<T>{
    protected pool:Pool;
    protected tableName: string;

    constructor(pool:Pool, tableName: string){
        this.pool=pool;
        this.tableName=tableName;
    }

    abstract findAll(): Promise<T[]>;
    abstract findById(id: number): Promise<T | null>;
    abstract create(entity: T): Promise<T>;
    abstract update(id: number, entity: Partial<T>): Promise<T | null>;

    async delete(id: number): Promise<boolean> {
        const result= await this.pool.query(
            'DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rowCount! > 0;
        
    }
}