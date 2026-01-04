import { Router } from 'express';
import * as pengaduanController from '../controllers/pengaduan.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pengaduan
 *   description: Endpoints untuk pengaduan pelanggan
 */

// Public route - untuk customer buat pengaduan
router.post('/', pengaduanController.createPengaduan);

// Protected routes - untuk admin
router.get('/', authMiddleware, pengaduanController.getAllPengaduan);
router.get('/:id', authMiddleware, pengaduanController.getPengaduanById);
router.patch('/:id/status', authMiddleware, pengaduanController.updateStatusPengaduan);
router.delete('/:id', authMiddleware, pengaduanController.deletePengaduan);

export default router;
