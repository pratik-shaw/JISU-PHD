// src/services/student.service.ts
import { StudentRepository } from '../repositories/student.repository';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { ApiError } from '../middleware/errorHandler';

export const StudentService = {
  async getDocuments(userId: number) {
    return await StudentRepository.findDocumentsByUserId(userId);
  },
  async createSubmission(userId: number, submission: { type: string; title?: string; abstract?: string; document_url: string }) {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
      throw new ApiError(404, 'Student profile not found for this user.');
    }
    const submissionId = await StudentRepository.createSubmission(student.id, submission);
    const newSubmission = await StudentRepository.findSubmissionById(submissionId);
    if (!newSubmission) {
      throw new ApiError(500, 'Failed to create submission');
    }
    return newSubmission;
  },
  async getSubmissionById(submissionId: number, userId: number) {
    const submission = await StudentRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    const student = await StudentRepository.findByUserId(userId);
    if (!student || student.id !== submission.student_id) {
      throw new ApiError(403, 'Unauthorized to view this submission');
    }

    return submission;
  },

  async getFeedbackForSubmission(submissionId: number, userId: number) {
    const submission = await StudentRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    const student = await StudentRepository.findByUserId(userId);
    if (!student || student.id !== submission.student_id) {
      throw new ApiError(403, 'Unauthorized to view this feedback');
    }

    return await FeedbackRepository.findBySubmissionId(submissionId);
  },

  async getSubmissionFilePath(submissionId: number, userId: number): Promise<string> {
    const submission = await StudentRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    const student = await StudentRepository.findByUserId(userId);
    if (!student || student.id !== submission.student_id) {
      throw new ApiError(403, 'Unauthorized to view this file');
    }

    if (!submission.document_url) {
      throw new ApiError(404, 'File not found for this submission');
    }

    return submission.document_url;
  },

  async getSubmissionFilePathForAdmin(submissionId: number): Promise<string> {
    const submission = await StudentRepository.findSubmissionById(submissionId);
    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    if (!submission.document_url) {
      throw new ApiError(404, 'File not found for this submission');
    }

    return submission.document_url;
  }
};
