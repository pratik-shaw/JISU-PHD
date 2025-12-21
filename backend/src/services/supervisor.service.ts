// src/services/supervisor.service.ts
import { SupervisorRepository } from '../repositories/supervisor.repository';

export const SupervisorService = {
  async getAssignedStudents(userId: number) {
    return await SupervisorRepository.findAssignedStudents(userId);
  },
  async getStudentProfile(studentId: number) {
    const profile = await SupervisorRepository.findStudentProfile(studentId);
    if (!profile) return null;

    const submissions = profile.submissions || [];
    const proposals = submissions.filter((s: any) => s.type === 'Proposal/Report');
    const reports = submissions.filter((s: any) => s.type === 'Proposal/Report' && s.status === 'approved');
    const thesis = submissions.filter((s: any) => s.type === 'Pre-Thesis' || s.type === 'Final-Thesis');

    const stats = {
      totalSubmissions: submissions.length,
      approved: submissions.filter((s: any) => s.status === 'approved').length,
      pending: submissions.filter((s: any) => s.status === 'pending' || s.status === 'Under Review').length,
      revisions: submissions.filter((s: any) => s.status === 'rejected' || s.status === 'Revision Required').length,
    };

    return {
      ...profile,
      proposals,
      reports,
      thesis,
      stats,
    };
  },
  async getReviewDocuments(userId: number) {
    return await SupervisorRepository.findReviewDocuments(userId);
  },
  async submitReview(review: any) {
    return await SupervisorRepository.createReview(review);
  },
  async forwardToAdmin(documentId: number) {
    return await SupervisorRepository.forwardToAdmin(documentId);
  },
};
