import api from '../config/api';

export interface PendaftaranData {
  id: number;
  // Data Calon Pelanggan
  namaCalon: string;
  hpCalon: string;
  emailCalon: string;
  kotaCalon: string;
  kecamatanCalon: string;
  kelurahanCalon: string;
  jalanCalon: string;
  noRumahCalon: string;
  rtCalon: string;
  rwCalon: string;
  // Data Penanggung Jawab
  namaPJ: string;
  hpPJ: string;
  emailPJ: string;
  kotaPJ: string;
  kecamatanPJ: string;
  kelurahanPJ: string;
  jalanPJ: string;
  noRumahPJ: string;
  rtPJ: string;
  rwPJ: string;
  // Informasi Tambahan
  kebutuhanAir: string;
  ketersediaanTangki: string;
  kategoriBangunan: string;
  peruntukanBangunan: string;
  lokasiLat: number;
  lokasiLng: number;
  // Dokumen
  ktpCalon?: string;
  kartuKeluarga?: string;
  pbb?: string;
  fotoBangunan?: string;
  // Status & Timestamps
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const pendaftaranService = {
  // Create pendaftaran (public) - dengan file upload
  create: async (formData: FormData) => {
    const response = await api.post('/pendaftaran', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all pendaftaran (admin only)
  getAll: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<{ message: string; data: PendaftaranData[] }>(
      '/pendaftaran',
      { params }
    );
    return response.data;
  },

  // Get pendaftaran by ID (admin only)
  getById: async (id: number) => {
    const response = await api.get<{ message: string; data: PendaftaranData }>(
      `/pendaftaran/${id}`
    );
    return response.data;
  },

  // Update status (admin only)
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/pendaftaran/${id}/status`, { status });
    return response.data;
  },

  // Delete pendaftaran (admin only)
  delete: async (id: number) => {
    const response = await api.delete(`/pendaftaran/${id}`);
    return response.data;
  },
};
