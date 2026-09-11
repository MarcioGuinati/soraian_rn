import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomHour(date: Date, minHour: number, maxHour: number): Date {
  const d = new Date(date);
  d.setHours(minHour + Math.floor(Math.random() * (maxHour - minHour)));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.note.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.vaccine.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medicationRecord.deleteMany();
  await prisma.weightRecord.deleteMany();
  await prisma.temperatureRecord.deleteMany();
  await prisma.bathRecord.deleteMany();
  await prisma.sleepRecord.deleteMany();
  await prisma.diaperRecord.deleteMany();
  await prisma.foodRecord.deleteMany();
  await prisma.feedingRecord.deleteMany();
  await prisma.child.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const passwordHash = await bcrypt.hash('123456', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      email: 'teste@soraia.com',
      passwordHash,
      phone: '(11) 99999-9999',
    },
  });
  console.log(`✅ User created: ${user.email}`);

  // Create child
  const child = await prisma.child.create({
    data: {
      userId: user.id,
      name: 'Sofia',
      birthDate: new Date('2026-06-15'),
      gender: 'feminino',
      birthWeight: 3.250,
      birthHeight: 49,
      bloodType: 'O+',
      parentNames: 'Maria Silva e João Silva',
      notes: 'Nasceu de parto normal, saudável.',
    },
  });
  console.log(`✅ Child created: ${child.name}`);

  // Seed feeding records (7 days, ~7 feedings/day)
  const today = new Date();
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);

    const feedingTimes = [6, 9, 12, 15, 18, 21, 0];
    for (const hour of feedingTimes) {
      const recordedAt = new Date(date);
      recordedAt.setHours(hour, Math.floor(Math.random() * 30), 0);

      const types = ['peito', 'formula', 'peito', 'peito', 'formula'];
      const type = types[Math.floor(Math.random() * types.length)];

      await prisma.feedingRecord.create({
        data: {
          childId: child.id,
          type,
          amountMl: type === 'formula' ? 80 + Math.floor(Math.random() * 60) : null,
          breastSide: type === 'peito' ? ['esquerdo', 'direito', 'ambos'][Math.floor(Math.random() * 3)] : null,
          durationMinutes: type === 'peito' ? 10 + Math.floor(Math.random() * 20) : null,
          recordedAt,
        },
      });
    }
  }
  console.log('✅ Feeding records created');

  // Seed diaper records
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);

    // 5-8 pees per day
    const peeCount = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < peeCount; i++) {
      await prisma.diaperRecord.create({
        data: {
          childId: child.id,
          type: 'xixi',
          recordedAt: randomHour(date, 6, 23),
        },
      });
    }

    // 2-4 poops per day
    const poopCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < poopCount; i++) {
      await prisma.diaperRecord.create({
        data: {
          childId: child.id,
          type: 'coco',
          consistency: ['mole', 'pastoso', 'líquido'][Math.floor(Math.random() * 3)],
          color: ['amarelo', 'mostarda', 'verde'][Math.floor(Math.random() * 3)],
          recordedAt: randomHour(date, 7, 20),
        },
      });
    }
  }
  console.log('✅ Diaper records created');

  // Seed sleep records
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);

    // Night sleep
    const nightStart = new Date(date);
    nightStart.setHours(20, Math.floor(Math.random() * 30), 0);
    const nightDuration = 300 + Math.floor(Math.random() * 120); // 5-7 hours
    const nightEnd = new Date(nightStart.getTime() + nightDuration * 60000);

    await prisma.sleepRecord.create({
      data: {
        childId: child.id,
        startedAt: nightStart,
        endedAt: nightEnd,
        durationMinutes: nightDuration,
        location: 'berço',
      },
    });

    // 2-3 naps
    const napTimes = [
      { start: 9, duration: 40 + Math.floor(Math.random() * 50) },
      { start: 13, duration: 60 + Math.floor(Math.random() * 60) },
      { start: 16, duration: 30 + Math.floor(Math.random() * 30) },
    ];

    for (const nap of napTimes) {
      const napStart = new Date(date);
      napStart.setHours(nap.start, Math.floor(Math.random() * 30), 0);
      const napEnd = new Date(napStart.getTime() + nap.duration * 60000);

      await prisma.sleepRecord.create({
        data: {
          childId: child.id,
          startedAt: napStart,
          endedAt: napEnd,
          durationMinutes: nap.duration,
          location: ['berço', 'colo', 'carrinho'][Math.floor(Math.random() * 3)],
        },
      });
    }
  }
  console.log('✅ Sleep records created');

  // Seed bath records
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const bathTime = new Date(date);
    bathTime.setHours(18, Math.floor(Math.random() * 30), 0);

    await prisma.bathRecord.create({
      data: {
        childId: child.id,
        startedAt: bathTime,
        durationMinutes: 10 + Math.floor(Math.random() * 10),
        waterTemperature: 36 + Math.random() * 2,
      },
    });
  }
  console.log('✅ Bath records created');

  // Seed temperature records
  const tempDates = [0, 1, 3, 5, 6];
  for (const day of tempDates) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);

    await prisma.temperatureRecord.create({
      data: {
        childId: child.id,
        temperature: 36 + Math.random() * 1.5,
        measurementMethod: 'axilar',
        recordedAt: randomHour(date, 8, 20),
      },
    });
  }
  console.log('✅ Temperature records created');

  // Seed weight records
  const weights = [
    { daysAgo: 0, weight: 4.8, height: 55 },
    { daysAgo: 7, weight: 4.6, height: 54 },
    { daysAgo: 14, weight: 4.3, height: 53 },
    { daysAgo: 30, weight: 3.9, height: 51 },
    { daysAgo: 60, weight: 3.4, height: 50 },
  ];
  for (const w of weights) {
    const date = new Date(today);
    date.setDate(date.getDate() - w.daysAgo);
    await prisma.weightRecord.create({
      data: {
        childId: child.id,
        weight: w.weight,
        height: w.height,
        headCircumference: 34 + w.daysAgo * 0.05,
        recordedAt: date,
      },
    });
  }
  console.log('✅ Weight records created');

  // Seed medication records
  await prisma.medicationRecord.create({
    data: {
      childId: child.id,
      medicationName: 'Vitamina D',
      dosage: '2',
      unit: 'gotas',
      recordedAt: new Date(),
      reason: 'Suplementação diária',
    },
  });
  await prisma.medicationRecord.create({
    data: {
      childId: child.id,
      medicationName: 'Paracetamol',
      dosage: '0.5',
      unit: 'ml',
      recordedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      reason: 'Febre após vacina',
      notes: 'Prescrito pela Dra. Ana',
    },
  });
  console.log('✅ Medication records created');

  // Seed reminders
  const reminderData = [
    { title: 'Vitamina D', description: 'Dar 2 gotas pela manhã', hours: 8, recurrence: 'daily' },
    { title: 'Consulta pediatra', description: 'Consulta de rotina - 3 meses', hours: 48, recurrence: 'none' },
    { title: 'Vacina 3 meses', description: 'Pentavalente + VIP + Rotavírus', hours: 72, recurrence: 'none' },
    { title: 'Banho', description: 'Horário do banho', hours: 10, recurrence: 'daily' },
    { title: 'Mamar', description: 'Próxima mamada', hours: 3, recurrence: 'none' },
  ];
  for (const r of reminderData) {
    const dateTime = new Date(today.getTime() + r.hours * 60 * 60 * 1000);
    await prisma.reminder.create({
      data: {
        childId: child.id,
        title: r.title,
        description: r.description,
        dateTime,
        recurrence: r.recurrence,
        enabled: true,
      },
    });
  }
  console.log('✅ Reminders created');

  // Seed appointments
  await prisma.appointment.create({
    data: {
      childId: child.id,
      professional: 'Dra. Ana Souza',
      specialty: 'Pediatria',
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      time: '14:00',
      location: 'Clínica Infantil Centro',
      reason: 'Consulta de rotina - 3 meses',
    },
  });
  await prisma.appointment.create({
    data: {
      childId: child.id,
      professional: 'Dra. Ana Souza',
      specialty: 'Pediatria',
      date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      time: '10:00',
      location: 'Clínica Infantil Centro',
      reason: 'Consulta de rotina - 2 meses',
      notes: 'Tudo normal. Ganhou peso adequado.',
    },
  });
  console.log('✅ Appointments created');

  // Seed vaccines
  await prisma.vaccine.create({
    data: {
      childId: child.id,
      name: 'BCG',
      dose: 'Dose única',
      date: new Date('2026-06-16'),
      location: 'Maternidade',
      notes: 'Aplicada no braço direito',
    },
  });
  await prisma.vaccine.create({
    data: {
      childId: child.id,
      name: 'Hepatite B',
      dose: '1ª dose',
      date: new Date('2026-06-16'),
      location: 'Maternidade',
    },
  });
  await prisma.vaccine.create({
    data: {
      childId: child.id,
      name: 'Pentavalente',
      dose: '1ª dose',
      date: new Date('2026-08-15'),
      location: 'UBS Centro',
    },
  });
  console.log('✅ Vaccines created');

  console.log('\n🎉 Seed completed!');
  console.log('📧 Login: teste@soraia.com');
  console.log('🔑 Password: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
