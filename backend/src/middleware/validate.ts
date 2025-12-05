// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ApiError } from './errorHandler';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue: ZodIssue) => issue.message).join(', ');
        return next(new ApiError(400, `Validation error: ${messages}`));
      }
      return next(new ApiError(500, 'Internal Server Error during validation'));
    }
  };
