// src/repositories/supervisor.repository.ts
import pool from '../config/database';

export const SupervisorRepository = {
  async findAssignedStudents(userId: number): Promise<any[]> {
    const [rows] = await pool.execute(`
      SELECT
        s.id,
        u.name,
        u.email,
        s.program,
        s.status
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN dsc_members dm ON s.dsc_id = dm.dsc_id
      WHERE dm.user_id = ? AND dm.role_in_dsc = 'supervisor'
    `, [userId]);
    return rows as any[];
  },
  async findStudentProfile(studentId: number): Promise<any> {
    const [studentRows] = await pool.execute(`
      SELECT
        s.id,
        u.name,
        u.email,
        s.phone,
        s.year,
        s.status,
        s.enrollment_date as enrollmentDate,
        s.research_area as researchArea,
        d.name as department
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.id = ?
    `, [studentId]);

    const student = (studentRows as any[])[0];
    if (!student) return null;

    const [submissionRows] = await pool.execute(`
      SELECT
        id,
        title,
        type,
        status,
        created_at as submittedDate
      FROM submissions
      WHERE student_id = ?
      ORDER BY created_at DESC
    `, [studentId]);

    student.submissions = submissionRows;
    return student;
  },
  async findReviewDocuments(userId: number): Promise<any[]> {
    const [rows] = await pool.execute(`
      SELECT
        sub.id,
        sub.title,
        sub.type,
        sub.status,
        sub.document_url,
        sub.submission_date AS date,
        stu_user.name AS student
      FROM submissions sub
      JOIN students s ON sub.student_id = s.id
      JOIN users stu_user ON s.user_id = stu_user.id
      JOIN dsc_members dm ON s.dsc_id = dm.dsc_id
      WHERE dm.user_id = ? AND dm.role_in_dsc = 'supervisor' AND sub.status = 'pending_supervisor_approval'
    `, [userId]);
    return rows as any[];
  },
  async createReview(review: any): Promise<number> {
    const { submissionId, userId, recommendation, comments } = review;
    const feedbackComment = `Recommendation: ${recommendation.toUpperCase()}. Comments: ${comments}`;
    const [result] = await pool.execute(
      'INSERT INTO feedback (submission_id, user_id, comment) VALUES (?, ?, ?)',
      [submissionId, userId, feedbackComment]
    );
    const insertResult = result as any;

    let newStatus: string;
    if (recommendation === 'approved') {
      newStatus = 'approved';
    } else if (recommendation === 'revision') {
      newStatus = 'revision_required';
    } else if (recommendation === 'concerns') {
      newStatus = 'needs_further_review';
    } else {
      newStatus = 'rejected'; // Default to rejected if no other specific action
    }

    await pool.execute(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [newStatus, submissionId]
    );
    
    return insertResult.insertId;
  },
  async forwardToAdmin(documentId: number): Promise<void> {
    await pool.execute(
      "UPDATE submissions SET status = 'pending' WHERE id = ?",
      [documentId]
    );
  },
};
