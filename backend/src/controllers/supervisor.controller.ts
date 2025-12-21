// src/controllers/supervisor.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { SupervisorService } from '../services/supervisor.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const getAssignedStudents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const students = await SupervisorService.getAssignedStudents(userId);
  res.status(200).json({ success: true, data: students });
});

const getStudentProfile = asyncHandler(async (req: Request, res: Response) => {
  const studentId = Number(req.params.id);
  const profile = await SupervisorService.getStudentProfile(studentId);
  res.status(200).json({ success: true, data: profile });
});

const getReviewDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const documents = await SupervisorService.getReviewDocuments(userId);
  res.status(200).json({ success: true, data: documents });
});

const submitReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { submissionId, recommendation, comments } = req.body;
  const review = { submissionId, userId, recommendation, comments };
  await SupervisorService.submitReview(review);
  res.status(200).json({ success: true, message: 'Review submitted successfully' });
});

const forwardToAdmin = asyncHandler(async (req: Request, res: Response) => {
  const documentId = Number(req.params.id);
  await SupervisorService.forwardToAdmin(documentId);
  res.status(200).json({ success: true, message: 'Document forwarded to admin successfully' });
});

export const SupervisorController = {
  getAssignedStudents,
  getStudentProfile,
  getReviewDocuments,
  submitReview,
  forwardToAdmin,
};
