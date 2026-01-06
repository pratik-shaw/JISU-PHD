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

  async findAll(filters: { status?: string; type?: string } = {}): Promise<Application[]> {
    let query = `
      SELECT
        s.id,
        s.student_id,
        s.type,
        s.status,
        s.submission_date,
        s.title,
        s.abstract,
        s.document_url,
        u.name as student_name
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
    `;

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filters.status) {
      const statuses = filters.status.split(',');
      whereClauses.push(`s.status IN (${statuses.map(() => '?').join(',')})`);
      params.push(...statuses);
    }

    if (filters.type) {
      const types = filters.type.split(',');
      whereClauses.push(`s.type IN (${types.map(() => '?').join(',')})`);
      params.push(...types);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const [rows] = await pool.execute(query, params);
    return rows as Application[];
  },

  async findById(id: number): Promise<Application | null> {
    const [rows] = await pool.execute(`
      SELECT
        s.id,
        s.student_id,
        s.type,
        s.status,
        s.submission_date,
        s.title,
        s.abstract,
        s.document_url, -- Include document_url
        u.name as student_name
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      WHERE s.id = ? AND s.type = 'Application'
    `, [id]);
    const applications = rows as Application[];
    return applications.length > 0 ? applications[0] : null;
  },

  async findByStudentId(studentId: number): Promise<Application[]> {
    const [rows] = await pool.execute('SELECT * FROM applications WHERE student_id = ?', [studentId]);
    return rows as Application[];
  },

  async updateStatus(id: number, status: ApplicationStatus): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE submissions SET status = ? WHERE id = ? AND type = "Application"',
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
      'SELECT COUNT(*) as count FROM submissions WHERE status = ? AND type = "Application"',
      [status]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0].count : 0;
  }
};
