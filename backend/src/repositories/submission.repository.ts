
import pool from '../config/database';

export const SubmissionRepository = {
  async updateStatus(submissionId: number, status: 'approved' | 'rejected' | 'pending' | 'pending_dsc_approval'): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE submissions SET status = ? WHERE id = ?',
      [status, submissionId]
    );
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  },

  async findById(id: number): Promise<any | null> {
    const [rows] = await pool.execute('SELECT * FROM submissions WHERE id = ?', [id]);
    const submissions = rows as any[];
    return submissions.length > 0 ? submissions[0] : null;
  },
};
