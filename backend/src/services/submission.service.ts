
import { FeedbackRepository } from '../repositories/feedback.repository';
import { SubmissionRepository } from '../repositories/submission.repository';

export const SubmissionService = {
  async reviewSubmission(submissionId: number, userId: number, decision: 'approved' | 'rejected', comment: string) {
    console.log(`SubmissionService.reviewSubmission called with:`, { submissionId, userId, decision, comment });
    // First, update the submission status.
    const statusUpdated = await SubmissionRepository.updateStatus(submissionId, decision);
    console.log(`Submission status updated: ${statusUpdated}`);

    if (!statusUpdated) {
      throw new Error('Failed to update submission status.');
    }

    // Then, create the feedback entry.
    const feedbackId = await FeedbackRepository.create(submissionId, userId, comment);
    console.log(`Feedback created with ID: ${feedbackId}`);

    return { statusUpdated, feedbackId };
  },

  async getSubmissionById(submissionId: number) {
    return SubmissionRepository.findById(submissionId);
  },
};
