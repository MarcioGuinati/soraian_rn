import { Router } from 'express';
import { getVapidPublicKey, subscribe } from '../controllers/pushController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/public-key', protect, getVapidPublicKey);
router.post('/subscribe', protect, subscribe);

export default router;
