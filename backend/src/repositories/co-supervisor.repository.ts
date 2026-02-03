// src/repositories/co-supervisor.repository.ts
import pool from '../config/database';

export const CoSupervisorRepository = {
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
      WHERE s.dsc_id IN (
        SELECT dsc_id
        FROM dsc_members
        WHERE user_id = ? AND role_in_dsc = 'co_supervisor'
      )
    `, [userId]);
    return rows as any[];
  },

  async findStudentProfile(studentId: number): Promise<any> {
    const [studentRows] = await pool.execute(`
      SELECT
        s.id,
        u.name,
        u.email,
        s.program,
        s.status,
        s.application_date as applicationDate,
        s.enrollment_date as enrollmentDate
      FROM students s
      JOIN users u ON s.user_id = u.id
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
        submission_date as submittedDate
      FROM submissions
      WHERE student_id = ?
      ORDER BY submission_date DESC
    `, [studentId]);

    student.submissions = submissionRows;
    return student;
  },

  async findReviewDocuments(userId: number, documentType?: string): Promise<any[]> {
    // Step 1: Find all DSCs the current co-supervisor belongs to
    const [coSupervisorDscsRows] = await pool.execute(`
      SELECT dsc_id
      FROM dsc_members
      WHERE user_id = ? AND role_in_dsc = 'co_supervisor'
    `, [userId]);

    const coSupervisorDscIds = (coSupervisorDscsRows as any[]).map(row => row.dsc_id);

    // If the co-supervisor is not part of any DSC, return an empty array
    if (coSupervisorDscIds.length === 0) {
      return [];
    }

    // Step 2: Build the IN clause for DSC IDs dynamically
    const dscInClause = coSupervisorDscIds.length > 0 ? `(${coSupervisorDscIds.join(',')})` : `(NULL)`;

    let query = `
      SELECT
          sub.id,
          sub.title,
          sub.type,
          sub.status,
          sub.document_url,
          sub.submission_date AS date,
          stu_user.name AS student,
          psup_user.name AS supervisor -- Primary Supervisor
      FROM
          submissions AS sub
      JOIN
          students AS stu ON sub.student_id = stu.id
      JOIN
          users AS stu_user ON stu.user_id = stu_user.id
      LEFT JOIN
          student_supervisors AS ss_primary ON stu.id = ss_primary.student_id AND ss_primary.supervisor_role = 'supervisor'
      LEFT JOIN
          users AS psup_user ON ss_primary.supervisor_id = psup_user.id
      WHERE
          stu.dsc_id IN ${dscInClause}
      AND
          sub.status = 'pending_co_supervisor_approval'
    `;
    const queryParams: any[] = [];

    let dbDocumentType: string | undefined;
    if (documentType === 'proposals' || documentType === 'reports') {
      dbDocumentType = 'Proposal/Report';
    } else if (documentType === 'pre-thesis') {
      dbDocumentType = 'Pre-Thesis';
    } else if (documentType === 'final-thesis') {
      dbDocumentType = 'Final-Thesis';
    }

    if (dbDocumentType) {
      query += ` AND sub.type = ?`;
      queryParams.push(dbDocumentType);
    }

    const [rows] = await pool.execute(query, queryParams);

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
      newStatus = 'pending_supervisor_approval';
    } else if (recommendation === 'revision') {
      newStatus = 'revision_required';
    } else if (recommendation === 'concerns') {
      newStatus = 'needs_further_review';
    } else {
      // Default or error case, perhaps 'rejected' if no other specific action
      newStatus = 'rejected'; 
    }

    await pool.execute(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [newStatus, submissionId]
    );
    
    return insertResult.insertId;
  },

  async forwardDocument(documentId: number): Promise<void> {
    await pool.execute(
      "UPDATE submissions SET status = 'pending_supervisor_approval' WHERE id = ?",
      [documentId]
    );
  },
};