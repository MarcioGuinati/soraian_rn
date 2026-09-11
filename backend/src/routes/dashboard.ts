import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/children/:childId/dashboard', (req, res, next) => {
  dashboardController.getDashboard(req, res).catch(next);
});

router.get('/children/:childId/timeline', (req, res, next) => {
  dashboardController.getTimeline(req, res).catch(next);
});

router.get('/children/:childId/calendar', (req, res, next) => {
  dashboardController.getCalendar(req, res).catch(next);
});

router.get('/children/:childId/reports', (req, res, next) => {
  dashboardController.getReports(req, res).catch(next);
});

export default router;
