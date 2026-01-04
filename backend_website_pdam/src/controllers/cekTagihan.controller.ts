import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * @swagger
 * /api/cek-tagihan/{nomorPelanggan}:
 *   get:
 *     summary: Cek tagihan berdasarkan nomor pelanggan
 *     tags: [Cek Tagihan]
 *     parameters:
 *       - in: path
 *         name: nomorPelanggan
 *         required: true
 *         schema:
 *           type: string
 *         description: Nomor pelanggan (9 digit)
 *     responses:
 *       200:
 *         description: Data tagihan ditemukan
 *       404:
 *         description: Tagihan tidak ditemukan
 *       500:
 *         description: Server error
 */
export const getCekTagihan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorPelanggan } = req.params;

    // Cari semua tagihan untuk nomor pelanggan ini, urutkan dari yang terbaru
    const tagihan = await prisma.cekTagihan.findMany({
      where: { nomorPelanggan },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (tagihan.length === 0) {
      res.status(404).json({
        message: 'Tagihan tidak ditemukan untuk nomor pelanggan ini',
      });
      return;
    }

    res.json({
      message: 'Data tagihan berhasil ditemukan',
      data: tagihan,
    });
  } catch (error) {
    console.error('Error fetching cek tagihan:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan server',
    });
  }
};

/**
 * @swagger
 * /api/cek-tagihan/{nomorPelanggan}/latest:
 *   get:
 *     summary: Cek tagihan terbaru berdasarkan nomor pelanggan
 *     tags: [Cek Tagihan]
 *     parameters:
 *       - in: path
 *         name: nomorPelanggan
 *         required: true
 *         schema:
 *           type: string
 *         description: Nomor pelanggan (9 digit)
 *     responses:
 *       200:
 *         description: Data tagihan terbaru ditemukan
 *       404:
 *         description: Tagihan tidak ditemukan
 *       500:
 *         description: Server error
 */
export const getLatestTagihan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomorPelanggan } = req.params;

    // Cari tagihan terbaru untuk nomor pelanggan ini
    const tagihan = await prisma.cekTagihan.findFirst({
      where: { nomorPelanggan },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!tagihan) {
      res.status(404).json({
        message: 'Tagihan tidak ditemukan untuk nomor pelanggan ini',
      });
      return;
    }

    res.json({
      message: 'Data tagihan berhasil ditemukan',
      data: tagihan,
    });
  } catch (error) {
    console.error('Error fetching latest tagihan:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan server',
    });
  }
};

/**
 * @swagger
 * /api/cek-tagihan:
 *   get:
 *     summary: Get all tagihan (for admin)
 *     tags: [Cek Tagihan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tagihan
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getAllTagihan = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tagihan = await prisma.cekTagihan.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      message: 'Data tagihan berhasil dimuat',
      data: tagihan,
    });
  } catch (error) {
    console.error('Error fetching all tagihan:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan server',
    });
  }
};
