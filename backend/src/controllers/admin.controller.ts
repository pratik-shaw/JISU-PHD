// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import asyncHandler from '../middleware/asyncHandler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { StudentService } from '../services/student.service';
import path from 'path';
import { SubmissionService } from '../services/submission.service';

const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

const getRecentUserActivity = asyncHandler(async (req: Request, res: Response) => {
  const activity = await AdminService.getRecentUserActivity();
  res.status(200).json({ success: true, data: activity });
});

const viewAnySubmissionFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const submissionId = Number(req.params.id);
  const filePath = await StudentService.getSubmissionFilePathForAdmin(submissionId);
  res.sendFile(filePath, { root: '.' });
});

const reviewSubmission = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const submissionId = Number(req.params.id);
  const { decision, adminComments } = req.body;
  const userId = req.user!.id;

  console.log('AdminController.reviewSubmission received:', { submissionId, decision, adminComments, userId });

  const result = await SubmissionService.reviewSubmission(submissionId, userId, decision, adminComments);

  res.status(200).json({ success: true, message: 'Submission reviewed successfully', data: result });
});

const getSubmissionById = asyncHandler(async (req: Request, res: Response) => {
  const submissionId = Number(req.params.id);
  const submission = await SubmissionService.getSubmissionById(submissionId);
  if (!submission) {
    res.status(404).json({ success: false, message: 'Submission not found' });
    return;
  }
  res.status(200).json({ success: true, data: submission });
});

const getDscs = asyncHandler(async (req: Request, res: Response) => {
  const dscs = await AdminService.getDscs();
  res.status(200).json({ success: true, data: dscs });
});

const getAllSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const { status, type } = req.query;
  const submissions = await AdminService.getAllSubmissions({
    status: status as string | undefined,
    type: type as string | undefined,
  });
  res.status(200).json({ success: true, data: submissions });
});

export const AdminController = {
  getDashboardStats,
  getRecentUserActivity,
  viewAnySubmissionFile,
  reviewSubmission,
  getSubmissionById,
  getDscs,
  getAllSubmissions,
};
