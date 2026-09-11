import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { getPublicKey, saveSubscription } from '../services/pushService';

export const getVapidPublicKey = (req: AuthRequest, res: Response) => {
  res.json({ publicKey: getPublicKey() });
};

export const subscribe = async (req: AuthRequest, res: Response) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Subscription data is required' });
    }

    await saveSubscription(req.user!.id, subscription);
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
