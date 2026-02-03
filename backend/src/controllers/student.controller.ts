// src/controllers/student.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { StudentService } from '../services/student.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import path from 'path';

const getDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const documents = await StudentService.getDocuments(userId);
  res.status(200).json({ success: true, data: documents });
});

const createSubmission = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { type, title, abstract } = req.body;
  const document_url = req.file?.path;

  if (!document_url) {
    throw new Error('File not uploaded');
  }

  const newSubmission = await StudentService.createSubmission(userId, {
    type,
    title,
    abstract,
    document_url,
  });
  res.status(201).json({ success: true, data: newSubmission });
});

const getSubmissionById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id; // Ensure submission belongs to the authenticated user
  const submission = await StudentService.getSubmissionById(Number(req.params.id), userId);
  res.status(200).json({ success: true, data: submission });
});

const viewSubmissionFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const submissionId = Number(req.params.id);
  const filePath = await StudentService.getSubmissionFilePath(submissionId, userId);

  res.sendFile(filePath, { root: '.' });
});

const getFeedbackForSubmission = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const submissionId = Number(req.params.id);
  const feedback = await StudentService.getFeedbackForSubmission(submissionId, userId);
  res.status(200).json({ success: true, data: feedback });
});

export const StudentController = {
  getDocuments,
  createSubmission,
  getSubmissionById,
  viewSubmissionFile,
  getFeedbackForSubmission,
};
