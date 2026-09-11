import { Router } from 'express';
import { childController } from '../controllers/childController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  childController.list(req, res).catch(next);
});

router.post('/', upload.single('photo'), (req, res, next) => {
  childController.create(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  childController.getById(req, res).catch(next);
});

router.put('/:id', upload.single('photo'), (req, res, next) => {
  childController.update(req, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  childController.delete(req, res).catch(next);
});

router.post('/:id/share', (req, res, next) => {
  childController.share(req, res).catch(next);
});

router.delete('/:id/access/:accessId', (req, res, next) => {
  childController.revoke(req, res).catch(next);
});

export default router;
