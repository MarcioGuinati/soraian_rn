import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../config/database';
import { AppError } from './errorHandler';

export const adminMiddleware = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  if (!req.userId) {
    throw new AppError('Não autenticado', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'admin') {
    throw new AppError('Acesso negado. Somente administradores.', 403);
  }

  next();
};
