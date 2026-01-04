import api from '../config/api';

export interface CekTagihanData {
  id: number;
  nomorPelanggan: string;
  namaPelanggan: string | null;
  bulan: string;
  tahun: number;
  pemakaian: number;
  totalTagihan: number;
  status: string;
  createdAt: string;
}

export const cekTagihanService = {
  // Get all tagihan by customer number
  getByNomorPelanggan: async (nomorPelanggan: string) => {
    const response = await api.get<{ message: string; data: CekTagihanData[] }>(
      `/cek-tagihan/${nomorPelanggan}`
    );
    return response.data;
  },

  // Get latest tagihan by customer number
  getLatest: async (nomorPelanggan: string) => {
    const response = await api.get<{ message: string; data: CekTagihanData }>(
      `/cek-tagihan/${nomorPelanggan}/latest`
    );
    return response.data;
  },

  // Admin: Get all tagihan
  getAll: async () => {
    const response = await api.get<{ message: string; data: CekTagihanData[] }>('/cek-tagihan');
    return response.data;
  },
};
