// src/controllers/dsc.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DscService } from '../services/dsc.service';
import asyncHandler from '../middleware/asyncHandler';

const createDsc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newDsc = await DscService.createDsc(req.body);
    res.status(201).json({
        success: true,
        data: newDsc,
    });
});

const getAllDscs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dscs = await DscService.getAllDscs();
    res.status(200).json({
        success: true,
        data: dscs,
    });
});

const getDscById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dsc = await DscService.getDscById(Number(req.params.id));
    res.status(200).json({
        success: true,
        data: dsc,
    });
});

const updateDsc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const updatedDsc = await DscService.updateDsc(Number(req.params.id), req.body);
    res.status(200).json({
        success: true,
        data: updatedDsc,
    });
});

const deleteDsc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await DscService.deleteDsc(Number(req.params.id));
    res.status(204).send();
});

const removeAllSupervisors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await DscService.removeAllSupervisors(Number(req.params.id));
    res.status(204).send();
});

const removeAllMembers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await DscService.removeAllMembers(Number(req.params.id));
    res.status(204).send();
});

export const DscController = {
    createDsc,
    getAllDscs,
    getDscById,
    updateDsc,
    deleteDsc,
    removeAllSupervisors,
    removeAllMembers,

    addMemberToDsc: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await DscService.addMemberToDsc(req.body);
        res.status(200).json({
            success: true,
            message: 'Member added to DSC successfully',
        });
    }),

    removeMemberFromDsc: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { userId, dscId } = req.params;
        await DscService.removeMemberFromDsc(Number(userId), Number(dscId));
        res.status(204).send();
    }),

    getDscMembers: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const members = await DscService.getDscMembers(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: members,
        });
    }),

    getDscStudents: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const students = await DscService.getDscStudents(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: students,
        });
    }),
};
