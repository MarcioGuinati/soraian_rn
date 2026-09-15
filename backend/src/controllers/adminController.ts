import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class AdminController {
  async getStats(_req: AuthRequest, res: Response) {
    const totalUsers = await prisma.user.count({ where: { role: 'user' } });
    const totalChildren = await prisma.child.count();

    // Novos cadastros últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = await prisma.user.count({
      where: { role: 'user', createdAt: { gte: sevenDaysAgo } },
    });

    // Novos cadastros últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await prisma.user.count({
      where: { role: 'user', createdAt: { gte: thirtyDaysAgo } },
    });

    // Total de registros por tipo
    const totalFeedings = await prisma.feedingRecord.count();
    const totalDiapers = await prisma.diaperRecord.count();
    const totalSleeps = await prisma.sleepRecord.count();
    const totalBaths = await prisma.bathRecord.count();
    const totalMedications = await prisma.medicationRecord.count();
    const totalVaccines = await prisma.vaccine.count();
    const totalAppointments = await prisma.appointment.count();
    const totalNotes = await prisma.note.count();

    // Registros criados hoje
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const recordsToday = await prisma.feedingRecord.count({ where: { createdAt: { gte: todayStart } } })
      + await prisma.diaperRecord.count({ where: { createdAt: { gte: todayStart } } })
      + await prisma.sleepRecord.count({ where: { createdAt: { gte: todayStart } } })
      + await prisma.bathRecord.count({ where: { createdAt: { gte: todayStart } } });

    res.json({
      status: 'success',
      data: {
        totalUsers,
        totalChildren,
        newUsersLast7Days,
        newUsersLast30Days,
        recordsToday,
        records: {
          feedings: totalFeedings,
          diapers: totalDiapers,
          sleeps: totalSleeps,
          baths: totalBaths,
          medications: totalMedications,
          vaccines: totalVaccines,
          appointments: totalAppointments,
          notes: totalNotes,
        },
      },
    });
  }

  async getUsers(_req: AuthRequest, res: Response) {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { children: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: users });
  }

  async getUserDetails(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        children: {
          select: {
            id: true,
            name: true,
            birthDate: true,
            gender: true,
            photo: true,
            createdAt: true,
            _count: {
              select: {
                feedingRecords: true,
                diaperRecords: true,
                sleepRecords: true,
                bathRecords: true,
                temperatureRecords: true,
                weightRecords: true,
                medicationRecords: true,
                appointments: true,
                vaccines: true,
                reminders: true,
                notes_: true,
                foodRecords: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({ status: 'success', data: user });
  }

  async deleteUser(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.role === 'admin') {
      throw new AppError('Não é possível excluir um administrador', 403);
    }

    await prisma.user.delete({ where: { id } });

    res.json({ status: 'success', message: 'Usuário excluído com sucesso' });
  }
}

export const adminController = new AdminController();
