import { Response } from 'express';
import { childService } from '../services/childService';

export class ChildController {
  async list(req: any, res: Response) {
    const children = await childService.list(req.userId);
    res.json({ status: 'success', data: children });
  }

  async getById(req: any, res: Response) {
    const child = await childService.getById(req.params.id, req.userId);
    res.json({ status: 'success', data: child });
  }

  async create(req: any, res: Response) {
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
    const child = await childService.create(req.userId, { ...req.body, photo });
    res.status(201).json({ status: 'success', data: child });
  }

  async update(req: any, res: Response) {
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = photo ? { ...req.body, photo } : req.body;
    const child = await childService.update(req.params.id, req.userId, data);
    res.json({ status: 'success', data: child });
  }

  async delete(req: any, res: Response) {
    await childService.delete(req.params.id, req.userId);
    res.json({ status: 'success', message: 'Criança removida com sucesso' });
  }
}

export const childController = new ChildController();
