// src/models/application.validation.ts
import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    type: z.string().min(1, { message: 'Application type is required' }),
    details: z.string().optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
    body: z.object({
        status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
        comment: z.string().optional(),
    }),
});
