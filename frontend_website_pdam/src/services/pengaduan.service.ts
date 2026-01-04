import api from '../config/api';

export interface PengaduanData {
  id: number;
  nama: string;
  nomorPelanggan: string;
  noHandphone: string;
  email: string;
  kategori: string;
  deskripsi: string;
  lokasi: string;
  status: 'Belum Ditindak' | 'Sedang Diproses' | 'Selesai';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePengaduanRequest {
  nama: string;
  nomorPelanggan: string;
  noHandphone: string;
  email: string;
  kategori: string;
  deskripsi: string;
  lokasi: string;
}

export const pengaduanService = {
  // Create pengaduan (public)
  create: async (data: CreatePengaduanRequest) => {
    const response = await api.post('/pengaduan', data);
    return response.data;
  },

  // Get all pengaduan (admin only)
  getAll: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<{ message: string; data: PengaduanData[] }>(
      '/pengaduan',
      { params }
    );
    return response.data;
  },

  // Get pengaduan by ID (admin only)
  getById: async (id: number) => {
    const response = await api.get<{ message: string; data: PengaduanData }>(
      `/pengaduan/${id}`
    );
    return response.data;
  },

  // Update status pengaduan (admin only)
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/pengaduan/${id}/status`, { status });
    return response.data;
  },

  // Delete pengaduan (admin only)
  delete: async (id: number) => {
    const response = await api.delete(`/pengaduan/${id}`);
    return response.data;
  },
};
