import prisma from '../config/database';
import { childService } from './childService';

export class HealthService {
  // ============ APPOINTMENTS ============
  async createAppointment(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.appointment.create({
      data: {
        childId,
        professional: data.professional,
        specialty: data.specialty,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        reason: data.reason,
        notes: data.notes,
      },
    });
  }

  async getAppointments(childId: string, userId: string) {
    await childService.verifyOwnership(childId, userId);
    return prisma.appointment.findMany({
      where: { childId },
      orderBy: { date: 'desc' },
    });
  }

  async updateAppointment(id: string, userId: string, data: any) {
    const record = await prisma.appointment.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Consulta não encontrada');
    if (data.date) data.date = new Date(data.date);
    return prisma.appointment.update({ where: { id }, data });
  }

  async deleteAppointment(id: string, userId: string) {
    const record = await prisma.appointment.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Consulta não encontrada');
    return prisma.appointment.delete({ where: { id } });
  }

  // ============ VACCINES ============
  async createVaccine(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.vaccine.create({
      data: {
        childId,
        name: data.name,
        dose: data.dose,
        date: new Date(data.date),
        batch: data.batch,
        location: data.location,
        notes: data.notes,
      },
    });
  }

  async getVaccines(childId: string, userId: string) {
    await childService.verifyOwnership(childId, userId);
    return prisma.vaccine.findMany({
      where: { childId },
      orderBy: { date: 'desc' },
    });
  }

  async updateVaccine(id: string, userId: string, data: any) {
    const record = await prisma.vaccine.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Vacina não encontrada');
    if (data.date) data.date = new Date(data.date);
    return prisma.vaccine.update({ where: { id }, data });
  }

  async deleteVaccine(id: string, userId: string) {
    const record = await prisma.vaccine.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Vacina não encontrada');
    return prisma.vaccine.delete({ where: { id } });
  }

  // ============ REMINDERS ============
  async createReminder(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.reminder.create({
      data: {
        childId,
        title: data.title,
        description: data.description,
        dateTime: new Date(data.dateTime),
        recurrence: data.recurrence || 'none',
        enabled: data.enabled !== false,
      },
    });
  }

  async getReminders(childId: string, userId: string) {
    await childService.verifyOwnership(childId, userId);
    return prisma.reminder.findMany({
      where: { childId },
      orderBy: { dateTime: 'asc' },
    });
  }

  async updateReminder(id: string, userId: string, data: any) {
    const record = await prisma.reminder.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Lembrete não encontrado');
    if (data.dateTime) data.dateTime = new Date(data.dateTime);
    return prisma.reminder.update({ where: { id }, data });
  }

  async toggleReminder(id: string, userId: string) {
    const record = await prisma.reminder.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Lembrete não encontrado');
    return prisma.reminder.update({
      where: { id },
      data: { enabled: !record.enabled },
    });
  }

  async deleteReminder(id: string, userId: string) {
    const record = await prisma.reminder.findUnique({ where: { id }, include: { child: true } });
    if (!record || record.child.userId !== userId) throw new Error('Lembrete não encontrado');
    return prisma.reminder.delete({ where: { id } });
  }
}

export const healthService = new HealthService();
