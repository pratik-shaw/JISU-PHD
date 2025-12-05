// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import asyncHandler from '../middleware/asyncHandler';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const loginDto = req.body;
  const { user, token } = await AuthService.login(loginDto);

  // As per frontend specs, send token in an httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });

  res.status(200).json({
    success: true,
    user,
    token, // Also returning token in body as per frontend expectation
  });
});

const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const AuthController = {
  login,
  getMe,
  logout,
};
