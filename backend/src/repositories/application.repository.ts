// src/repositories/application.repository.ts
import pool from '../config/database';
import { Application, ApplicationCreateDTO, ApplicationStatus } from '../models/application.model';

export const ApplicationRepository = {
  async create(appDto: ApplicationCreateDTO): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO applications (student_id, type, details, submission_date) VALUES (?, ?, ?, NOW())',
      [appDto.studentId, appDto.type, appDto.details]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findAll(): Promise<Application[]> {
    const [rows] = await pool.execute('SELECT * FROM applications');
    return rows as Application[];
  },

  async findById(id: number): Promise<Application | null> {
    const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [id]);
    const applications = rows as Application[];
    return applications.length > 0 ? applications[0] : null;
  },

  async findByStudentId(studentId: number): Promise<Application[]> {
    const [rows] = await pool.execute('SELECT * FROM applications WHERE student_id = ?', [studentId]);
    return rows as Application[];
  },

  async updateStatus(id: number, status: ApplicationStatus): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  },

  async remove(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM applications WHERE id = ?', [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  },

  async countByStatus(status: ApplicationStatus): Promise<number> {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM applications WHERE status = ?',
      [status]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0].count : 0;
  }
};
