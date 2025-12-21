// src/services/dsc-member.service.ts
import { DscMemberRepository } from '../repositories/dsc-member.repository';

export const DscMemberService = {
  async getReviewDocuments(userId: number) {
    return await DscMemberRepository.findReviewDocuments(userId);
  },
  async submitReview(review: any) {
    // TODO: Implement
  },
  async forwardDocument(documentId: number, userId: number) {
    // TODO: Implement
  },
};
