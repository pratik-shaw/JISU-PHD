// src/models/application.model.ts
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface Application {
    id: number;
    student_id: number;
    type: string;
    status: ApplicationStatus;
    submission_date: Date;
    details: string | null;
    student_name?: string; // Add student_name
}

export interface ApplicationCreateDTO {
    studentId: number;
    type: string;
    details?: string;
}
