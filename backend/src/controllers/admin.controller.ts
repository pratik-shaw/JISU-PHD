// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import asyncHandler from '../middleware/asyncHandler';

const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

const getRecentUserActivity = asyncHandler(async (req: Request, res: Response) => {
  const activity = await AdminService.getRecentUserActivity();
  res.status(200).json({ success: true, data: activity });
});

export const AdminController = {
  getDashboardStats,
  getRecentUserActivity,
};
