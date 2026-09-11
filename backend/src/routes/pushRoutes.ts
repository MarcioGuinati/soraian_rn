import { Router } from 'express';
import { getVapidPublicKey, subscribe } from '../controllers/pushController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/public-key', authMiddleware, getVapidPublicKey);
router.post('/subscribe', authMiddleware, subscribe);

export default router;
