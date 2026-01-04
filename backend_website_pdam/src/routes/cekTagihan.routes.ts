import express from 'express';
import { getCekTagihan, getLatestTagihan, getAllTagihan } from '../controllers/cekTagihan.controller';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/:nomorPelanggan', getCekTagihan);
router.get('/:nomorPelanggan/latest', getLatestTagihan);

// Admin routes (protected)
router.get('/', authMiddleware, getAllTagihan);

export default router;
