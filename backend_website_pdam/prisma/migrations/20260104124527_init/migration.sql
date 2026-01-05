-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendaftaran_sambungan" (
    "id" SERIAL NOT NULL,
    "namaCalon" TEXT NOT NULL,
    "hpCalon" TEXT NOT NULL,
    "emailCalon" TEXT NOT NULL,
    "kotaCalon" TEXT NOT NULL,
    "kecamatanCalon" TEXT NOT NULL,
    "kelurahanCalon" TEXT NOT NULL,
    "jalanCalon" TEXT NOT NULL,
    "noRumahCalon" TEXT NOT NULL,
    "rtCalon" TEXT NOT NULL,
    "rwCalon" TEXT NOT NULL,
    "namaPJ" TEXT NOT NULL,
    "hpPJ" TEXT NOT NULL,
    "emailPJ" TEXT NOT NULL,
    "kotaPJ" TEXT NOT NULL,
    "kecamatanPJ" TEXT NOT NULL,
    "kelurahanPJ" TEXT NOT NULL,
    "jalanPJ" TEXT NOT NULL,
    "noRumahPJ" TEXT NOT NULL,
    "rtPJ" TEXT NOT NULL,
    "rwPJ" TEXT NOT NULL,
    "kebutuhanAir" TEXT NOT NULL,
    "ketersediaanTangki" TEXT NOT NULL,
    "kategoriBangunan" TEXT NOT NULL,
    "peruntukanBangunan" TEXT NOT NULL,
    "lokasiLat" DOUBLE PRECISION NOT NULL,
    "lokasiLng" DOUBLE PRECISION NOT NULL,
    "ktpCalon" TEXT,
    "kartuKeluarga" TEXT,
    "pbb" TEXT,
    "fotoBangunan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pendaftaran_sambungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaduan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorPelanggan" TEXT NOT NULL,
    "noHandphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Belum Ditindak',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulasi_tagihan" (
    "id" SERIAL NOT NULL,
    "nomorPelanggan" TEXT NOT NULL,
    "namaPelanggan" TEXT,
    "kategori" TEXT NOT NULL,
    "pemakaian" INTEGER NOT NULL,
    "tarifPerM3" INTEGER NOT NULL,
    "biayaAdmin" INTEGER NOT NULL,
    "totalTagihan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulasi_tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cek_tagihan" (
    "id" SERIAL NOT NULL,
    "nomorPelanggan" TEXT NOT NULL,
    "namaPelanggan" TEXT,
    "bulan" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "pemakaian" INTEGER NOT NULL,
    "totalTagihan" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cek_tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
