import api from './api';

// Utility function to convert VAPID key to Uint8Array
const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported by the browser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied.');
  }

  const registration = await navigator.serviceWorker.ready;
  
  // Check if already subscribed
  let subscription = await registration.pushManager.getSubscription();
  
  if (!subscription) {
    // Get public key from backend
    const { data } = await api.get('/push/public-key');
    const applicationServerKey = urlB64ToUint8Array(data.publicKey);
    
    // Subscribe to PushManager
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }

  // Send subscription to backend
  await api.post('/push/subscribe', { subscription });
  
  return subscription;
};
