import { Router } from 'express';
import * as pendaftaranController from '../controllers/pendaftaran.controller';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pendaftaran Sambungan
 *   description: Endpoints untuk pendaftaran sambungan baru
 */

// Public route - untuk customer daftar sambungan
router.post(
  '/',
  upload.fields([
    { name: 'ktpCalon', maxCount: 1 },
    { name: 'kartuKeluarga', maxCount: 1 },
    { name: 'pbb', maxCount: 1 },
    { name: 'fotoBangunan', maxCount: 1 },
  ]),
  pendaftaranController.createPendaftaran
);

// Protected routes - untuk admin
router.get('/', authMiddleware, pendaftaranController.getAllPendaftaran);
router.get('/:id', authMiddleware, pendaftaranController.getPendaftaranById);
router.patch('/:id/status', authMiddleware, pendaftaranController.updateStatus);
router.delete('/:id', authMiddleware, pendaftaranController.deletePendaftaran);

export default router;
