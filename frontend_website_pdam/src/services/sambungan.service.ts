import api from './api';

// Interface untuk type safety
export interface DaftarSambunganData {
  nama: string;
  alamat: string;
  noTelepon: string;
  email: string;
  jenisKelamin: string;
  // Tambahkan field lain sesuai kebutuhan
}

export interface TagihanData {
  nomorPelanggan: string;
}

export interface PengaduanData {
  nama: string;
  email: string;
  noTelepon: string;
  jenisAduan: string;
  keterangan: string;
}

// Service untuk Daftar Sambungan
export const sambunganService = {
  daftarBaru: async (data: DaftarSambunganData) => {
    const response = await api.post('/sambungan/daftar', data);
    return response.data;
  },

  cekStatus: async (nomorRegistrasi: string) => {
    const response = await api.get(`/sambungan/status/${nomorRegistrasi}`);
    return response.data;
  },
};

// Service untuk Tagihan
export const tagihanService = {
  cekTagihan: async (nomorPelanggan: string) => {
    const response = await api.get(`/tagihan/${nomorPelanggan}`);
    return response.data;
  },

  simulasiTagihan: async (penggunaan: number, kategori: string) => {
    const response = await api.post('/tagihan/simulasi', { penggunaan, kategori });
    return response.data;
  },
};

// Service untuk Pengaduan
export const pengaduanService = {
  kirimPengaduan: async (data: PengaduanData) => {
    const response = await api.post('/pengaduan', data);
    return response.data;
  },

  getRiwayatPengaduan: async (email: string) => {
    const response = await api.get(`/pengaduan/riwayat/${email}`);
    return response.data;
  },
};
