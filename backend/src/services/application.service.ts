// src/services/application.service.ts
import { ApplicationRepository } from '../repositories/application.repository';
import { StudentRepository } from '../repositories/student.repository';
import { Application, ApplicationCreateDTO, ApplicationStatus } from '../models/application.model';
import { ApiError } from '../middleware/errorHandler';
import { FeedbackRepository } from '../repositories/feedback.repository'; // Import FeedbackRepository

export const ApplicationService = {
  async createApplication(userId: number, appDto: Omit<ApplicationCreateDTO, 'studentId'>): Promise<Application> {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
        throw new ApiError(404, 'Student profile not found for this user.');
    }

    // Now applications are stored in the submissions table
    const submissionData = {
        type: 'Application',
        title: appDto.type, // Using application type as title for submission
        abstract: appDto.details, // Using application details as abstract
        document_url: '' // Applications usually don't have a direct file upload, but keeping it for consistency
    };
    
    const submissionId = await StudentRepository.createSubmission(student.id, submissionData);
    const newSubmission = await StudentRepository.findSubmissionById(submissionId);
    if (!newSubmission) {
      throw new ApiError(500, 'Failed to create application submission');
    }

    // Map the submission back to an Application interface
    const newApp: Application = {
      id: newSubmission.id,
      student_id: newSubmission.student_id,
      type: newSubmission.type,
      status: newSubmission.status,
      submission_date: newSubmission.submission_date,
      details: newSubmission.abstract,
      student_name: newSubmission.student_name, // This needs to be fetched
    };

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

  async updateApplicationStatus(id: number, status: ApplicationStatus, userId: number, comment: string): Promise<Application> {
    console.log('ApplicationService.updateApplicationStatus called with:', { id, status, userId, comment });
    const app = await ApplicationRepository.findById(id);
    if (!app) {
      throw new ApiError(404, 'Application not found');
    }
    await ApplicationRepository.updateStatus(id, status);
    console.log(`Application status updated for ID: ${id} to ${status}`);

    // Create feedback entry
    if (comment && comment.trim().length > 0) {
      const feedbackId = await FeedbackRepository.create(id, userId, comment);
      console.log(`Feedback created with ID: ${feedbackId} for application ID: ${id}`);
    } else {
      console.log('No comment provided, skipping feedback creation.');
    }

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
