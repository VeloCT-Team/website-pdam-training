import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * @swagger
 * /api/pengaduan:
 *   post:
 *     summary: Buat pengaduan baru
 *     tags: [Pengaduan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - nomorPelanggan
 *               - noHandphone
 *               - email
 *               - kategori
 *               - deskripsi
 *               - lokasi
 *             properties:
 *               nama:
 *                 type: string
 *               nomorPelanggan:
 *                 type: string
 *               noHandphone:
 *                 type: string
 *               email:
 *                 type: string
 *               kategori:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               lokasi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pengaduan berhasil dibuat
 */
export const createPengaduan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, nomorPelanggan, noHandphone, email, kategori, deskripsi, lokasi } =
      req.body;

    // Validasi input
    if (!nama || !nomorPelanggan || !noHandphone || !email || !kategori || !deskripsi || !lokasi) {
      res.status(400).json({ message: 'Semua field harus diisi' });
      return;
    }

    const pengaduan = await prisma.pengaduan.create({
      data: {
        nama,
        nomorPelanggan,
        noHandphone,
        email,
        kategori,
        deskripsi,
        lokasi,
      },
    });

    res.status(201).json({
      message: 'Pengaduan berhasil dibuat',
      data: pengaduan,
    });
  } catch (error) {
    console.error('Create pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pengaduan:
 *   get:
 *     summary: Get semua pengaduan (Admin only)
 *     tags: [Pengaduan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Belum Ditindak, Sedang Diproses, Selesai]
 *     responses:
 *       200:
 *         description: List pengaduan
 */
export const getAllPengaduan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const where = status ? { status: status as string } : {};

    const pengaduan = await prisma.pengaduan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      message: 'Data pengaduan berhasil diambil',
      data: pengaduan,
    });
  } catch (error) {
    console.error('Get pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pengaduan/{id}:
 *   get:
 *     summary: Get detail pengaduan by ID
 *     tags: [Pengaduan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail pengaduan
 */
export const getPengaduanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pengaduan) {
      res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
      return;
    }

    res.json({
      message: 'Detail pengaduan berhasil diambil',
      data: pengaduan,
    });
  } catch (error) {
    console.error('Get pengaduan by ID error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pengaduan/{id}/status:
 *   patch:
 *     summary: Update status pengaduan
 *     tags: [Pengaduan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Belum Ditindak, Sedang Diproses, Selesai]
 *     responses:
 *       200:
 *         description: Status berhasil diupdate
 */
export const updateStatusPengaduan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Belum Ditindak', 'Sedang Diproses', 'Selesai'].includes(status)) {
      res.status(400).json({ message: 'Status tidak valid' });
      return;
    }

    const pengaduan = await prisma.pengaduan.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      message: 'Status pengaduan berhasil diupdate',
      data: pengaduan,
    });
  } catch (error) {
    console.error('Update status pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pengaduan/{id}:
 *   delete:
 *     summary: Delete pengaduan
 *     tags: [Pengaduan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pengaduan berhasil dihapus
 */
export const deletePengaduan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.pengaduan.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: 'Pengaduan berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
