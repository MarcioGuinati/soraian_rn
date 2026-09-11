import cron from 'node-cron';
import prisma from '../config/prisma';
import { sendPushToUser } from './pushService';

export const startCronJobs = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Find all enabled reminders that are due
      const dueReminders = await prisma.reminder.findMany({
        where: {
          enabled: true,
          dateTime: {
            lte: now,
          },
        },
        include: {
          child: {
            include: {
              sharedAccess: true, // Need this to notify the support network
            },
          },
        },
      });

      for (const reminder of dueReminders) {
        // Collect all user IDs who should receive the notification
        const userIdsToNotify = new Set([reminder.child.userId]);
        
        for (const access of reminder.child.sharedAccess) {
          userIdsToNotify.add(access.userId);
        }

        const payload = {
          title: `Lembrete: ${reminder.child.name}`,
          body: reminder.title + (reminder.description ? `\n${reminder.description}` : ''),
          url: '/', // or a specific URL
        };

        // Send push notification to all users
        for (const userId of userIdsToNotify) {
          await sendPushToUser(userId, payload);
        }

        // Disable the reminder after sending, or handle recurrence
        if (reminder.recurrence && reminder.recurrence !== 'none') {
          // Logic to reschedule based on recurrence (daily, weekly, etc)
          // For simplicity in V1, we just disable it or add 1 day if daily
          let nextDate = new Date(reminder.dateTime);
          if (reminder.recurrence === 'daily') nextDate.setDate(nextDate.getDate() + 1);
          if (reminder.recurrence === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
          if (reminder.recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { dateTime: nextDate },
          });
        } else {
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { enabled: false },
          });
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });

  console.log('Cron jobs started.');
};
