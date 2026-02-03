import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, { 
    status: err.status,
    stack: err.stack,
    name: err.name,
  });

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Explicitly set CORS header for errors
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};

export default errorHandler;
