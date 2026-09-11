import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class ChildService {
  async list(userId: string) {
    return prisma.child.findMany({
      where: {
        OR: [
          { userId },
          { sharedAccess: { some: { userId } } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        sharedAccess: { include: { user: { select: { name: true, email: true } } } }
      }
    });
  }

  async getById(id: string, userId: string) {
    const child = await prisma.child.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { sharedAccess: { some: { userId } } }
        ]
      },
      include: {
        sharedAccess: { include: { user: { select: { name: true, email: true } } } }
      }
    });
    if (!child) {
      throw new AppError('Criança não encontrada ou sem permissão', 404);
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
    // Only owner can update profile (or shared users if we want, but usually owner)
    // For now we'll allow anyone with access to update the profile details
    await this.verifyAccess(id, userId);

    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    return prisma.child.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const child = await prisma.child.findFirst({ where: { id, userId } });
    if (!child) throw new AppError('Somente o criador pode remover a criança', 403);
    return prisma.child.delete({ where: { id } });
  }

  async verifyAccess(childId: string, userId: string) {
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        OR: [
          { userId },
          { sharedAccess: { some: { userId } } }
        ]
      },
    });
    if (!child) {
      throw new AppError('Criança não encontrada ou sem permissão', 403);
    }
    return child;
  }

  async verifyOwnership(childId: string, userId: string) {
    // Kept for backward compatibility with other services until we rename them all
    return this.verifyAccess(childId, userId);
  }

  async shareAccess(childId: string, ownerId: string, emailToShare: string) {
    // Check if the current user is the owner
    const child = await prisma.child.findFirst({ where: { id: childId, userId: ownerId } });
    if (!child) throw new AppError('Somente o criador pode compartilhar o acesso', 403);

    // Find the user to share with
    const userToShare = await prisma.user.findUnique({ where: { email: emailToShare } });
    if (!userToShare) throw new AppError('Usuário não encontrado. Peça para ele criar uma conta no Soraia primeiro.', 404);

    if (userToShare.id === ownerId) throw new AppError('Você não pode compartilhar com você mesmo', 400);

    // Create or update access
    return prisma.childAccess.upsert({
      where: {
        childId_userId: {
          childId,
          userId: userToShare.id,
        }
      },
      update: {},
      create: {
        childId,
        userId: userToShare.id,
        role: 'editor'
      }
    });
  }

  async revokeAccess(childId: string, ownerId: string, accessId: string) {
    const child = await prisma.child.findFirst({ where: { id: childId, userId: ownerId } });
    if (!child) throw new AppError('Somente o criador pode gerenciar o acesso', 403);

    return prisma.childAccess.delete({ where: { id: accessId } });
  }
}

export const childService = new ChildService();
