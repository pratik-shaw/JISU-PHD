// src/repositories/user.repository.ts
import pool from '../config/database';
import { User, UserCreateDTO } from '../models/user.model';

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  },

  async create(user: UserCreateDTO, passwordHash: string): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.role, passwordHash]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
        [id]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  },

  async findAll(): Promise<User[]> {
    const [rows] = await pool.execute('SELECT id, email, name, role, created_at, updated_at FROM users');
    return rows as User[];
  },

  async update(id: number, userUpdate: Partial<UserCreateDTO> & { password_hash?: string }): Promise<boolean> {
    const fields = Object.keys(userUpdate);
    const values = Object.values(userUpdate);
    
    if (fields.length === 0) {
      return false;
    }

    const fieldPlaceholders = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE users SET ${fieldPlaceholders} WHERE id = ?`;

    const [result] = await pool.execute(sql, [...values, id]);
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  },

  async remove(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async countAll(): Promise<number> {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const result = rows as any[];
    return result.length > 0 ? result[0].count : 0;
  },

  async findRecent(limit: number): Promise<User[]> {
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows as User[];
  },

  async findAllMembers(): Promise<User[]> {
    const [rows] = await pool.execute(
      "SELECT id, email, name, role, created_at FROM users WHERE role <> 'admin'"
    );
    return rows as User[];
  }
};
