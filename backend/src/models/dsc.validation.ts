// src/models/dsc.validation.ts
import { z } from 'zod';

export const createDscSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'DSC name is required' }),
    description: z.string().optional(),
    formation_date: z.string().optional(), // Can be a date string
  }),
});

export const addMemberToDscSchema = z.object({
  body: z.object({
    userId: z.number(),
    dscId: z.number(),
    role: z.enum(['supervisor', 'co_supervisor', 'member']),
  }),
});
