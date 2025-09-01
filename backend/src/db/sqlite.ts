import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Create SQLite database connection for development/testing
export const initializeSQLiteDatabase = async () => {
  const dbPath = path.join(__dirname, '../../database/greetme.db');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      telephone TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT 0,
      verification_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_telephone ON users(telephone);
    CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
  `);

  console.log('SQLite database initialized successfully');
  return db;
};

// Simple query wrapper to match PostgreSQL interface
export class SQLitePool {
  private db: any;

  constructor(database: any) {
    this.db = database;
  }

  async query(sql: string, params: any[] = []) {
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await this.db.all(sql, params);
        return { rows, rowCount: rows.length };
      } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const result = await this.db.run(sql, params);
        return { 
          rows: [{ id: result.lastID }], 
          rowCount: result.changes 
        };
      } else {
        const result = await this.db.run(sql, params);
        return { 
          rows: [], 
          rowCount: result.changes 
        };
      }
    } catch (error) {
      console.error('SQLite query error:', error);
      throw error;
    }
  }
}
