// src/repositories/dsc-member.repository.ts
import pool from '../config/database';

export const DscMemberRepository = {
  async findReviewDocuments(userId: number): Promise<any[]> {
    const [rows] = await pool.execute(`
      SELECT
        d.id,
        d.title,
        d.type,
        d.status,
        d.submission_date as date,
        u.name as student,
        (SELECT name FROM users WHERE id = s.supervisor_id) as supervisor
      FROM (
        SELECT id, student_id, 'proposal' as type, title, status, submission_date FROM proposals
        UNION ALL
        SELECT id, student_id, 'report' as type, title, status, submission_date FROM reports
        UNION ALL
        SELECT id, student_id, type, title, status, submission_date FROM submissions
      ) d
      JOIN students s ON d.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN dsc_members dm ON u.id = dm.user_id
      WHERE dm.dsc_id = (SELECT dsc_id FROM dsc_members WHERE user_id = ? LIMIT 1)
        AND d.status = 'pending'
    `, [userId]);
    return rows as any[];
  },
  async createReview(review: any): Promise<number> {
    // TODO: Implement
    return 1;
  },
  async forwardDocument(documentId: number, userId: number): Promise<void> {
    // TODO: Implement
  },
};
