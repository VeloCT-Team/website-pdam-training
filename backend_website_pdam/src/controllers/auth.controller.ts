import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Username atau password salah
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      res.status(400).json({ message: 'Username dan password harus diisi' });
      return;
    }

    // Cari admin berdasarkan username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      res.status(401).json({ message: 'Username atau password salah' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Username atau password salah' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        nama: admin.nama,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register admin baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - nama
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               nama:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin berhasil didaftarkan
 *       400:
 *         description: Username atau email sudah terdaftar
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email, nama } = req.body;

    // Validasi input
    if (!username || !password || !email || !nama) {
      res.status(400).json({ message: 'Semua field harus diisi' });
      return;
    }

    // Cek apakah username sudah ada
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingAdmin) {
      res.status(400).json({ message: 'Username atau email sudah terdaftar' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat admin baru
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email,
        nama,
      },
    });

    res.status(201).json({
      message: 'Admin berhasil didaftarkan',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        nama: newAdmin.nama,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
