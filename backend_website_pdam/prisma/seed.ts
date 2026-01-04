import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// Create a PostgreSQL connection pool with explicit config
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pdam_db',
  user: 'postgres',
  password: 'Cecem1706',
});

// Create adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@pdam.go.id',
      nama: 'Administrator',
    },
  });

  console.log('✅ Admin created:', { username: admin.username, email: admin.email });

  // Clear existing data (except admin)
  await prisma.pengaduan.deleteMany();
  await prisma.pendaftaranSambungan.deleteMany();
  await prisma.cekTagihan.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Create sample pengaduan data
  const pengaduanData = [
    {
      nama: 'Budi Santoso',
      nomorPelanggan: '123456789',
      noHandphone: '+62 812-3456-7890',
      email: 'budi@email.com',
      kategori: 'Air Tidak Mengalir',
      deskripsi: 'Air tidak mengalir sejak 2 hari yang lalu di rumah saya. Sudah dicek meteran masih jalan tapi air tidak keluar sama sekali.',
      lokasi: '-6.200000, 106.816666',
      status: 'Belum Ditindak',
    },
    {
      nama: 'Siti Aminah',
      nomorPelanggan: '987654321',
      noHandphone: '+62 813-9876-5432',
      email: 'siti@email.com',
      kategori: 'Kebocoran Pipa',
      deskripsi: 'Ada kebocoran pipa di depan rumah, air mengalir terus dan mengakibatkan jalan becek.',
      lokasi: '-6.175110, 106.865036',
      status: 'Sedang Diproses',
    },
    {
      nama: 'Ahmad Rizki',
      nomorPelanggan: '555444333',
      noHandphone: '+62 821-1111-2222',
      email: 'ahmad.rizki@email.com',
      kategori: 'Air Keruh/Berbau',
      deskripsi: 'Air yang keluar dari keran berwarna keruh kecoklatan dan berbau tidak sedap sejak pagi tadi.',
      lokasi: '-6.5971, 106.8060',
      status: 'Belum Ditindak',
    },
    {
      nama: 'Dewi Kusuma',
      nomorPelanggan: '111222333',
      noHandphone: '+62 822-3333-4444',
      email: 'dewi.kusuma@email.com',
      kategori: 'Meteran Rusak',
      deskripsi: 'Meteran air rusak, angka tidak bergerak padahal air mengalir normal.',
      lokasi: '-6.3456, 106.7890',
      status: 'Selesai',
    },
    {
      nama: 'Eko Prasetyo',
      nomorPelanggan: '444555666',
      noHandphone: '+62 823-5555-6666',
      email: 'eko.prasetyo@email.com',
      kategori: 'Tagihan Tidak Sesuai',
      deskripsi: 'Tagihan bulan ini naik 3x lipat dari biasanya, padahal pemakaian normal seperti biasa.',
      lokasi: '-6.2500, 106.8500',
      status: 'Sedang Diproses',
    },
    {
      nama: 'Fitri Handayani',
      nomorPelanggan: '777888999',
      noHandphone: '+62 824-7777-8888',
      email: 'fitri.h@email.com',
      kategori: 'Pelayanan Petugas',
      deskripsi: 'Petugas yang datang untuk perbaikan kurang ramah dan tidak memberikan solusi yang jelas.',
      lokasi: '-6.1800, 106.8200',
      status: 'Belum Ditindak',
    },
    {
      nama: 'Gunawan Setiawan',
      nomorPelanggan: '222333444',
      noHandphone: '+62 825-2222-3333',
      email: 'gunawan@email.com',
      kategori: 'Air Tidak Mengalir',
      deskripsi: 'Air mati total sejak kemarin sore, sudah lapor via telepon tapi belum ada tindakan.',
      lokasi: '-6.2100, 106.8100',
      status: 'Sedang Diproses',
    },
    {
      nama: 'Hendra Wijaya',
      nomorPelanggan: '888999000',
      noHandphone: '+62 826-8888-9999',
      email: 'hendra.w@email.com',
      kategori: 'Kebocoran Pipa',
      deskripsi: 'Pipa utama di jalan depan kompleks bocor besar, air terbuang banyak.',
      lokasi: '-6.2200, 106.8300',
      status: 'Selesai',
    },
  ];

  for (const data of pengaduanData) {
    await prisma.pengaduan.create({ data });
  }
  console.log(`✅ ${pengaduanData.length} sample pengaduan created`);

  // Create sample pendaftaran sambungan data
  const pendaftaranData = [
    {
      namaCalon: 'Bambang Suryanto',
      hpCalon: '+62 812-1234-5678',
      emailCalon: 'bambang.s@email.com',
      kotaCalon: 'Bandung',
      kecamatanCalon: 'Kecamatan A',
      kelurahanCalon: 'Kelurahan 1',
      jalanCalon: 'Jl. Merdeka',
      noRumahCalon: '45',
      rtCalon: '001',
      rwCalon: '005',
      namaPJ: 'Bambang Suryanto',
      hpPJ: '+62 812-1234-5678',
      emailPJ: 'bambang.s@email.com',
      kotaPJ: 'Bandung',
      kecamatanPJ: 'Kecamatan A',
      kelurahanPJ: 'Kelurahan 1',
      jalanPJ: 'Jl. Merdeka',
      noRumahPJ: '45',
      rtPJ: '001',
      rwPJ: '005',
      kebutuhanAir: '15 m³/bulan',
      ketersediaanTangki: 'Ada',
      kategoriBangunan: 'Rumah Tinggal',
      peruntukanBangunan: 'Tempat Tinggal',
      lokasiLat: -6.9175,
      lokasiLng: 107.6191,
      status: 'Pending',
    },
    {
      namaCalon: 'Citra Dewi Lestari',
      hpCalon: '+62 813-2345-6789',
      emailCalon: 'citra.dewi@email.com',
      kotaCalon: 'Bekasi',
      kecamatanCalon: 'Kecamatan B',
      kelurahanCalon: 'Kelurahan 2',
      jalanCalon: 'Jl. Sudirman',
      noRumahCalon: '123',
      rtCalon: '003',
      rwCalon: '008',
      namaPJ: 'Dedi Kurniawan',
      hpPJ: '+62 821-3333-4444',
      emailPJ: 'dedi.k@email.com',
      kotaPJ: 'Bekasi',
      kecamatanPJ: 'Kecamatan B',
      kelurahanPJ: 'Kelurahan 2',
      jalanPJ: 'Jl. Sudirman',
      noRumahPJ: '123',
      rtPJ: '003',
      rwPJ: '008',
      kebutuhanAir: '20 m³/bulan',
      ketersediaanTangki: 'Tidak Ada',
      kategoriBangunan: 'Ruko',
      peruntukanBangunan: 'Usaha',
      lokasiLat: -6.2383,
      lokasiLng: 106.9756,
      status: 'Pending',
    },
    {
      namaCalon: 'Eko Prasetyo',
      hpCalon: '+62 814-3456-7890',
      emailCalon: 'eko.p@email.com',
      kotaCalon: 'Bogor',
      kecamatanCalon: 'Kecamatan C',
      kelurahanCalon: 'Kelurahan 3',
      jalanCalon: 'Jl. Ahmad Yani',
      noRumahCalon: '78',
      rtCalon: '002',
      rwCalon: '004',
      namaPJ: 'Eko Prasetyo',
      hpPJ: '+62 814-3456-7890',
      emailPJ: 'eko.p@email.com',
      kotaPJ: 'Bogor',
      kecamatanPJ: 'Kecamatan C',
      kelurahanPJ: 'Kelurahan 3',
      jalanPJ: 'Jl. Ahmad Yani',
      noRumahPJ: '78',
      rtPJ: '002',
      rwPJ: '004',
      kebutuhanAir: '25 m³/bulan',
      ketersediaanTangki: 'Ada',
      kategoriBangunan: 'Apartemen',
      peruntukanBangunan: 'Tempat Tinggal',
      lokasiLat: -6.5971,
      lokasiLng: 106.8060,
      status: 'Pending',
    },
    {
      namaCalon: 'Fahmi Rahman',
      hpCalon: '+62 815-4567-8901',
      emailCalon: 'fahmi.r@email.com',
      kotaCalon: 'Depok',
      kecamatanCalon: 'Kecamatan A',
      kelurahanCalon: 'Kelurahan 1',
      jalanCalon: 'Jl. Margonda Raya',
      noRumahCalon: '200',
      rtCalon: '005',
      rwCalon: '012',
      namaPJ: 'Fahmi Rahman',
      hpPJ: '+62 815-4567-8901',
      emailPJ: 'fahmi.r@email.com',
      kotaPJ: 'Depok',
      kecamatanPJ: 'Kecamatan A',
      kelurahanPJ: 'Kelurahan 1',
      jalanPJ: 'Jl. Margonda Raya',
      noRumahPJ: '200',
      rtPJ: '005',
      rwPJ: '012',
      kebutuhanAir: '18 m³/bulan',
      ketersediaanTangki: 'Ada',
      kategoriBangunan: 'Gedung',
      peruntukanBangunan: 'Kantor',
      lokasiLat: -6.3700,
      lokasiLng: 106.8300,
      status: 'Pending',
    },
    {
      namaCalon: 'Gita Puspita',
      hpCalon: '+62 816-5678-9012',
      emailCalon: 'gita.puspita@email.com',
      kotaCalon: 'Cirebon',
      kecamatanCalon: 'Kecamatan B',
      kelurahanCalon: 'Kelurahan 2',
      jalanCalon: 'Jl. Siliwangi',
      noRumahCalon: '55',
      rtCalon: '004',
      rwCalon: '006',
      namaPJ: 'Hendra Wijaya',
      hpPJ: '+62 822-9999-0000',
      emailPJ: 'hendra.w2@email.com',
      kotaPJ: 'Cirebon',
      kecamatanPJ: 'Kecamatan B',
      kelurahanPJ: 'Kelurahan 2',
      jalanPJ: 'Jl. Siliwangi',
      noRumahPJ: '55',
      rtPJ: '004',
      rwPJ: '006',
      kebutuhanAir: '12 m³/bulan',
      ketersediaanTangki: 'Tidak Ada',
      kategoriBangunan: 'Rumah Tinggal',
      peruntukanBangunan: 'Tempat Tinggal',
      lokasiLat: -6.7063,
      lokasiLng: 108.5571,
      status: 'Pending',
    },
  ];

  for (const data of pendaftaranData) {
    await prisma.pendaftaranSambungan.create({ data });
  }
  console.log(`✅ ${pendaftaranData.length} sample pendaftaran sambungan created`);

  // Create cek tagihan data based on existing pengaduan nomor pelanggan
  console.log('📋 Creating cek tagihan data based on existing customers...');

  // Get all unique nomor pelanggan from pengaduan
  const allPengaduan = await prisma.pengaduan.findMany({
    select: {
      nomorPelanggan: true,
      nama: true,
    },
  });

  // Generate tagihan for each customer (last 3 months)
  // Reverse order so Desember is created last (newest createdAt)
  const months = ['Oktober', 'November', 'Desember'];
  const tahun = 2025;

  for (const pengaduan of allPengaduan) {
    for (let i = 0; i < months.length; i++) {
      // Random pemakaian antara 8-30 m³
      const pemakaian = Math.floor(Math.random() * (30 - 8 + 1)) + 8;

      // Tarif sederhana: Rp 2,800 per m³
      const tarifPerM3 = 2800;
      const biayaPemakaian = pemakaian * tarifPerM3;

      // Biaya beban tetap (diameter 1/2 inch)
      const biayaBeban = 15000;

      // Biaya admin
      const biayaAdmin = 5000;

      // Total tagihan
      const totalTagihan = biayaPemakaian + biayaBeban + biayaAdmin;

      // Status: Desember (bulan terbaru) bisa Lunas atau Belum Lunas
      // Bulan sebelumnya sudah Lunas
      const status = i === 2
        ? (Math.random() > 0.5 ? 'Lunas' : 'Belum Lunas')
        : 'Lunas';

      await prisma.cekTagihan.create({
        data: {
          nomorPelanggan: pengaduan.nomorPelanggan,
          namaPelanggan: pengaduan.nama,
          bulan: months[i],
          tahun: tahun,
          pemakaian: pemakaian,
          totalTagihan: totalTagihan,
          status: status,
        },
      });
    }
  }

  const totalTagihan = allPengaduan.length * months.length;
  console.log(`✅ ${totalTagihan} sample cek tagihan created for ${allPengaduan.length} customers`);

  console.log('\n🎉 Seeding completed!');
  console.log('\nDefault Admin Credentials:');
  console.log('Username: admin');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
