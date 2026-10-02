import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './emailService';
export class AuthService {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Este e-mail já está cadastrado', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new AppError('Senha atual incorreta', 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    return user;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  async forgotPassword(email: string, frontendUrl: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Não queremos vazar se o e-mail existe ou não, então sempre retornamos sucesso
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora de validade

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken, frontendUrl);
      await prisma.emailLog.create({
        data: {
          email: user.email,
          type: 'PASSWORD_RESET',
          status: 'SUCCESS',
        }
      });
    } catch (error: any) {
      await prisma.emailLog.create({
        data: {
          email: user.email,
          type: 'PASSWORD_RESET',
          status: 'FAILED',
          errorMsg: error.message || 'Erro desconhecido',
        }
      });
      // Opcional: Relançar o erro se quiser que a requisição de API falhe
      throw new AppError('Falha ao enviar e-mail de recuperação', 500);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Token inválido ou expirado', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}

export const authService = new AuthService();
