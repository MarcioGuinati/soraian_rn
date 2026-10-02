import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

router.post('/register', validate(registerSchema), (req, res, next) => {
  authController.register(req, res).catch(next);
});

router.post('/login', validate(loginSchema), (req, res, next) => {
  authController.login(req, res).catch(next);
});

router.get('/me', authMiddleware, (req, res, next) => {
  authController.getProfile(req, res).catch(next);
});

router.put('/profile', authMiddleware, (req, res, next) => {
  authController.updateProfile(req, res).catch(next);
});

router.put('/change-password', authMiddleware, validate(changePasswordSchema), (req, res, next) => {
  authController.changePassword(req, res).catch(next);
});

router.post('/forgot-password', validate(forgotPasswordSchema), (req, res, next) => {
  authController.forgotPassword(req, res).catch(next);
});

router.post('/reset-password', validate(resetPasswordSchema), (req, res, next) => {
  authController.resetPassword(req, res).catch(next);
});

export default router;
