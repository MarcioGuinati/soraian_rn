import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = (result.error as any).errors.map((e: any) => e.message).join(', ');
      throw new AppError(messages, 400);
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const messages = (result.error as any).errors.map((e: any) => e.message).join(', ');
      throw new AppError(messages, 400);
    }
    req.query = result.data as any;
    next();
  };
};
