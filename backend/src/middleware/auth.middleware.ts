// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ApiError } from './errorHandler';
import { UserRepository } from '../repositories/user.repository';
import { User, UserRole } from '../models/user.model';
import asyncHandler from './asyncHandler';

// Extend the Express Request interface to include the user property
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const checkAuth = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authenticated'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: number, role: UserRole };
    const user = await UserRepository.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authenticated, token failed'));
  }
});

export const checkRole = (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'));
  }
  next();
};
