import { Router } from 'express';
import { recordController } from '../controllers/recordController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

// FEEDING
router.get('/children/:childId/feedings', (req, res, next) => recordController.getFeedings(req, res).catch(next));
router.post('/children/:childId/feedings', (req, res, next) => recordController.createFeeding(req, res).catch(next));
router.put('/feedings/:id', (req, res, next) => recordController.updateFeeding(req, res).catch(next));
router.delete('/feedings/:id', (req, res, next) => recordController.deleteFeeding(req, res).catch(next));

// FOOD
router.get('/children/:childId/foods', (req, res, next) => recordController.getFoods(req, res).catch(next));
router.post('/children/:childId/foods', (req, res, next) => recordController.createFood(req, res).catch(next));
router.put('/foods/:id', (req, res, next) => recordController.updateFood(req, res).catch(next));
router.delete('/foods/:id', (req, res, next) => recordController.deleteFood(req, res).catch(next));

// DIAPER
router.get('/children/:childId/diapers', (req, res, next) => recordController.getDiapers(req, res).catch(next));
router.post('/children/:childId/diapers', (req, res, next) => recordController.createDiaper(req, res).catch(next));
router.put('/diapers/:id', (req, res, next) => recordController.updateDiaper(req, res).catch(next));
router.delete('/diapers/:id', (req, res, next) => recordController.deleteDiaper(req, res).catch(next));

// SLEEP
router.get('/children/:childId/sleep', (req, res, next) => recordController.getSleeps(req, res).catch(next));
router.post('/children/:childId/sleep', (req, res, next) => recordController.createSleep(req, res).catch(next));
router.post('/children/:childId/sleep/start', (req, res, next) => recordController.startSleep(req, res).catch(next));
router.post('/children/:childId/sleep/stop', (req, res, next) => recordController.stopSleep(req, res).catch(next));
router.put('/sleep/:id', (req, res, next) => recordController.updateSleep(req, res).catch(next));
router.delete('/sleep/:id', (req, res, next) => recordController.deleteSleep(req, res).catch(next));

// BATH
router.get('/children/:childId/baths', (req, res, next) => recordController.getBaths(req, res).catch(next));
router.post('/children/:childId/baths', (req, res, next) => recordController.createBath(req, res).catch(next));
router.put('/baths/:id', (req, res, next) => recordController.updateBath(req, res).catch(next));
router.delete('/baths/:id', (req, res, next) => recordController.deleteBath(req, res).catch(next));

// TEMPERATURE
router.get('/children/:childId/temperatures', (req, res, next) => recordController.getTemperatures(req, res).catch(next));
router.post('/children/:childId/temperatures', (req, res, next) => recordController.createTemperature(req, res).catch(next));
router.put('/temperatures/:id', (req, res, next) => recordController.updateTemperature(req, res).catch(next));
router.delete('/temperatures/:id', (req, res, next) => recordController.deleteTemperature(req, res).catch(next));

// WEIGHT
router.get('/children/:childId/weights', (req, res, next) => recordController.getWeights(req, res).catch(next));
router.post('/children/:childId/weights', (req, res, next) => recordController.createWeight(req, res).catch(next));
router.put('/weights/:id', (req, res, next) => recordController.updateWeight(req, res).catch(next));
router.delete('/weights/:id', (req, res, next) => recordController.deleteWeight(req, res).catch(next));

// MEDICATION
router.get('/children/:childId/medications', (req, res, next) => recordController.getMedications(req, res).catch(next));
router.post('/children/:childId/medications', (req, res, next) => recordController.createMedication(req, res).catch(next));
router.put('/medications/:id', (req, res, next) => recordController.updateMedication(req, res).catch(next));
router.delete('/medications/:id', (req, res, next) => recordController.deleteMedication(req, res).catch(next));

// NOTES
router.get('/children/:childId/notes', (req, res, next) => recordController.getNotes(req, res).catch(next));
router.post('/children/:childId/notes', (req, res, next) => recordController.createNote(req, res).catch(next));
router.put('/notes/:id', (req, res, next) => recordController.updateNote(req, res).catch(next));
router.delete('/notes/:id', (req, res, next) => recordController.deleteNote(req, res).catch(next));

export default router;
