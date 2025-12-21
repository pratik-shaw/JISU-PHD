// src/controllers/dsc-member.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { DscMemberService } from '../services/dsc-member.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const getReviewDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const documents = await DscMemberService.getReviewDocuments(userId);
  res.status(200).json({ success: true, data: documents });
});

const submitReview = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement
  res.status(200).json({ success: true, message: 'Review submitted successfully' });
});

const forwardDocument = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement
  res.status(200).json({ success: true, message: 'Document forwarded successfully' });
});

export const DscMemberController = {
  getReviewDocuments,
  submitReview,
  forwardDocument,
};
