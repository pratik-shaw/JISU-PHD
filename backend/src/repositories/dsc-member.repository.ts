import db from '../config/database';

export class DscMemberRepository {
  async getAssignedDocuments(dscMemberId: number) {
    const [rows] = await db.query(
      `
      SELECT 
        s.id,
        s.title,
        s.type,
        u.name as student,
        sup.name as supervisor,
        s.status
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN dsc_members dsm ON st.dsc_id = dsm.dsc_id
      LEFT JOIN (
        SELECT dsc_id, user_id
        FROM dsc_members
        WHERE role_in_dsc = 'supervisor'
      ) sup_dsm ON st.dsc_id = sup_dsm.dsc_id
      LEFT JOIN users sup ON sup_dsm.user_id = sup.id
      WHERE dsm.user_id = ?
      `,
      [dscMemberId]
    );
    return rows;
  }

  async getUnderReviewSubmissionsCount(dscMemberId: number): Promise<number> {
    console.log(`Fetching under review submissions count for dscMemberId: ${dscMemberId}`);
    const [rows] = await db.query(
      `
      SELECT COUNT(s.id) as count
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN dsc_members dsm ON st.dsc_id = dsm.dsc_id
      WHERE dsm.user_id = ? AND s.status = 'pending_dsc_approval'
      `,
      [dscMemberId]
    );
    console.log('Query result:', (rows as any)[0]);
    return (rows as any)[0].count;
  }

  async getApprovedSubmissionsCount(dscMemberId: number): Promise<number> {
    console.log(`Fetching approved submissions count for dscMemberId: ${dscMemberId}`);
    const [rows] = await db.query(
      `
      SELECT COUNT(s.id) as count
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN dsc_members dsm ON st.dsc_id = dsm.dsc_id
      WHERE dsm.user_id = ? 
        AND s.status = 'approved'
        AND s.type NOT IN ('Pre-Thesis', 'Final-Thesis')
      `,
      [dscMemberId]
    );
    console.log('Approved submissions query result:', (rows as any)[0]);
    return (rows as any)[0].count;
  }
}
