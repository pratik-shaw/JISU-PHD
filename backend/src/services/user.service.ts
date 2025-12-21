// src/services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { StudentRepository } from '../repositories/student.repository';
import { UserCreateDTO, User, UserRole } from '../models/user.model';
import { ApiError } from '../middleware/errorHandler';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';

export const UserService = {
  async createUser(userDto: UserCreateDTO): Promise<User> {
    const existingUser = await UserRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const passwordHash = await AuthService.hashPassword(userDto.password);
    const userId = await UserRepository.create(userDto, passwordHash);
    
    if (userDto.role === 'student') {
      // studentId is no longer passed to StudentRepository.create
      await StudentRepository.create({ userId });
    }

    const newUser = await UserRepository.findById(userId);

    if (!newUser) {
      throw new ApiError(500, 'Failed to create user');
    }
    
    const { password_hash, ...userResponse } = newUser;
    return userResponse as User;
  },

  async getAllUsers(): Promise<User[]> {
    return await UserRepository.findAll();
  },

  async getAllStudents(): Promise<any[]> {
    return await UserRepository.findAllStudents();
  },

  async getUserById(id: number): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async updateUser(id: number, userDto: Partial<UserCreateDTO> & { dscId?: number | string }): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updatePayload: Partial<UserCreateDTO> & { password_hash?: string; dscId?: number | string } = { ...userDto };
    let dscIdToUpdate: number | null | undefined = undefined;

    // Extract dscId if present and intended for a student
    if (userDto.dscId !== undefined) {
        dscIdToUpdate = userDto.dscId === '' ? null : Number(userDto.dscId);
        delete updatePayload.dscId; // Remove dscId from user update payload
    }

    if (userDto.password) {
      updatePayload.password_hash = await AuthService.hashPassword(userDto.password);
      delete updatePayload.password;
    }
    
    await UserRepository.update(id, updatePayload);

    // If the user is a student and dscId was provided, update the student's dsc_id
    if (user.role === 'student' && dscIdToUpdate !== undefined) {
        const student = await StudentRepository.findByUserId(id); // Find student by user ID
        if (student) {
            await StudentRepository.updateStudentDscId(student.id, dscIdToUpdate);
        } else {
            // This case should ideally not happen if user.role is 'student'
            throw new ApiError(500, 'Student profile not found for user');
        }
    }

    const updatedUser = await UserRepository.findById(id);
    if (!updatedUser) {
        throw new ApiError(500, 'Failed to fetch updated user');
    }

    return updatedUser;
  },

  async deleteUser(id: number): Promise<void> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    await UserRepository.remove(id);
  },

  async getAllMembers(): Promise<User[]> {
    return await UserRepository.findAllMembers();
  },

  async getAllNonStudentsNonAdmins(): Promise<User[]> {
    return await UserRepository.findAllNonStudentsNonAdmins();
  },

  async updateUserRole(id: number, role: UserRole): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Admins cannot have their role changed via this endpoint
    if (user.role === 'admin') {
      throw new ApiError(400, 'Cannot change the role of an admin');
    }

    await UserRepository.update(id, { role });

    const updatedUser = await UserRepository.findById(id);
    if (!updatedUser) {
        throw new ApiError(500, 'Failed to fetch updated user');
    }
    return updatedUser;
  },

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await UserRepository.findUserWithPassword(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid current password');
    }

    const newPasswordHash = await AuthService.hashPassword(newPassword);
    await UserRepository.update(user.id, { password_hash: newPasswordHash });
  }
};