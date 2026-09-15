import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('👑 Criando/atualizando admin...');

  const adminEmail = 'marcio123.ms465@gmail.com';
  const adminPassword = 'Sr@ia$2026!Adm';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin', passwordHash },
    });
    console.log(`✅ Admin atualizado: ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      },
    });
    console.log(`✅ Admin criado: ${adminEmail}`);
  }

  console.log(`🔑 Senha: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
