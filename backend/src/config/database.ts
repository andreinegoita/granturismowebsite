import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Type of DATABASE_URL:', typeof process.env.DATABASE_URL);
