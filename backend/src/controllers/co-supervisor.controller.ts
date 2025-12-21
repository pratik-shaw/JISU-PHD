// src/controllers/co-supervisor.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { CoSupervisorService } from '../services/co-supervisor.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const getAssignedStudents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const students = await CoSupervisorService.getAssignedStudents(userId);
  res.status(200).json({ success: true, data: students });
});

const getStudentProfile = asyncHandler(async (req: Request, res: Response) => {
  const studentId = Number(req.params.id);
  const profile = await CoSupervisorService.getStudentProfile(studentId);
  res.status(200).json({ success: true, data: profile });
});

const getReviewDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const documents = await CoSupervisorService.getReviewDocuments(userId);
  res.status(200).json({ success: true, data: documents });
});

const submitReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { submissionId, recommendation, comments } = req.body;
  const review = { submissionId, userId, recommendation, comments };
  await CoSupervisorService.submitReview(review);
  res.status(200).json({ success: true, message: 'Review submitted successfully' });
});

const forwardDocument = asyncHandler(async (req: Request, res: Response) => {
  const documentId = Number(req.params.id);
  await CoSupervisorService.forwardDocument(documentId);
  res.status(200).json({ success: true, message: 'Document forwarded successfully' });
});


const viewSubmissionFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const submissionId = Number(req.params.id);
  const filePath = await CoSupervisorService.getSubmissionFilePath(submissionId, userId);

  res.sendFile(filePath, { root: '.' });
});

const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;
  await CoSupervisorService.changePassword(userId, currentPassword, newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});

export const CoSupervisorController = {
  getAssignedStudents,
  getStudentProfile,
  getReviewDocuments,
  submitReview,
  forwardDocument,
  viewSubmissionFile,
  changePassword,
};