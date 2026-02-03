// src/repositories/student.repository.ts
import pool from '../config/database';
import { Student, StudentCreateDTO } from '../models/student.model';

export const StudentRepository = {
  async create(studentDto: StudentCreateDTO): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO students (user_id, program, status, application_date) VALUES (?, ?, "pending", NOW())',
      [studentDto.userId, studentDto.program || null]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findByUserId(userId: number): Promise<Student | null> {
    const [rows] = await pool.execute('SELECT id, user_id, program, status, application_date, enrollment_date FROM students WHERE user_id = ?', [userId]);
    const students = rows as Student[];
    return students.length > 0 ? students[0] : null;
  },
  
  async findById(id: number): Promise<Student | null> {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    const students = rows as Student[];
    return students.length > 0 ? students[0] : null;
  },

  async updateStudentDscId(studentId: number, dscId: number | null): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE students SET dsc_id = ? WHERE id = ?',
      [dscId, studentId]
    );
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  },

  async findDocumentsByUserId(userId: number): Promise<any[]> {
    const [rows] = await pool.execute(`
      SELECT
        sub.id,
        sub.title,
        sub.type,
        sub.status,
        sub.submission_date as date
      FROM submissions sub
      JOIN students s ON sub.student_id = s.id
      WHERE s.user_id = ?
    `, [userId]);
    return rows as any[];
  },

  async createSubmission(studentId: number, submission: { type: string; title?: string; abstract?: string; document_url: string }): Promise<number> {
    let status = 'pending'; // Default status for applications
    if (
      submission.type === 'Proposal/Report' ||
      submission.type === 'Pre-Thesis' ||
      submission.type === 'Final-Thesis'
    ) {
      status = 'pending_co_supervisor_approval';
    }
    const [result] = await pool.execute(
      'INSERT INTO submissions (student_id, type, title, abstract, document_url, status, submission_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [studentId, submission.type, submission.title || null, submission.abstract || null, submission.document_url, status]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findSubmissionById(submissionId: number): Promise<any> {
    const [rows] = await pool.execute(`
      SELECT
        s.id,
        s.student_id,
        s.type,
        s.title,
        s.abstract,
        s.document_url,
        s.status,
        s.submission_date,
        u.name as student_name
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      WHERE s.id = ?
    `, [submissionId]);
    const submissions = rows as any[];
    return submissions.length > 0 ? submissions[0] : null;
  }
};
