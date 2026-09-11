import webpush from 'web-push';
import prisma from '../config/database';

const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';

// Configure web-push only if keys are present
if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(
      'mailto:contato@soraiababy.com.br',
      publicKey,
      privateKey
    );
  } catch (error) {
    console.error('Failed to configure web-push:', error);
  }
} else {
  console.warn('VAPID keys not provided. Push notifications will be disabled.');
}

export const getPublicKey = () => publicKey;

export const saveSubscription = async (userId: string, subscription: any) => {
  return prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
};

export const sendPushToUser = async (userId: string, payload: any) => {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const notifications = subscriptions.map(async (sub: any) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (error: any) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        // Subscription has expired or is no longer valid
        console.log('Subscription expired. Deleting endpoint:', sub.endpoint);
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      } else {
        console.error('Error sending push notification:', error);
      }
    }
  });

  await Promise.all(notifications);
};
