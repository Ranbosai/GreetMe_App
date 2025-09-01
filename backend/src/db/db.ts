import dotenv from 'dotenv';

dotenv.config();

// For development/testing, use memory database
// For production, uncomment PostgreSQL imports and setup
/*
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/greetme',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
*/

// Use memory database for testing
import { memoryDb, initializeDatabase as initMemoryDb } from './memory-db';

export const initializeDatabase = async () => {
  try {
    if (process.env.USE_POSTGRES === 'true') {
      // Use PostgreSQL in production
      console.log('PostgreSQL mode - please ensure database is set up');
      // Initialize PostgreSQL here
    } else {
      // Use memory database for development
      await initMemoryDb();
      console.log('Using in-memory database for development');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Export memory database as default for development
export default memoryDb;
