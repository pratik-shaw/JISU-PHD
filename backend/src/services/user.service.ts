// src/services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { StudentRepository } from '../repositories/student.repository';
import { UserCreateDTO, User, UserRole } from '../models/user.model';
import { ApiError } from '../middleware/errorHandler';
import { AuthService } from './auth.service';

export const UserService = {
  async createUser(userDto: UserCreateDTO): Promise<User> {
    const existingUser = await UserRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const passwordHash = await AuthService.hashPassword(userDto.password);
    const userId = await UserRepository.create(userDto, passwordHash);
    
    if (userDto.role === 'student') {
      await StudentRepository.create({ userId, studentId: userDto.universityId });
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

  async getUserById(id: number): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async updateUser(id: number, userDto: Partial<UserCreateDTO>): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updatePayload: Partial<UserCreateDTO> & { password_hash?: string } = { ...userDto };

    if (userDto.password) {
      updatePayload.password_hash = await AuthService.hashPassword(userDto.password);
      delete updatePayload.password;
    }
    
    await UserRepository.update(id, updatePayload);

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
  }
};