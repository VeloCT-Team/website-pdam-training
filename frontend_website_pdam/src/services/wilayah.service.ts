// Service untuk mengambil data wilayah Indonesia dari API
const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export interface Provinsi {
  id: string;
  name: string;
}

export interface Kota {
  id: string;
  province_id: string;
  name: string;
}

export interface Kecamatan {
  id: string;
  regency_id: string;
  name: string;
}

export interface Kelurahan {
  id: string;
  district_id: string;
  name: string;
}

export const wilayahService = {
  // Get all provinces
  getProvinsi: async (): Promise<Provinsi[]> => {
    try {
      const response = await fetch(`${BASE_URL}/provinces.json`);
      if (!response.ok) throw new Error('Failed to fetch provinces');
      return await response.json();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  },

  // Get cities/regencies by province ID
  getKota: async (provinceId: string): Promise<Kota[]> => {
    try {
      const response = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
      if (!response.ok) throw new Error('Failed to fetch regencies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching regencies:', error);
      return [];
    }
  },

  // Get districts by regency ID
  getKecamatan: async (regencyId: string): Promise<Kecamatan[]> => {
    try {
      const response = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  },

  // Get villages by district ID
  getKelurahan: async (districtId: string): Promise<Kelurahan[]> => {
    try {
      const response = await fetch(`${BASE_URL}/villages/${districtId}.json`);
      if (!response.ok) throw new Error('Failed to fetch villages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching villages:', error);
      return [];
    }
  },
};
