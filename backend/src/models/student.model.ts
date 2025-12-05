// src/models/student.model.ts

export interface Student {
    id: number;
    user_id: number;
    student_id: string | null;
    program: string | null;
    status: 'pending' | 'active' | 'rejected' | 'graduated';
    application_date: Date | null;
    enrollment_date: Date | null;
}

export interface StudentCreateDTO {
    userId: number;
    program?: string;
    studentId?: string; // Corresponds to universityId from frontend
}
