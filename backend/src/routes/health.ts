import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

// APPOINTMENTS
router.get('/children/:childId/appointments', (req, res, next) => healthController.getAppointments(req, res).catch(next));
router.post('/children/:childId/appointments', (req, res, next) => healthController.createAppointment(req, res).catch(next));
router.put('/appointments/:id', (req, res, next) => healthController.updateAppointment(req, res).catch(next));
router.delete('/appointments/:id', (req, res, next) => healthController.deleteAppointment(req, res).catch(next));

// VACCINES
router.get('/children/:childId/vaccines', (req, res, next) => healthController.getVaccines(req, res).catch(next));
router.post('/children/:childId/vaccines', (req, res, next) => healthController.createVaccine(req, res).catch(next));
router.put('/vaccines/:id', (req, res, next) => healthController.updateVaccine(req, res).catch(next));
router.delete('/vaccines/:id', (req, res, next) => healthController.deleteVaccine(req, res).catch(next));

// REMINDERS
router.get('/children/:childId/reminders', (req, res, next) => healthController.getReminders(req, res).catch(next));
router.post('/children/:childId/reminders', (req, res, next) => healthController.createReminder(req, res).catch(next));
router.put('/reminders/:id', (req, res, next) => healthController.updateReminder(req, res).catch(next));
router.patch('/reminders/:id/toggle', (req, res, next) => healthController.toggleReminder(req, res).catch(next));
router.delete('/reminders/:id', (req, res, next) => healthController.deleteReminder(req, res).catch(next));

export default router;
