// src/repositories/student.repository.ts
import pool from '../config/database';
import { Student, StudentCreateDTO } from '../models/student.model';

export const StudentRepository = {
  async create(studentDto: StudentCreateDTO): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO students (user_id, student_id, program, status, application_date) VALUES (?, ?, ?, "pending", NOW())',
      [studentDto.userId, studentDto.studentId || null, studentDto.program || null]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findByUserId(userId: number): Promise<Student | null> {
    const [rows] = await pool.execute('SELECT * FROM students WHERE user_id = ?', [userId]);
    const students = rows as Student[];
    return students.length > 0 ? students[0] : null;
  },
  
  async findById(id: number): Promise<Student | null> {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    const students = rows as Student[];
    return students.length > 0 ? students[0] : null;
  }
};
