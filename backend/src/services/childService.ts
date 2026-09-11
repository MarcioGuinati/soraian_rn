import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class ChildService {
  async list(userId: string) {
    return prisma.child.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, userId: string) {
    const child = await prisma.child.findFirst({
      where: { id, userId },
    });
    if (!child) {
      throw new AppError('Criança não encontrada', 404);
    }
    return child;
  }

  async create(userId: string, data: {
    name: string;
    birthDate: string;
    gender: string;
    photo?: string;
    birthWeight?: number;
    birthHeight?: number;
    bloodType?: string;
    parentNames?: string;
    notes?: string;
  }) {
    return prisma.child.create({
      data: {
        userId,
        name: data.name,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        photo: data.photo,
        birthWeight: data.birthWeight,
        birthHeight: data.birthHeight,
        bloodType: data.bloodType,
        parentNames: data.parentNames,
        notes: data.notes,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.getById(id, userId);

    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    return prisma.child.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return prisma.child.delete({ where: { id } });
  }

  async verifyOwnership(childId: string, userId: string) {
    const child = await prisma.child.findFirst({
      where: { id: childId, userId },
    });
    if (!child) {
      throw new AppError('Criança não encontrada ou sem permissão', 403);
    }
    return child;
  }
}

export const childService = new ChildService();
