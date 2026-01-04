import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';
import { Readable } from 'stream';
import prisma from '../config/database';

// Helper function untuk upload ke Cloudinary
const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'pdam-uploads',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          return reject(error);
        }
        console.log('✅ Uploaded:', result?.secure_url);
        resolve(result!.secure_url);
      }
    );

    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * @swagger
 * /api/pendaftaran:
 *   post:
 *     summary: Daftar sambungan baru
 *     tags: [Pendaftaran Sambungan]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               namaCalon:
 *                 type: string
 *               hpCalon:
 *                 type: string
 *               emailCalon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil
 */
export const createPendaftaran = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('📤 === START UPLOAD ===');
    console.log('📁 Files:', Object.keys(req.files || {}));

    const {
      // Data Calon Pelanggan
      namaCalon,
      hpCalon,
      emailCalon,
      kotaCalon,
      kecamatanCalon,
      kelurahanCalon,
      jalanCalon,
      noRumahCalon,
      rtCalon,
      rwCalon,
      // Data Penanggung Jawab
      namaPJ,
      hpPJ,
      emailPJ,
      kotaPJ,
      kecamatanPJ,
      kelurahanPJ,
      jalanPJ,
      noRumahPJ,
      rtPJ,
      rwPJ,
      // Informasi Tambahan
      kebutuhanAir,
      ketersediaanTangki,
      kategoriBangunan,
      peruntukanBangunan,
      lokasiLat,
      lokasiLng,
    } = req.body;

    // Get uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Upload files ke Cloudinary
    const uploadedFiles: any = {};

    // KTP Calon
    if (files?.ktpCalon && files.ktpCalon[0]) {
      console.log('⬆️  Uploading KTP...');
      uploadedFiles.ktpCalon = await uploadToCloudinary(files.ktpCalon[0]);
    }

    // Kartu Keluarga
    if (files?.kartuKeluarga && files.kartuKeluarga[0]) {
      console.log('⬆️  Uploading KK...');
      uploadedFiles.kartuKeluarga = await uploadToCloudinary(files.kartuKeluarga[0]);
    }

    // PBB
    if (files?.pbb && files.pbb[0]) {
      console.log('⬆️  Uploading PBB...');
      uploadedFiles.pbb = await uploadToCloudinary(files.pbb[0]);
    }

    // Foto Bangunan
    if (files?.fotoBangunan && files.fotoBangunan[0]) {
      console.log('⬆️  Uploading Foto Bangunan...');
      uploadedFiles.fotoBangunan = await uploadToCloudinary(files.fotoBangunan[0]);
    }

    console.log('✅ All uploaded:', uploadedFiles);

    // Simpan ke database dengan URL Cloudinary
    const pendaftaran = await prisma.pendaftaranSambungan.create({
      data: {
        namaCalon,
        hpCalon,
        emailCalon,
        kotaCalon,
        kecamatanCalon,
        kelurahanCalon,
        jalanCalon,
        noRumahCalon,
        rtCalon,
        rwCalon,
        namaPJ,
        hpPJ,
        emailPJ,
        kotaPJ,
        kecamatanPJ,
        kelurahanPJ,
        jalanPJ,
        noRumahPJ,
        rtPJ,
        rwPJ,
        kebutuhanAir,
        ketersediaanTangki,
        kategoriBangunan,
        peruntukanBangunan,
        lokasiLat: parseFloat(lokasiLat),
        lokasiLng: parseFloat(lokasiLng),
        // URL dari Cloudinary, bukan filename
        ktpCalon: uploadedFiles.ktpCalon || null,
        kartuKeluarga: uploadedFiles.kartuKeluarga || null,
        pbb: uploadedFiles.pbb || null,
        fotoBangunan: uploadedFiles.fotoBangunan || null,
      },
    });

    console.log('💾 Saved to DB:', pendaftaran.id);
    console.log('✅ === END UPLOAD ===');

    res.status(201).json({
      message: 'Pendaftaran sambungan berhasil',
      data: pendaftaran,
    });
  } catch (error) {
    console.error('❌ Create pendaftaran error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pendaftaran:
 *   get:
 *     summary: Get semua pendaftaran (Admin only)
 *     tags: [Pendaftaran Sambungan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List pendaftaran
 */
export const getAllPendaftaran = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const where = status ? { status: status as string } : {};

    const pendaftaran = await prisma.pendaftaranSambungan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      message: 'Data pendaftaran berhasil diambil',
      data: pendaftaran,
    });
  } catch (error) {
    console.error('Get pendaftaran error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pendaftaran/{id}:
 *   get:
 *     summary: Get detail pendaftaran by ID
 *     tags: [Pendaftaran Sambungan]
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
 *         description: Detail pendaftaran
 */
export const getPendaftaranById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pendaftaran = await prisma.pendaftaranSambungan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pendaftaran) {
      res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
      return;
    }

    console.log('📄 Pendaftaran:', {
      id: pendaftaran.id,
      ktpCalon: pendaftaran.ktpCalon ? '✅' : '❌',
      kartuKeluarga: pendaftaran.kartuKeluarga ? '✅' : '❌',
      pbb: pendaftaran.pbb ? '✅' : '❌',
      fotoBangunan: pendaftaran.fotoBangunan ? '✅' : '❌',
    });

    res.json({
      message: 'Detail pendaftaran berhasil diambil',
      data: pendaftaran,
    });
  } catch (error) {
    console.error('Get pendaftaran by ID error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pendaftaran/{id}/status:
 *   patch:
 *     summary: Update status pendaftaran
 *     tags: [Pendaftaran Sambungan]
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
 *                 enum: [Pending, Diproses, Ditolak]
 *     responses:
 *       200:
 *         description: Status berhasil diupdate
 */
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pendaftaran = await prisma.pendaftaranSambungan.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      message: 'Status pendaftaran berhasil diupdate',
      data: pendaftaran,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * @swagger
 * /api/pendaftaran/{id}:
 *   delete:
 *     summary: Delete pendaftaran
 *     tags: [Pendaftaran Sambungan]
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
 *         description: Pendaftaran berhasil dihapus
 */
export const deletePendaftaran = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.pendaftaranSambungan.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: 'Pendaftaran berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete pendaftaran error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};