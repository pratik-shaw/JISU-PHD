import { Request, Response } from 'express';
import { DscMemberService } from '../services/dsc-member.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class DscMemberController {
  private dscMemberService: DscMemberService;

  constructor() {
    this.dscMemberService = new DscMemberService();
  }

  async getAssignedDocuments(req: AuthenticatedRequest, res: Response) {
    const dscMemberId = req.user!.id;
    const { 
      documents, 
      pendingReviewsCount, 
      approvedCount,
      preThesisPendingDscApprovalCount,
      finalThesisPendingDscApprovalCount
    } = await this.dscMemberService.getAssignedDocuments(dscMemberId);
    res.status(200).json({ 
      success: true, 
      data: documents, 
      pendingReviewsCount, 
      approvedCount,
      preThesisPendingDscApprovalCount,
      finalThesisPendingDscApprovalCount
    });
  }

  async submitReview(req: AuthenticatedRequest, res: Response) {
    const dscMemberId = req.user!.id;
    const { documentId, decision, comments } = req.body;
    await this.dscMemberService.submitReview(
      documentId,
      dscMemberId,
      decision,
      comments
    );
    res.status(200).json({ success: true, message: 'Review submitted successfully' });
  }

  async forwardDocumentToAdmin(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await this.dscMemberService.forwardDocumentToAdmin(id);
    res.status(200).json({ success: true, message: 'Document forwarded to admin' });
  }
}