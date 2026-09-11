import { Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export class DashboardController {
  async getDashboard(req: any, res: Response) {
    const data = await dashboardService.getDashboard(req.params.childId, req.userId);
    res.json({ status: 'success', data });
  }

  async getTimeline(req: any, res: Response) {
    const data = await dashboardService.getTimeline(req.params.childId, req.userId, {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      type: req.query.type,
      page: req.query.page ? parseInt(req.query.page) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
    });
    res.json({ status: 'success', data });
  }

  async getCalendar(req: any, res: Response) {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const data = await dashboardService.getCalendar(req.params.childId, req.userId, year, month);
    res.json({ status: 'success', data });
  }

  async getReports(req: any, res: Response) {
    const { type, startDate, endDate } = req.query;
    const data = await dashboardService.getReports(req.params.childId, req.userId, type, startDate, endDate);
    res.json({ status: 'success', data });
  }
}

export const dashboardController = new DashboardController();
