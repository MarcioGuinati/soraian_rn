import prisma from '../config/database';
import { childService } from './childService';

export class RecordService {
  // ============ FEEDING ============
  async createFeeding(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.feedingRecord.create({
      data: {
        childId,
        type: data.type,
        amountMl: data.amountMl,
        breastSide: data.breastSide,
        durationMinutes: data.durationMinutes,
        recordedAt: new Date(data.recordedAt),
        notes: data.notes,
      },
    });
  }

  async getFeedings(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.feedingRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
    });
  }

  async updateFeeding(id: string, userId: string, data: any) {
    const record = await prisma.feedingRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.feedingRecord.update({ where: { id }, data });
  }

  async deleteFeeding(id: string, userId: string) {
    const record = await prisma.feedingRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.feedingRecord.delete({ where: { id } });
  }

  // ============ FOOD ============
  async createFood(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.foodRecord.create({
      data: {
        childId,
        mealType: data.mealType,
        food: data.food,
        amount: data.amount,
        unit: data.unit,
        recordedAt: new Date(data.recordedAt),
        notes: data.notes,
      },
    });
  }

  async getFoods(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.foodRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateFood(id: string, userId: string, data: any) {
    const record = await prisma.foodRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.foodRecord.update({ where: { id }, data });
  }

  async deleteFood(id: string, userId: string) {
    const record = await prisma.foodRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.foodRecord.delete({ where: { id } });
  }

  // ============ DIAPER ============
  async createDiaper(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.diaperRecord.create({
      data: {
        childId,
        type: data.type,
        consistency: data.consistency,
        color: data.color,
        amount: data.amount,
        recordedAt: new Date(data.recordedAt),
        notes: data.notes,
      },
    });
  }

  async getDiapers(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.diaperRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateDiaper(id: string, userId: string, data: any) {
    const record = await prisma.diaperRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.diaperRecord.update({ where: { id }, data });
  }

  async deleteDiaper(id: string, userId: string) {
    const record = await prisma.diaperRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.diaperRecord.delete({ where: { id } });
  }

  // ============ SLEEP ============
  async createSleep(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    const startedAt = new Date(data.startedAt);
    const endedAt = data.endedAt ? new Date(data.endedAt) : null;
    let durationMinutes = data.durationMinutes || null;

    if (startedAt && endedAt && !durationMinutes) {
      durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
    }

    return prisma.sleepRecord.create({
      data: {
        childId,
        startedAt,
        endedAt,
        durationMinutes,
        location: data.location,
        isActive: !endedAt,
        notes: data.notes,
      },
    });
  }

  async startSleep(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    // End any active sleep first
    await prisma.sleepRecord.updateMany({
      where: { childId, isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });

    return prisma.sleepRecord.create({
      data: {
        childId,
        startedAt: new Date(),
        isActive: true,
        location: data?.location,
        notes: data?.notes,
      },
    });
  }

  async stopSleep(childId: string, userId: string) {
    await childService.verifyOwnership(childId, userId);
    const activeSleep = await prisma.sleepRecord.findFirst({
      where: { childId, isActive: true },
    });

    if (!activeSleep) {
      throw new Error('Nenhum sono ativo encontrado');
    }

    const endedAt = new Date();
    const durationMinutes = Math.round((endedAt.getTime() - activeSleep.startedAt.getTime()) / 60000);

    return prisma.sleepRecord.update({
      where: { id: activeSleep.id },
      data: { endedAt, durationMinutes, isActive: false },
    });
  }

  async getSleeps(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) where.startedAt.gte = new Date(startDate);
      if (endDate) where.startedAt.lte = new Date(endDate);
    }
    return prisma.sleepRecord.findMany({ where, orderBy: { startedAt: 'desc' } });
  }

  async updateSleep(id: string, userId: string, data: any) {
    const record = await prisma.sleepRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.startedAt) data.startedAt = new Date(data.startedAt);
    if (data.endedAt) {
      data.endedAt = new Date(data.endedAt);
      if (data.startedAt || record.startedAt) {
        const start = data.startedAt || record.startedAt;
        data.durationMinutes = Math.round((data.endedAt.getTime() - start.getTime()) / 60000);
        data.isActive = false;
      }
    }
    return prisma.sleepRecord.update({ where: { id }, data });
  }

  async deleteSleep(id: string, userId: string) {
    const record = await prisma.sleepRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.sleepRecord.delete({ where: { id } });
  }

  // ============ BATH ============
  async createBath(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.bathRecord.create({
      data: {
        childId,
        startedAt: new Date(data.startedAt),
        durationMinutes: data.durationMinutes,
        waterTemperature: data.waterTemperature,
        notes: data.notes,
      },
    });
  }

  async getBaths(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) where.startedAt.gte = new Date(startDate);
      if (endDate) where.startedAt.lte = new Date(endDate);
    }
    return prisma.bathRecord.findMany({ where, orderBy: { startedAt: 'desc' } });
  }

  async updateBath(id: string, userId: string, data: any) {
    const record = await prisma.bathRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.startedAt) data.startedAt = new Date(data.startedAt);
    return prisma.bathRecord.update({ where: { id }, data });
  }

  async deleteBath(id: string, userId: string) {
    const record = await prisma.bathRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.bathRecord.delete({ where: { id } });
  }

  // ============ TEMPERATURE ============
  async createTemperature(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.temperatureRecord.create({
      data: {
        childId,
        temperature: data.temperature,
        measurementMethod: data.measurementMethod,
        recordedAt: new Date(data.recordedAt),
        notes: data.notes,
      },
    });
  }

  async getTemperatures(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.temperatureRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateTemperature(id: string, userId: string, data: any) {
    const record = await prisma.temperatureRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.temperatureRecord.update({ where: { id }, data });
  }

  async deleteTemperature(id: string, userId: string) {
    const record = await prisma.temperatureRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.temperatureRecord.delete({ where: { id } });
  }

  // ============ WEIGHT ============
  async createWeight(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.weightRecord.create({
      data: {
        childId,
        weight: data.weight,
        height: data.height,
        headCircumference: data.headCircumference,
        recordedAt: new Date(data.recordedAt),
        notes: data.notes,
      },
    });
  }

  async getWeights(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.weightRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateWeight(id: string, userId: string, data: any) {
    const record = await prisma.weightRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.weightRecord.update({ where: { id }, data });
  }

  async deleteWeight(id: string, userId: string) {
    const record = await prisma.weightRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.weightRecord.delete({ where: { id } });
  }

  // ============ MEDICATION ============
  async createMedication(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.medicationRecord.create({
      data: {
        childId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        unit: data.unit,
        recordedAt: new Date(data.recordedAt),
        reason: data.reason,
        notes: data.notes,
      },
    });
  }

  async getMedications(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.medicationRecord.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateMedication(id: string, userId: string, data: any) {
    const record = await prisma.medicationRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.medicationRecord.update({ where: { id }, data });
  }

  async deleteMedication(id: string, userId: string) {
    const record = await prisma.medicationRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.medicationRecord.delete({ where: { id } });
  }

  // ============ NOTES ============
  async createNote(childId: string, userId: string, data: any) {
    await childService.verifyOwnership(childId, userId);
    return prisma.note.create({
      data: {
        childId,
        category: data.category,
        content: data.content,
        recordedAt: new Date(data.recordedAt),
      },
    });
  }

  async getNotes(childId: string, userId: string, startDate?: string, endDate?: string) {
    await childService.verifyOwnership(childId, userId);
    const where: any = { childId };
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }
    return prisma.note.findMany({ where, orderBy: { recordedAt: 'desc' } });
  }

  async updateNote(id: string, userId: string, data: any) {
    const record = await prisma.note.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    if (data.recordedAt) data.recordedAt = new Date(data.recordedAt);
    return prisma.note.update({ where: { id }, data });
  }

  async deleteNote(id: string, userId: string) {
    const record = await prisma.note.findUnique({ where: { id } });
    if (!record) throw new Error('Registro não encontrado');
    await childService.verifyOwnership(record.childId, userId);
    return prisma.note.delete({ where: { id } });
  }
}

export const recordService = new RecordService();
