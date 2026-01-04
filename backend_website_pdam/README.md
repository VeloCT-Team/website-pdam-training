# Backend Website PDAM

Backend API untuk Website PDAM menggunakan Express.js, PostgreSQL, dan Prisma ORM.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Database
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **Swagger** - API Documentation
- **Multer** - File upload handling

## Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- Node.js (v18 atau lebih baru)
- PostgreSQL (v14 atau lebih baru)
- npm atau yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat database PostgreSQL baru:

```sql
CREATE DATABASE pdam_db;
```

### 3. Configure Environment Variables

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pdam_db?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

**Penting**: Ganti `username` dan `password` dengan credentials PostgreSQL Anda.

### 4. Run Prisma Migrations

Generate Prisma Client dan apply migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed Database (Optional)

Jalankan seed untuk membuat admin default dan sample data:

```bash
npm run prisma:seed
```

**Default Admin Credentials**:
- Username: `admin`
- Password: `admin123`

## Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` dengan hot-reload menggunakan nodemon.

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

Setelah server berjalan, akses dokumentasi Swagger di:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin baru
- `POST /api/auth/login` - Login admin

### Pendaftaran Sambungan
- `POST /api/pendaftaran` - Daftar sambungan baru (public)
- `GET /api/pendaftaran` - Get semua pendaftaran (admin only)
- `GET /api/pendaftaran/:id` - Get detail pendaftaran (admin only)
- `PATCH /api/pendaftaran/:id/status` - Update status (admin only)
- `DELETE /api/pendaftaran/:id` - Delete pendaftaran (admin only)

### Pengaduan
- `POST /api/pengaduan` - Buat pengaduan baru (public)
- `GET /api/pengaduan` - Get semua pengaduan (admin only)
- `GET /api/pengaduan?status=Belum Ditindak` - Filter by status (admin only)
- `GET /api/pengaduan/:id` - Get detail pengaduan (admin only)
- `PATCH /api/pengaduan/:id/status` - Update status (admin only)
- `DELETE /api/pengaduan/:id` - Delete pengaduan (admin only)

## Database Schema

### Admin
- id, username, password, email, nama, timestamps

### PendaftaranSambungan
- Data Calon Pelanggan (nama, hp, email, alamat lengkap)
- Data Penanggung Jawab (nama, hp, email, alamat lengkap)
- Informasi Tambahan (kebutuhan air, kategori bangunan, koordinat)
- Dokumen (KTP, KK, PBB, Foto Bangunan)
- Status (Pending, Diproses, Ditolak)

### Pengaduan
- Data Pelapor (nama, nomor pelanggan, hp, email)
- Detail Pengaduan (kategori, deskripsi, lokasi)
- Status (Belum Ditindak, Sedang Diproses, Selesai)

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## File Upload

File yang diupload akan disimpan di folder `uploads/`. Pastikan folder ini memiliki permission yang sesuai.

**Supported file types**:
- Images: JPEG, JPG, PNG
- Documents: PDF

**Max file size**: 5MB (configurable di `.env`)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| JWT_SECRET | Secret key for JWT | - |
| UPLOAD_DIR | Upload directory | uploads |
| MAX_FILE_SIZE | Max upload size in bytes | 5242880 (5MB) |

## Project Structure

```
backend_website_pdam/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── config/
│   │   ├── database.ts    # Prisma client
│   │   └── swagger.ts     # Swagger config
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # API routes
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── index.ts           # App entry point
├── uploads/               # Uploaded files
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Database Connection Error

Pastikan:
1. PostgreSQL service sudah running
2. Database `pdam_db` sudah dibuat
3. Username dan password di `.env` benar
4. Port PostgreSQL (default: 5432) tidak terblokir

### Prisma Migration Error

Jika ada error saat migration, coba:

```bash
# Reset database (WARNING: akan menghapus semua data)
npx prisma migrate reset

# Atau buat migration baru
npx prisma migrate dev --name init
```

### Port Already in Use

Jika port 5000 sudah digunakan, ubah di file `.env`:

```env
PORT=3001
```

## Development Notes

- Server menggunakan hot-reload (nodemon) di development mode
- Semua endpoint admin memerlukan JWT token di header: `Authorization: Bearer <token>`
- CORS sudah enabled untuk semua origins (sesuaikan di production)
- File uploads di-serve sebagai static files di `/uploads`

## Security

**IMPORTANT for Production**:
1. Ganti `JWT_SECRET` dengan random string yang aman
2. Set `NODE_ENV=production`
3. Configure CORS untuk allow specific origins saja
4. Gunakan HTTPS
5. Implement rate limiting
6. Validate dan sanitize semua input
7. Gunakan helmet.js untuk security headers

## License

ISC
