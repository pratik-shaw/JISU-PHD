// src/models/user.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    role: z.enum(['admin', 'dsc_member', 'supervisor', 'co_supervisor', 'student']),
    universityId: z.string().optional(), // For student users
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    role: z.enum(['admin', 'member', 'student']).optional(), // Role from frontend login pages
  }),
});
