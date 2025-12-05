// src/controllers/application.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { StudentRepository } from '../repositories/student.repository';
import asyncHandler from '../middleware/asyncHandler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../middleware/errorHandler';

const createApplication = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { type, details } = req.body;
    const newApp = await ApplicationService.createApplication(userId, { type, details });
    res.status(201).json({ success: true, data: newApp });
});

const getAllApplications = asyncHandler(async (req: Request, res: Response) => {
    const apps = await ApplicationService.getAllApplications();
    res.status(200).json({ success: true, data: apps });
});

const getApplicationById = asyncHandler(async (req: Request, res: Response) => {
    const app = await ApplicationService.getApplicationById(Number(req.params.id));
    res.status(200).json({ success: true, data: app });
});

const getMyApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const student = await StudentRepository.findByUserId(req.user!.id);
    if (!student) {
        throw new ApiError(404, 'Student profile not found for this user.');
    }
    const apps = await ApplicationService.getApplicationsByStudent(student.id);
    res.status(200).json({ success: true, data: apps });
});

const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const updatedApp = await ApplicationService.updateApplicationStatus(Number(req.params.id), status);
    res.status(200).json({ success: true, data: updatedApp });
});

export const ApplicationController = {
    createApplication,
    getAllApplications,
    getApplicationById,
    getMyApplications,
    updateApplicationStatus,
};