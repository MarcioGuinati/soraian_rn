import { Response } from 'express';
import { recordService } from '../services/recordService';

export class RecordController {
  // FEEDING
  async createFeeding(req: any, res: Response) {
    const record = await recordService.createFeeding(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getFeedings(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getFeedings(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateFeeding(req: any, res: Response) {
    const record = await recordService.updateFeeding(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteFeeding(req: any, res: Response) {
    await recordService.deleteFeeding(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // FOOD
  async createFood(req: any, res: Response) {
    const record = await recordService.createFood(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getFoods(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getFoods(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateFood(req: any, res: Response) {
    const record = await recordService.updateFood(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteFood(req: any, res: Response) {
    await recordService.deleteFood(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // DIAPER
  async createDiaper(req: any, res: Response) {
    const record = await recordService.createDiaper(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getDiapers(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getDiapers(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateDiaper(req: any, res: Response) {
    const record = await recordService.updateDiaper(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteDiaper(req: any, res: Response) {
    await recordService.deleteDiaper(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // SLEEP
  async createSleep(req: any, res: Response) {
    const record = await recordService.createSleep(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async startSleep(req: any, res: Response) {
    const record = await recordService.startSleep(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async stopSleep(req: any, res: Response) {
    const record = await recordService.stopSleep(req.params.childId, req.userId);
    res.json({ status: 'success', data: record });
  }
  async getSleeps(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getSleeps(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateSleep(req: any, res: Response) {
    const record = await recordService.updateSleep(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteSleep(req: any, res: Response) {
    await recordService.deleteSleep(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // BATH
  async createBath(req: any, res: Response) {
    const record = await recordService.createBath(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getBaths(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getBaths(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateBath(req: any, res: Response) {
    const record = await recordService.updateBath(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteBath(req: any, res: Response) {
    await recordService.deleteBath(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // TEMPERATURE
  async createTemperature(req: any, res: Response) {
    const record = await recordService.createTemperature(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getTemperatures(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getTemperatures(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateTemperature(req: any, res: Response) {
    const record = await recordService.updateTemperature(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteTemperature(req: any, res: Response) {
    await recordService.deleteTemperature(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // WEIGHT
  async createWeight(req: any, res: Response) {
    const record = await recordService.createWeight(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getWeights(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getWeights(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateWeight(req: any, res: Response) {
    const record = await recordService.updateWeight(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteWeight(req: any, res: Response) {
    await recordService.deleteWeight(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // MEDICATION
  async createMedication(req: any, res: Response) {
    const record = await recordService.createMedication(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getMedications(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getMedications(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateMedication(req: any, res: Response) {
    const record = await recordService.updateMedication(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteMedication(req: any, res: Response) {
    await recordService.deleteMedication(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }

  // NOTES
  async createNote(req: any, res: Response) {
    const record = await recordService.createNote(req.params.childId, req.userId, req.body);
    res.status(201).json({ status: 'success', data: record });
  }
  async getNotes(req: any, res: Response) {
    const { startDate, endDate } = req.query;
    const records = await recordService.getNotes(req.params.childId, req.userId, startDate, endDate);
    res.json({ status: 'success', data: records });
  }
  async updateNote(req: any, res: Response) {
    const record = await recordService.updateNote(req.params.id, req.userId, req.body);
    res.json({ status: 'success', data: record });
  }
  async deleteNote(req: any, res: Response) {
    await recordService.deleteNote(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Registro removido' });
  }
}

export const recordController = new RecordController();
