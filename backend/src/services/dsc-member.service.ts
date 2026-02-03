import { DscMemberRepository } from '../repositories/dsc-member.repository';
import { SubmissionRepository } from '../repositories/submission.repository';
import path from 'path';

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
    const sentToAdminCount = await this.dscMemberRepository.getSentToAdminCount(dscMemberId);

    return { 
      documents, 
      pendingReviewsCount, 
      approvedCount,
      preThesisPendingDscApprovalCount,
      finalThesisPendingDscApprovalCount,
      sentToAdminCount
    };
  }

  async submitReview(
    documentId: string,
    dscMemberId: number,
    decision: 'approved' | 'rejected',
    comments: string
  ) {
    return await this.dscMemberRepository.createReview(
      parseInt(documentId, 10),
      dscMemberId,
      decision,
      comments
    );
  }

  async forwardDocumentToAdmin(documentId: string) {
    await SubmissionRepository.updateStatus(parseInt(documentId, 10), 'pending');
  }

  async getDocument(documentId: string): Promise<string> {
    const submission = await SubmissionRepository.findById(parseInt(documentId, 10));
    if (!submission || !submission.document_url) {
      throw new Error('Document not found');
    }
    const filePath = path.join(__dirname, '../../', submission.document_url);
    return filePath;
  }
}
