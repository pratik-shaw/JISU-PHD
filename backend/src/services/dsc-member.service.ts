import { DscMemberRepository } from '../repositories/dsc-member.repository';
import { SubmissionRepository } from '../repositories/submission.repository';

export class DscMemberService {
  private dscMemberRepository: DscMemberRepository;

  constructor() {
    this.dscMemberRepository = new DscMemberRepository();
  }

  async getAssignedDocuments(dscMemberId: number) {
    const documents = await this.dscMemberRepository.getAssignedDocuments(dscMemberId);
    const pendingReviewsCount = await this.dscMemberRepository.getUnderReviewSubmissionsCount(dscMemberId);
    const approvedCount = await this.dscMemberRepository.getApprovedSubmissionsCount(dscMemberId);
    const preThesisPendingDscApprovalCount = await this.dscMemberRepository.getPreThesisPendingDscApprovalCount(dscMemberId);
    const finalThesisPendingDscApprovalCount = await this.dscMemberRepository.getFinalThesisPendingDscApprovalCount(dscMemberId);

    return { 
      documents, 
      pendingReviewsCount, 
      approvedCount,
      preThesisPendingDscApprovalCount,
      finalThesisPendingDscApprovalCount
    };
  }

  async submitReview(
    documentId: string,
    dscMemberId: number,
    decision: 'approved' | 'revision' | 'rejected',
    comments: string
  ) {
    if (decision === 'approved' || decision === 'rejected') {
      await SubmissionRepository.updateStatus(parseInt(documentId, 10), decision);
    }
    // Add review to the document
    // This functionality will be added later
  }

  async forwardDocumentToAdmin(documentId: string) {
    // Logic to forward document to admin
    // This will likely involve updating the document status
  }
}