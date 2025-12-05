// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import asyncHandler from '../middleware/asyncHandler';
import logger from '../utils/logger';

const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await UserService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Attempting to fetch user with ID: ${req.params.id}`);
  const user = await UserService.getUserById(Number(req.params.id));
  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const updatedUser = await UserService.updateUser(Number(req.params.id), req.body);
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await UserService.deleteUser(Number(req.params.id));
  res.status(204).send();
});

const getAllMembers = asyncHandler(async (req: Request, res: Response) => {
    const members = await UserService.getAllMembers();
    res.status(200).json({
      success: true,
      data: members,
    });
});

const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const updatedUser = await UserService.updateUserRole(Number(id), role);
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllMembers,
  updateUserRole,
};