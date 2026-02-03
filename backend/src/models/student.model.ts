// src/models/student.model.ts

export interface Student {
    id: number;
    user_id: number;
    program: string | null;
    status: 'pending' | 'active' | 'rejected' | 'graduated';
    application_date: Date | null;
    enrollment_date: Date | null;
}

export interface StudentCreateDTO {
    userId: number;
    program?: string;
}
