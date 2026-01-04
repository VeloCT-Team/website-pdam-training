import multer from 'multer';
import path from 'path';

// File filter - hanya allow image dan PDF
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, JPG, PNG) dan PDF yang diperbolehkan'));
  }
};

// Upload ke memory (buffer), bukan disk
export const upload = multer({
  storage: multer.memoryStorage(), // Simpan di memory dulu
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: fileFilter,
});