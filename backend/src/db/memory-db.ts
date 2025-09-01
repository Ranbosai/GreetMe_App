// Simple in-memory database for testing purposes
interface User {
  id: number;
  name: string;
  telephone: string;
  email: string;
  nickname: string;
  password_hash: string;
  is_verified: boolean;
  verification_token: string | null;
  created_at: string;
  updated_at: string;
}

class MemoryDatabase {
  private users: User[] = [];
  private nextId = 1;

  async query(sql: string, params: any[] = []) {
    const sqlUpper = sql.trim().toUpperCase();
    
    try {
      if (sqlUpper.includes('CREATE TABLE') || sqlUpper.includes('CREATE INDEX')) {
        return { rows: [], rowCount: 0 };
      }
      
      if (sqlUpper.startsWith('SELECT')) {
        return this.handleSelect(sql, params);
      }
      
      if (sqlUpper.startsWith('INSERT')) {
        return this.handleInsert(sql, params);
      }
      
      if (sqlUpper.startsWith('UPDATE')) {
        return this.handleUpdate(sql, params);
      }
      
      return { rows: [], rowCount: 0 };
    } catch (error) {
      console.error('Memory DB query error:', error);
      throw error;
    }
  }

  private handleSelect(sql: string, params: any[]) {
    const sqlUpper = sql.toUpperCase();
    
    if (sqlUpper.includes('WHERE TELEPHONE = $1 OR EMAIL = $2')) {
      const [telephone, email] = params;
      const user = this.users.find(u => u.telephone === telephone || u.email === email);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    if (sqlUpper.includes('WHERE EMAIL = $1 AND VERIFICATION_TOKEN = $2')) {
      const [email, token] = params;
      const user = this.users.find(u => u.email === email && u.verification_token === token);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    if (sqlUpper.includes('WHERE EMAIL = $1')) {
      const [email] = params;
      const user = this.users.find(u => u.email === email);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    if (sqlUpper.includes('WHERE ID = $1')) {
      const [id] = params;
      const user = this.users.find(u => u.id === parseInt(id));
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    return { rows: [], rowCount: 0 };
  }

  private handleInsert(sql: string, params: any[]) {
    if (sql.toUpperCase().includes('INSERT INTO USERS')) {
      const [name, telephone, email, nickname, password_hash, is_verified, verification_token] = params;
      
      const newUser: User = {
        id: this.nextId++,
        name,
        telephone,
        email,
        nickname,
        password_hash,
        is_verified,
        verification_token,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.users.push(newUser);
      
      return {
        rows: [{ id: newUser.id, name: newUser.name, email: newUser.email }],
        rowCount: 1
      };
    }
    
    return { rows: [], rowCount: 0 };
  }

  private handleUpdate(sql: string, params: any[]) {
    const sqlUpper = sql.toUpperCase();
    
    if (sqlUpper.includes('SET IS_VERIFIED = TRUE')) {
      const [email, token] = params;
      const userIndex = this.users.findIndex(u => u.email === email && u.verification_token === token && !u.is_verified);
      
      if (userIndex !== -1) {
        this.users[userIndex].is_verified = true;
        this.users[userIndex].verification_token = null;
        this.users[userIndex].updated_at = new Date().toISOString();
        
        return {
          rows: [this.users[userIndex]],
          rowCount: 1
        };
      }
    }
    
    return { rows: [], rowCount: 0 };
  }
}

export const memoryDb = new MemoryDatabase();

export const initializeDatabase = async () => {
  console.log('Memory database initialized successfully');
  return memoryDb;
};

export default memoryDb;
