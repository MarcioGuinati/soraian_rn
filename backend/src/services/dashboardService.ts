import prisma from '../config/database';
import { childService } from './childService';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from 'date-fns';

export class DashboardService {
  async getDashboard(childId: string, userId: string) {
    await childService.verifyOwnership(childId, userId);

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const [
      feedings,
      foods,
      diapers,
      sleeps,
      baths,
      latestTemp,
      latestWeight,
      activeSleep,
      reminders,
    ] = await Promise.all([
      prisma.feedingRecord.findMany({
        where: { childId, recordedAt: { gte: todayStart, lte: todayEnd } },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.foodRecord.findMany({
        where: { childId, recordedAt: { gte: todayStart, lte: todayEnd } },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.diaperRecord.findMany({
        where: { childId, recordedAt: { gte: todayStart, lte: todayEnd } },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.sleepRecord.findMany({
        where: { childId, startedAt: { gte: todayStart, lte: todayEnd } },
        orderBy: { startedAt: 'desc' },
      }),
      prisma.bathRecord.findMany({
        where: { childId, startedAt: { gte: todayStart, lte: todayEnd } },
        orderBy: { startedAt: 'desc' },
      }),
      prisma.temperatureRecord.findFirst({
        where: { childId },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.weightRecord.findFirst({
        where: { childId },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.sleepRecord.findFirst({
        where: { childId, isActive: true },
      }),
      prisma.reminder.findMany({
        where: { childId, enabled: true, dateTime: { gte: now } },
        orderBy: { dateTime: 'asc' },
        take: 5,
      }),
    ]);

    const totalMl = feedings.reduce((sum, f) => sum + (f.amountMl || 0), 0);
    const totalSleepMinutes = sleeps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const peeCount = diapers.filter(d => d.type === 'xixi').length;
    const poopCount = diapers.filter(d => d.type === 'coco').length;

    return {
      today: {
        feeding: {
          count: feedings.length,
          totalMl,
          last: feedings[0] || null,
        },
        food: {
          count: foods.length,
          last: foods[0] || null,
        },
        diaper: {
          peeCount,
          poopCount,
          total: diapers.length,
          lastPee: diapers.find(d => d.type === 'xixi') || null,
          lastPoop: diapers.find(d => d.type === 'coco') || null,
        },
        sleep: {
          totalMinutes: totalSleepMinutes,
          count: sleeps.length,
          last: sleeps[0] || null,
          activeSleep,
        },
        bath: {
          count: baths.length,
          last: baths[0] || null,
        },
        temperature: latestTemp,
        weight: latestWeight,
      },
      upcomingReminders: reminders,
    };
  }

  async getTimeline(childId: string, userId: string, params: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    await childService.verifyOwnership(childId, userId);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const dateFilter: any = {};
    if (params.startDate) dateFilter.gte = new Date(params.startDate);
    if (params.endDate) dateFilter.lte = new Date(params.endDate);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    const events: any[] = [];
    const types = params.type ? [params.type] : ['feeding', 'food', 'diaper', 'sleep', 'bath', 'temperature', 'weight', 'medication', 'note'];

    const queries = [];

    if (types.includes('feeding')) {
      queries.push(
        prisma.feedingRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'feeding', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('food')) {
      queries.push(
        prisma.foodRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'food', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('diaper')) {
      queries.push(
        prisma.diaperRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'diaper', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('sleep')) {
      queries.push(
        prisma.sleepRecord.findMany({
          where: { childId, ...(hasDateFilter ? { startedAt: dateFilter } : {}) },
          orderBy: { startedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'sleep', eventDate: r.startedAt })))
      );
    }

    if (types.includes('bath')) {
      queries.push(
        prisma.bathRecord.findMany({
          where: { childId, ...(hasDateFilter ? { startedAt: dateFilter } : {}) },
          orderBy: { startedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'bath', eventDate: r.startedAt })))
      );
    }

    if (types.includes('temperature')) {
      queries.push(
        prisma.temperatureRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'temperature', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('weight')) {
      queries.push(
        prisma.weightRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'weight', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('medication')) {
      queries.push(
        prisma.medicationRecord.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'medication', eventDate: r.recordedAt })))
      );
    }

    if (types.includes('note')) {
      queries.push(
        prisma.note.findMany({
          where: { childId, ...(hasDateFilter ? { recordedAt: dateFilter } : {}) },
          orderBy: { recordedAt: 'desc' },
        }).then(records => records.map(r => ({ ...r, eventType: 'note', eventDate: r.recordedAt })))
      );
    }

    const results = await Promise.all(queries);
    const allEvents = results.flat();

    // Sort all events by date descending
    allEvents.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

    const total = allEvents.length;
    const paginated = allEvents.slice(skip, skip + limit);

    return {
      events: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCalendar(childId: string, userId: string, year: number, month: number) {
    await childService.verifyOwnership(childId, userId);

    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const [feedings, foods, diapers, sleeps, baths, temps, weights, meds, notes] = await Promise.all([
      prisma.feedingRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.foodRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.diaperRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.sleepRecord.count({ where: { childId, startedAt: { gte: start, lte: end } } }),
      prisma.bathRecord.count({ where: { childId, startedAt: { gte: start, lte: end } } }),
      prisma.temperatureRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.weightRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.medicationRecord.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
      prisma.note.count({ where: { childId, recordedAt: { gte: start, lte: end } } }),
    ]);

    // Get daily counts for calendar dots
    const allFeedings = await prisma.feedingRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      select: { recordedAt: true },
    });

    const allDiapers = await prisma.diaperRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      select: { recordedAt: true, type: true },
    });

    const allSleeps = await prisma.sleepRecord.findMany({
      where: { childId, startedAt: { gte: start, lte: end } },
      select: { startedAt: true },
    });

    // Build daily summary
    const dailyMap: Record<string, { feeding: number; diaper: number; sleep: number; total: number }> = {};

    const addToDay = (date: Date, type: string) => {
      const key = date.toISOString().split('T')[0];
      if (!dailyMap[key]) dailyMap[key] = { feeding: 0, diaper: 0, sleep: 0, total: 0 };
      (dailyMap[key] as any)[type]++;
      dailyMap[key].total++;
    };

    allFeedings.forEach(f => addToDay(f.recordedAt, 'feeding'));
    allDiapers.forEach(d => addToDay(d.recordedAt, 'diaper'));
    allSleeps.forEach(s => addToDay(s.startedAt, 'sleep'));

    return {
      summary: { feedings, foods, diapers, sleeps, baths, temps, weights, meds, notes },
      dailyCounts: dailyMap,
    };
  }

  async getReports(childId: string, userId: string, type: string, startDate: string, endDate: string) {
    await childService.verifyOwnership(childId, userId);

    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (type) {
      case 'feeding':
        return this.getFeedingReport(childId, start, end);
      case 'sleep':
        return this.getSleepReport(childId, start, end);
      case 'diaper':
        return this.getDiaperReport(childId, start, end);
      case 'food':
        return this.getFoodReport(childId, start, end);
      case 'weight':
        return this.getWeightReport(childId, start, end);
      case 'general':
        return this.getGeneralReport(childId, start, end);
      default:
        throw new Error('Tipo de relatório inválido');
    }
  }

  private async getFeedingReport(childId: string, start: Date, end: Date) {
    const feedings = await prisma.feedingRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      orderBy: { recordedAt: 'asc' },
    });

    const totalMl = feedings.reduce((sum, f) => sum + (f.amountMl || 0), 0);
    const avgMl = feedings.length > 0 ? totalMl / feedings.length : 0;

    const byType: Record<string, number> = {};
    feedings.forEach(f => {
      byType[f.type] = (byType[f.type] || 0) + 1;
    });

    // Daily evolution
    const daily: Record<string, { count: number; totalMl: number }> = {};
    feedings.forEach(f => {
      const day = f.recordedAt.toISOString().split('T')[0];
      if (!daily[day]) daily[day] = { count: 0, totalMl: 0 };
      daily[day].count++;
      daily[day].totalMl += f.amountMl || 0;
    });

    return {
      total: feedings.length,
      totalMl,
      avgMl: Math.round(avgMl),
      byType,
      daily: Object.entries(daily).map(([date, data]) => ({ date, ...data })),
      records: feedings,
    };
  }

  private async getSleepReport(childId: string, start: Date, end: Date) {
    const sleeps = await prisma.sleepRecord.findMany({
      where: { childId, startedAt: { gte: start, lte: end } },
      orderBy: { startedAt: 'asc' },
    });

    const totalMinutes = sleeps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const avgDuration = sleeps.length > 0 ? totalMinutes / sleeps.length : 0;
    const longestSleep = sleeps.reduce((max, s) => Math.max(max, s.durationMinutes || 0), 0);

    // Day vs night (6am-6pm = day)
    let dayMinutes = 0;
    let nightMinutes = 0;
    sleeps.forEach(s => {
      const hour = s.startedAt.getHours();
      if (hour >= 6 && hour < 18) {
        dayMinutes += s.durationMinutes || 0;
      } else {
        nightMinutes += s.durationMinutes || 0;
      }
    });

    const daily: Record<string, { count: number; totalMinutes: number }> = {};
    sleeps.forEach(s => {
      const day = s.startedAt.toISOString().split('T')[0];
      if (!daily[day]) daily[day] = { count: 0, totalMinutes: 0 };
      daily[day].count++;
      daily[day].totalMinutes += s.durationMinutes || 0;
    });

    return {
      total: sleeps.length,
      totalMinutes,
      avgDuration: Math.round(avgDuration),
      longestSleep,
      dayMinutes,
      nightMinutes,
      daily: Object.entries(daily).map(([date, data]) => ({ date, ...data })),
      records: sleeps,
    };
  }

  private async getDiaperReport(childId: string, start: Date, end: Date) {
    const diapers = await prisma.diaperRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      orderBy: { recordedAt: 'asc' },
    });

    const peeCount = diapers.filter(d => d.type === 'xixi').length;
    const poopCount = diapers.filter(d => d.type === 'coco').length;

    // By hour
    const byHour: Record<number, number> = {};
    diapers.forEach(d => {
      const hour = d.recordedAt.getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;
    });

    const daily: Record<string, { pee: number; poop: number }> = {};
    diapers.forEach(d => {
      const day = d.recordedAt.toISOString().split('T')[0];
      if (!daily[day]) daily[day] = { pee: 0, poop: 0 };
      if (d.type === 'xixi') daily[day].pee++;
      else daily[day].poop++;
    });

    return {
      total: diapers.length,
      peeCount,
      poopCount,
      byHour,
      daily: Object.entries(daily).map(([date, data]) => ({ date, ...data })),
      records: diapers,
    };
  }

  private async getFoodReport(childId: string, start: Date, end: Date) {
    const foods = await prisma.foodRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      orderBy: { recordedAt: 'asc' },
    });

    const byFood: Record<string, number> = {};
    foods.forEach(f => {
      byFood[f.food] = (byFood[f.food] || 0) + 1;
    });

    const byMealType: Record<string, number> = {};
    foods.forEach(f => {
      byMealType[f.mealType] = (byMealType[f.mealType] || 0) + 1;
    });

    return {
      total: foods.length,
      byFood,
      byMealType,
      records: foods,
    };
  }

  private async getWeightReport(childId: string, start: Date, end: Date) {
    const weights = await prisma.weightRecord.findMany({
      where: { childId, recordedAt: { gte: start, lte: end } },
      orderBy: { recordedAt: 'asc' },
    });

    return {
      total: weights.length,
      records: weights.map(w => ({
        date: w.recordedAt.toISOString().split('T')[0],
        weight: w.weight,
        height: w.height,
        headCircumference: w.headCircumference,
      })),
    };
  }

  private async getGeneralReport(childId: string, start: Date, end: Date) {
    const [feeding, sleep, diaper, food, weight] = await Promise.all([
      this.getFeedingReport(childId, start, end),
      this.getSleepReport(childId, start, end),
      this.getDiaperReport(childId, start, end),
      this.getFoodReport(childId, start, end),
      this.getWeightReport(childId, start, end),
    ]);

    return { feeding, sleep, diaper, food, weight };
  }
}

export const dashboardService = new DashboardService();
