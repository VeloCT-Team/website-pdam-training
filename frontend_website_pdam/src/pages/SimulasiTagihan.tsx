import { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  VStack,
  Input,
  Button,
  Stack,
} from '@chakra-ui/react';

interface FormData {
  kategoriPelanggan: string;
  ukuranDiameter: string;
  pemakaianAir: string;
}

interface HasilSimulasi {
  biayaPemakaian: number;
  biayaBeban: number;
  biayaAdmin: number;
  totalTagihan: number;
}

const SimulasiTagihan = () => {
  const [formData, setFormData] = useState<FormData>({
    kategoriPelanggan: '',
    ukuranDiameter: '',
    pemakaianAir: '',
  });

  const [hasilSimulasi, setHasilSimulasi] = useState<HasilSimulasi | null>(null);

  // Data dummy untuk kategori pelanggan
  const kategoriList = [
    '1A - Bangunan Sosial',
    '1B - Bangunan Sosial',
    '1C - Bangunan Sosial',
    '5F1 - Rumah Susun Sangat Sederhana',
    '2A1 - Rumah Tangga Sangat Sederhana 1',
    '5A - Hidran Kebakaran',
    '2F - Instansi Pendidikan Pemerintah',
    '2A1A - Rumah Tangga Sangat Sederhana 2',
    '5FP - Rumah Susun Sederhana Sewa- Pemerintah',
    '5B1 - Kios Air',
    '5F2 - Rumah Susun Sederhana',
    '2A2 - Rumah Tangga Sederhana 1',
    '2A2A - Rumah Tangga Sederhana 2',
    '5F3 - Rumah Susun Menengah',
    '2A3 - Rumah Tangga Menengah 1',
    '3D1 - Usaha Kecil Dalam Rumah Tangga',
    '5A1 - Usaha Kecil Dalam Rumah Tangga',
    '2A4A - Rumah Tangga Menengah 2',
    '1D - Fasilitas Kesehatan Milik Pemerintah',
    '2A4 - Rumah Tangga Mewah 1',
    '2A5 - Rumah Tangga Mewah 2',
    '2E1 - Niaga/Industri Kecil',
    '3A - Niaga/Industri Kecil',
    '3B1 - Niaga/Industri Kecil',
    '3C1 - Niaga/Industri Kecil',
    '2C - Instansi dan Fasilitas Pemerintah',
    '2G - Instansi dan Fasilitas Pemerintah',
    '2B - Instansi Luar Negeri',
    '2D - Instansi Luar Negeri',
    '3H - Fasilitas Kesehatan Swasta',
    '2E - Niaga/Industri Menengah',
    '3B - Niaga/Industri Menengah',
    '3C - Niaga/Industri Menengah',
    '3E - Niaga/Industri Menengah',
    '3F - Niaga/Industri Menengah',
    '3G - Niaga/Industri Menengah',
    '3I - Niaga/Industri Menengah',
    '3K - Niaga/Industri Menengah',
    '3T - Niaga/Industri Menengah',
    '4A - Niaga/Industri Menengah',
    '3L - Gedung Bertingkat Tinggi/Apartemen Kondominium',
    '3S - Gedung Bertingkat Tinggi/Apartemen Kondominium',
    '3M - Niaga/Industri Besar',
    '3N - Niaga/Industri Besar',
    '3O - Niaga/Industri Besar',
    '3P - Niaga/Industri Besar',
    '3Q - Niaga/Industri Besar',
    '3R - Niaga/Industri Besar',
    '4B - Niaga/Industri Besar',
    '4C - Niaga/Industri Besar',
    '4D - Niaga/Industri Besar',
    '4E - Niaga/Industri Besar',
    '4F - Niaga/Industri Besar',
    '4G - Niaga/Industri Besar',
    '5C - Niaga/Industri Besar',
    '5E - Niaga/Industri Besar',
    '5D - Pelabuhan Laut dan Udara',
  ];

  // Data dummy untuk ukuran diameter (dalam mm)
  const diameterList = [
    '1/2 inch (13mm)',
    '3/4 inch (19mm)',
    '1 inch (25mm)',
    '1 1/4 inch (32mm)',
    '1 1/2 inch (38mm)',
    '2 inch (50mm)',
  ];

  // Style untuk select
  const selectStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#F7FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#2A4D88';
    e.target.style.boxShadow = '0 0 0 1px #2A4D88';
  };

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#E2E8F0';
    e.target.style.boxShadow = 'none';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const hitungTagihan = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi perhitungan tagihan (dummy calculation)
    const pemakaian = parseInt(formData.pemakaianAir) || 0;

    // Tarif per m3 berdasarkan kategori (dummy data - simplified logic)
    let tarifPerM3 = 2500; // default

    // Logika sederhana berdasarkan kode kategori
    if (formData.kategoriPelanggan.includes('Sosial')) {
      tarifPerM3 = 1500;
    } else if (formData.kategoriPelanggan.includes('Rumah Susun Sangat Sederhana') ||
               formData.kategoriPelanggan.includes('Sangat Sederhana')) {
      tarifPerM3 = 1800;
    } else if (formData.kategoriPelanggan.includes('Rumah Tangga Sederhana') ||
               formData.kategoriPelanggan.includes('Rumah Susun Sederhana')) {
      tarifPerM3 = 2200;
    } else if (formData.kategoriPelanggan.includes('Hidran Kebakaran')) {
      tarifPerM3 = 3000;
    } else if (formData.kategoriPelanggan.includes('Menengah') ||
               formData.kategoriPelanggan.includes('Usaha Kecil')) {
      tarifPerM3 = 3500;
    } else if (formData.kategoriPelanggan.includes('Mewah')) {
      tarifPerM3 = 4500;
    } else if (formData.kategoriPelanggan.includes('Niaga/Industri Kecil')) {
      tarifPerM3 = 5000;
    } else if (formData.kategoriPelanggan.includes('Niaga/Industri Menengah')) {
      tarifPerM3 = 6500;
    } else if (formData.kategoriPelanggan.includes('Niaga/Industri Besar')) {
      tarifPerM3 = 8000;
    } else if (formData.kategoriPelanggan.includes('Gedung Bertingkat')) {
      tarifPerM3 = 7000;
    } else if (formData.kategoriPelanggan.includes('Instansi') ||
               formData.kategoriPelanggan.includes('Fasilitas Kesehatan') ||
               formData.kategoriPelanggan.includes('Pelabuhan')) {
      tarifPerM3 = 4000;
    } else if (formData.kategoriPelanggan.includes('Kios Air')) {
      tarifPerM3 = 2800;
    }

    // Biaya beban berdasarkan diameter (dummy data)
    let biayaBeban = 0;
    if (formData.ukuranDiameter.includes('1/2')) biayaBeban = 15000;
    else if (formData.ukuranDiameter.includes('3/4')) biayaBeban = 20000;
    else if (formData.ukuranDiameter.includes('1 inch')) biayaBeban = 25000;
    else if (formData.ukuranDiameter.includes('1 1/4')) biayaBeban = 30000;
    else if (formData.ukuranDiameter.includes('1 1/2')) biayaBeban = 35000;
    else if (formData.ukuranDiameter.includes('2 inch')) biayaBeban = 40000;

    const biayaPemakaian = pemakaian * tarifPerM3;
    const biayaAdmin = 5000;
    const totalTagihan = biayaPemakaian + biayaBeban + biayaAdmin;

    setHasilSimulasi({
      biayaPemakaian,
      biayaBeban,
      biayaAdmin,
      totalTagihan,
    });
  };

  const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 6 }}>
      <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          boxShadow="md"
        >
          {/* Header */}
          <VStack gap={2} textAlign="center" mb={6}>
            <Heading
              fontSize={{ base: 'xl', md: '2xl' }}
              color="brand.navy"
              fontWeight="bold"
            >
              Simulasi Tagihan Air
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              Isi form terlebih dahulu untuk menampilkan hasil simulasi tagihan air
            </Text>
          </VStack>

          <VStack gap={6} align="stretch">
            {/* Form */}
            <Box
              as="form"
              onSubmit={hitungTagihan}
            >
              <VStack gap={4} align="stretch">
                {/* Kategori Pelanggan */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Kategori Pelanggan
                  </Text>
                  <select
                    name="kategoriPelanggan"
                    value={formData.kategoriPelanggan}
                    onChange={handleInputChange}
                    style={selectStyle}
                    onFocus={handleSelectFocus}
                    onBlur={handleSelectBlur}
                    required
                  >
                    <option value="">Pilih Kategori Pelanggan</option>
                    {kategoriList.map(kategori => (
                      <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                  </select>
                </Box>

                {/* Ukuran Diameter */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Ukuran Diameter
                  </Text>
                  <select
                    name="ukuranDiameter"
                    value={formData.ukuranDiameter}
                    onChange={handleInputChange}
                    style={selectStyle}
                    onFocus={handleSelectFocus}
                    onBlur={handleSelectBlur}
                    required
                  >
                    <option value="">Pilih Ukuran Diameter</option>
                    {diameterList.map(diameter => (
                      <option key={diameter} value={diameter}>{diameter}</option>
                    ))}
                  </select>
                </Box>

                {/* Pemakaian Air */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Pemakaian Air
                  </Text>
                  <Box position="relative">
                    <Input
                      name="pemakaianAir"
                      value={formData.pemakaianAir}
                      onChange={handleInputChange}
                      placeholder="Input Jumlah Pemakaian Air"
                      type="number"
                      min="0"
                      size="lg"
                      px={4}
                      pr={12}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      required
                    />
                    <Text
                      position="absolute"
                      right={4}
                      top="50%"
                      transform="translateY(-50%)"
                      fontSize="md"
                      fontWeight="600"
                      color="gray.500"
                    >
                      m3
                    </Text>
                  </Box>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  bg="brand.navy"
                  color="white"
                  size="lg"
                  w="full"
                  mt={2}
                  _hover={{ bg: '#1e3a5f' }}
                >
                  Hitung Tagihan
                </Button>
              </VStack>
            </Box>

            {/* Hasil Simulasi */}
            {hasilSimulasi && (
              <Box
                mt={4}
                p={{ base: 4, md: 6 }}
                bg="blue.50"
                borderRadius="lg"
                border="2px solid"
                borderColor="brand.navy"
              >
                <Heading
                  fontSize={{ base: 'md', md: 'lg' }}
                  color="brand.navy"
                  mb={4}
                  pb={2}
                  borderBottom="2px solid"
                  borderColor="brand.gold"
                >
                  Hasil Simulasi Tagihan
                </Heading>

                <VStack gap={3} align="stretch">
                  <Stack direction="row" justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.700">
                      Biaya Pemakaian Air
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {formatRupiah(hasilSimulasi.biayaPemakaian)}
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.700">
                      Biaya Beban
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {formatRupiah(hasilSimulasi.biayaBeban)}
                    </Text>
                  </Stack>

                  <Stack direction="row" justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.700">
                      Biaya Admin
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.900">
                      {formatRupiah(hasilSimulasi.biayaAdmin)}
                    </Text>
                  </Stack>

                  <Box
                    pt={3}
                    mt={2}
                    borderTop="2px solid"
                    borderColor="gray.300"
                  >
                    <Stack direction="row" justify="space-between" align="center">
                      <Text fontSize="md" fontWeight="700" color="brand.navy">
                        Total Tagihan
                      </Text>
                      <Text fontSize="lg" fontWeight="700" color="brand.navy">
                        {formatRupiah(hasilSimulasi.totalTagihan)}
                      </Text>
                    </Stack>
                  </Box>
                </VStack>

                <Box mt={4} p={3} bg="yellow.50" borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
                  <Text fontSize="xs" color="gray.600">
                    <strong>Catatan:</strong> Hasil simulasi ini adalah estimasi dan dapat berbeda dengan tagihan sebenarnya.
                    Untuk informasi lebih lanjut, silakan hubungi kantor PDAM terdekat.
                  </Text>
                </Box>
              </Box>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default SimulasiTagihan;
