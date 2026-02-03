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
      finalThesisPendingDscApprovalCount,
      sentToAdminCount
    } = await this.dscMemberService.getAssignedDocuments(dscMemberId);
    res.status(200).json({ 
      success: true, 
      data: documents, 
      pendingReviewsCount, 
      approvedCount,
      preThesisPendingDscApprovalCount,
      finalThesisPendingDscApprovalCount,
      sentToAdminCount
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

    async viewDocument(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const filePath = await this.dscMemberService.getDocument(id);
            res.sendFile(filePath);
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    }
}
