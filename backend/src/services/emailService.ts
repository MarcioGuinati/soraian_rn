import nodemailer from 'nodemailer';
import path from 'path';

import { env } from '../config/env';

// Configuração do transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER || 'nunarotinabebe@gmail.com',
    pass: env.SMTP_PASS || 'sjgaeufydyjqwsuo',
  },
});

export const sendPasswordResetEmail = async (to: string, resetToken: string, frontendUrl: string) => {
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperação de Senha - NUNA</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0F1024;
          color: #ffffff;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: #0F1024;
        }
        .card {
          background-color: #151630;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .logo-container {
          margin-bottom: 30px;
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.2);
        }
        h1 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 16px;
          letter-spacing: -0.025em;
        }
        p {
          color: #A7A8C2;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .button {
          display: inline-block;
          background-color: #7C3AED;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 100px;
          transition: background-color 0.2s;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
        }
        .button:hover {
          background-color: #6D28D9;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #A7A8C2;
        }
        .footer p {
          font-size: 14px;
          margin-bottom: 8px;
        }
        .highlight {
          color: #8B5CF6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo-container">
            <img src="${frontendUrl}/logo.png" alt="NUNA Logo" class="logo" />
          </div>
          <h1>Recuperação de Senha</h1>
          <p>Você solicitou a recuperação de senha para sua conta <strong class="highlight">NUNA</strong>. Clique no botão abaixo para criar uma nova senha.</p>
          
          <a href="${resetLink}" class="button">Redefinir minha senha</a>
          
          <p style="margin-top: 32px; font-size: 14px; color: #A7A8C2;">
            Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha continuará a mesma. O link é válido por 1 hora.
          </p>
        </div>
        
        <div class="footer">
          <p>NUNA - Cuidados do Bebê</p>
          <p>Cuidar também é acompanhar.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: '"NUNA" <nunarotinabebe@gmail.com>',
    to,
    subject: 'Redefinição de Senha - NUNA',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de recuperação enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Falha ao enviar e-mail de recuperação');
  }
};
