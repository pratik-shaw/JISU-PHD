// src/services/supervisor.service.ts
import { UserRepository } from '../repositories/user.repository'; // Import UserRepository
import { AuthService } from './auth.service'; // Import AuthService
import { StudentRepository } from '../repositories/student.repository';
import { SupervisorRepository } from '../repositories/supervisor.repository';
import { ApiError } from '../middleware/errorHandler';

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

  async getSubmissionFilePath(submissionId: number, userId: number): Promise<string> {
    const submission = await StudentRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    const student = await StudentRepository.findById(submission.student_id);
    if (!student) {
      throw new ApiError(404, 'Student not found for this submission');
    }

    const assignedStudents = await SupervisorRepository.findAssignedStudents(userId);
    const isAuthorized = assignedStudents.some(s => s.id === student.id);

    if (!isAuthorized) {
      throw new ApiError(403, 'Unauthorized to view this file');
    }

    if (!submission.document_url) {
      throw new ApiError(404, 'File not found for this submission');
    }

    return submission.document_url;
  },

  async forwardToAdmin(documentId: number) {
    return await SupervisorRepository.forwardToAdmin(documentId);
  },

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await UserRepository.findUserWithPassword(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await AuthService.comparePassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid current password');
    }

    const newPasswordHash = await AuthService.hashPassword(newPassword);
    await UserRepository.update(user.id, { password_hash: newPasswordHash });
  },
};
