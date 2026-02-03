// src/repositories/dsc.repository.ts
import pool from '../config/database';
import { DSC, DscCreateDTO, DscMemberDTO } from '../models/dsc.model';

export const DscRepository = {
  async create(dscDto: DscCreateDTO): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO dscs (name, description, formation_date) VALUES (?, ?, ?)',
      [dscDto.name, dscDto.description, dscDto.formation_date]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findAll(): Promise<DSC[]> {
    const [rows] = await pool.execute('SELECT * FROM dscs');
    return rows as DSC[];
  },

  async findById(id: number): Promise<DSC | null> {
    const [rows] = await pool.execute('SELECT * FROM dscs WHERE id = ?', [id]);
    const dscs = rows as DSC[];
    return dscs.length > 0 ? dscs[0] : null;
  },

  async update(id: number, dscDto: Partial<DscCreateDTO>): Promise<boolean> {
    const fields = Object.keys(dscDto);
    const values = Object.values(dscDto);

    if (fields.length === 0) {
      return false;
    }

    const fieldPlaceholders = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE dscs SET ${fieldPlaceholders} WHERE id = ?`;

    const [result] = await pool.execute(sql, [...values, id]);
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  },

  async remove(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM dscs WHERE id = ?', [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async addMember(memberDto: DscMemberDTO): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO dsc_members (user_id, dsc_id, role_in_dsc) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role_in_dsc = ?',
      [memberDto.userId, memberDto.dscId, memberDto.role, memberDto.role]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async removeMember(userId: number, dscId: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM dsc_members WHERE user_id = ? AND dsc_id = ?',
      [userId, dscId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async removeAllSupervisors(dscId: number): Promise<boolean> {
    const [result] = await pool.execute(
      "DELETE FROM dsc_members WHERE dsc_id = ? AND role_in_dsc IN ('supervisor', 'co_supervisor')",
      [dscId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async removeAllMembers(dscId: number): Promise<boolean> {
    const [result] = await pool.execute(
      "DELETE FROM dsc_members WHERE dsc_id = ?",
      [dscId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async findMembersByDscId(dscId: number): Promise<any[]> {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, dm.role_in_dsc as role
       FROM dsc_members dm
       JOIN users u ON dm.user_id = u.id
       WHERE dm.dsc_id = ?`,
      [dscId]
    );
    return rows as any[];
  },

  async findStudentsByDscId(dscId: number): Promise<any[]> {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, st.program
       FROM students st
       JOIN users u ON st.user_id = u.id
       WHERE st.dsc_id = ?`,
      [dscId]
    );
    return rows as any[];
  },

  async addStudentsToDsc(dscId: number, studentIds: number[]): Promise<void> {
    const promises = studentIds.map(studentId =>
      pool.execute(
        'UPDATE students SET dsc_id = ? WHERE user_id = ?',
        [dscId, studentId]
      )
    );
    await Promise.all(promises);
  },

  async countByStatus(status: 'active' | 'inactive'): Promise<number> {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM dscs WHERE status = ?',
      [status]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0].count : 0;
  }
};