// src/repositories/feedback.repository.ts
import pool from '../config/database';

export const FeedbackRepository = {
  async create(submissionId: number, userId: number, comment: string): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO feedback (submission_id, user_id, comment) VALUES (?, ?, ?)',
      [submissionId, userId, comment]
    );
    const insertResult = result as any;
    return insertResult.insertId;
  },

  async findBySubmissionId(submissionId: number): Promise<any[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM feedback WHERE submission_id = ? ORDER BY created_at DESC',
      [submissionId]
    );
    return rows as any[];
  },
};
