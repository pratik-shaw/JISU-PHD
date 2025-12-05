// src/services/application.service.ts
import { ApplicationRepository } from '../repositories/application.repository';
import { StudentRepository } from '../repositories/student.repository';
import { Application, ApplicationCreateDTO, ApplicationStatus } from '../models/application.model';
import { ApiError } from '../middleware/errorHandler';

export const ApplicationService = {
  async createApplication(userId: number, appDto: Omit<ApplicationCreateDTO, 'studentId'>): Promise<Application> {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
        throw new ApiError(404, 'Student profile not found for this user.');
    }

    const fullAppDto: ApplicationCreateDTO = {
        ...appDto,
        studentId: student.id,
    };
    
    const appId = await ApplicationRepository.create(fullAppDto);
    const newApp = await ApplicationRepository.findById(appId);
    if (!newApp) {
      throw new ApiError(500, 'Failed to create application');
    }
    return newApp;
  },

  async getAllApplications(): Promise<Application[]> {
    return await ApplicationRepository.findAll();
  },

  async getApplicationById(id: number): Promise<Application> {
    const app = await ApplicationRepository.findById(id);
    if (!app) {
      throw new ApiError(404, 'Application not found');
    }
    return app;
  },

  async getApplicationsByStudent(studentId: number): Promise<Application[]> {
    return await ApplicationRepository.findByStudentId(studentId);
  },

  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const app = await ApplicationRepository.findById(id);
    if (!app) {
      throw new ApiError(404, 'Application not found');
    }
    await ApplicationRepository.updateStatus(id, status);
    const updatedApp = await ApplicationRepository.findById(id);
    if (!updatedApp) {
        throw new ApiError(500, 'Failed to fetch updated application');
    }
    return updatedApp;
  },

  async deleteApplication(id: number): Promise<void> {
    const app = await ApplicationRepository.findById(id);
    if (!app) {
      throw new ApiError(404, 'Application not found');
    }
    await ApplicationRepository.remove(id);
  }
};
