import { Request, Response } from 'express';
import { authService } from '../services/authService';

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: result });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ status: 'success', data: result });
  }

  async getProfile(req: any, res: Response) {
    const user = await authService.getProfile(req.userId);
    res.json({ status: 'success', data: user });
  }

  async changePassword(req: any, res: Response) {
    await authService.changePassword(req.userId, req.body.currentPassword, req.body.newPassword);
    res.json({ status: 'success', message: 'Senha alterada com sucesso' });
  }

  async updateProfile(req: any, res: Response) {
    const user = await authService.updateProfile(req.userId, req.body);
    res.json({ status: 'success', data: user });
  }
}

export const authController = new AuthController();
