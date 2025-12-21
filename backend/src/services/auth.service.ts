// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { UserLoginDTO, UserRole } from '../models/user.model';
import { ApiError } from '../middleware/errorHandler';
import config from '../config';
import { SignOptions } from 'jsonwebtoken';
import logger from '../utils/logger';

export const AuthService = {
  async login(loginDto: UserLoginDTO & { role?: string }) {
    logger.info(`Login attempt for email: ${loginDto.email}`);
    
    const user = await UserRepository.findByEmail(loginDto.email);

    if (!user) {
      logger.error(`Login failed: User not found for email ${loginDto.email}`);
      throw new ApiError(401, 'Invalid credentials');
    }

    logger.info(`User found in DB: ${JSON.stringify(user)}`);

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    
    logger.info(`Password validation result for ${loginDto.email}: ${isPasswordValid}`);

    if (!isPasswordValid) {
      logger.error(`Login failed: Invalid password for email ${loginDto.email}`);
      throw new ApiError(401, 'Invalid credentials');
    }

    // Role validation based on the login portal
    const portalRole = loginDto.role;
    const userRole = user.role;

    if (portalRole === 'admin' && userRole !== 'admin') {
      throw new ApiError(403, 'Access denied. Not an administrator.');
    }
    if (portalRole === 'member' && !['dsc_member', 'supervisor', 'co_supervisor'].includes(userRole)) {
      throw new ApiError(403, 'Access denied. Not a faculty member.');
    }
    if (portalRole === 'student' && userRole !== 'student') {
        throw new ApiError(403, 'Access denied. Not a student.');
    }


    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn,
    };

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      signOptions
    );

    // Don't send password hash to client
    const { password_hash, ...userResponse } = user;

    return { user: userResponse, token };
  },

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
};
