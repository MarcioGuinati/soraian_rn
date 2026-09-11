import { Response } from 'express';
import { healthService } from '../services/healthService';

export class HealthController {
  // APPOINTMENTS
  async createAppointment(req: any, res: Response) {
    const record = await healthService.createAppointment(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getAppointments(req: any, res: Response) {
    const records = await healthService.getAppointments(req.params.childId, req.userId);
    res.json({ status: 'success', data: records });
  }
  async updateAppointment(req: any, res: Response) {
    const record = await healthService.updateAppointment(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteAppointment(req: any, res: Response) {
    await healthService.deleteAppointment(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Consulta removida' });
  }

  // VACCINES
  async createVaccine(req: any, res: Response) {
    const record = await healthService.createVaccine(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getVaccines(req: any, res: Response) {
    const records = await healthService.getVaccines(req.params.childId, req.userId);
    res.json({ status: 'success', data: records });
  }
  async updateVaccine(req: any, res: Response) {
    const record = await healthService.updateVaccine(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteVaccine(req: any, res: Response) {
    await healthService.deleteVaccine(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Vacina removida' });
  }

  // REMINDERS
  async createReminder(req: any, res: Response) {
    const record = await healthService.createReminder(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getReminders(req: any, res: Response) {
    const records = await healthService.getReminders(req.params.childId, req.userId);
    res.json({ status: 'success', data: records });
  }
  async updateReminder(req: any, res: Response) {
    const record = await healthService.updateReminder(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async toggleReminder(req: any, res: Response) {
    const record = await healthService.toggleReminder(req.params.id, req.userId);
    res.json({ status: 'success', data: record });
  }
  async deleteReminder(req: any, res: Response) {
    await healthService.deleteReminder(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Lembrete removido' });
  }
}

export const healthController = new HealthController();
