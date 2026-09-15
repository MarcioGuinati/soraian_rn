import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/adminAuth';
import { adminController } from '../controllers/adminController';

const router = Router();

// All routes require auth + admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', (req, res, next) => {
  adminController.getStats(req, res).catch(next);
});

router.get('/users', (req, res, next) => {
  adminController.getUsers(req, res).catch(next);
});

router.get('/users/:id', (req, res, next) => {
  adminController.getUserDetails(req, res).catch(next);
});

router.delete('/users/:id', (req, res, next) => {
  adminController.deleteUser(req, res).catch(next);
});

export default router;
