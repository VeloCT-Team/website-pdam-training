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
import { cekTagihanService } from '../services/cekTagihan.service';

interface TagihanData {
  nomorPelanggan: string;
  namaPelanggan: string;
  periode: string;
  pemakaian: number;
  totalTagihan: number;
  status: string;
}

const CekTagihan = () => {
  const [nomorPelanggan, setNomorPelanggan] = useState('');
  const [tagihanData, setTagihanData] = useState<TagihanData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Hanya terima angka dan maksimal 9 digit
    if (value === '' || (/^\d+$/.test(value) && value.length <= 9)) {
      setNomorPelanggan(value);
      setError('');
    }
  };

  const handleCekTagihan = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi 9 digit
    if (nomorPelanggan.length !== 9) {
      setError('Nomor pelanggan harus 9 digit');
      return;
    }

    setIsLoading(true);
    setError('');
    setTagihanData(null);

    try {
      // Call API to get latest tagihan
      const response = await cekTagihanService.getLatest(nomorPelanggan);
      const data = response.data;

      // Transform data to match UI format
      setTagihanData({
        nomorPelanggan: data.nomorPelanggan,
        namaPelanggan: data.namaPelanggan || 'Tidak Tersedia',
        periode: `${data.bulan} ${data.tahun}`,
        pemakaian: data.pemakaian,
        totalTagihan: data.totalTagihan,
        status: data.status,
      });
      setIsLoading(false);
    } catch (error: any) {
      // Handle error response
      if (error.response?.status === 404) {
        setError('Maaf, data tidak ditemukan.');
      } else {
        setError('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
      }
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <>
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
              Cek Tagihan Air
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              Masukkan nomor pelanggan untuk menampilkan tagihan air Anda
            </Text>
          </VStack>

          {/* Form */}
          <Box
            as="form"
            onSubmit={handleCekTagihan}
          >
            <VStack gap={4} align="stretch">
              {/* Nomor Pelanggan */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Nomor Pelanggan
                </Text>
                <Input
                  value={nomorPelanggan}
                  onChange={handleInputChange}
                  placeholder="123456789"
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  size="lg"
                  px={4}
                  bg="gray.50"
                  border="1px solid"
                  borderColor={error ? 'red.500' : 'gray.300'}
                  _focus={{ borderColor: error ? 'red.500' : 'brand.navy', boxShadow: error ? '0 0 0 1px #E53E3E' : '0 0 0 1px #2A4D88' }}
                  required
                />
                {error && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {error}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Nomor pelanggan harus 9 digit
                </Text>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                bg="blue.500"
                color="white"
                size="lg"
                w="full"
                mt={2}
                _hover={{ bg: 'blue.600' }}
                loading={isLoading}
              >
                {isLoading ? 'Mencari data...' : 'Cek Tagihan'}
              </Button>
            </VStack>
          </Box>

          {/* Hasil Tagihan */}
          {tagihanData && (
            <Box
              mt={6}
              p={{ base: 4, md: 6 }}
              bg="green.50"
              borderRadius="lg"
              border="2px solid"
              borderColor="green.500"
            >
              <Heading
                fontSize={{ base: 'md', md: 'lg' }}
                color="brand.navy"
                mb={4}
                pb={2}
                borderBottom="2px solid"
                borderColor="brand.gold"
              >
                Detail Tagihan
              </Heading>

              <VStack gap={3} align="stretch">
                <Stack direction="row" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.700">
                    Nomor Pelanggan
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    {tagihanData.nomorPelanggan}
                  </Text>
                </Stack>

                <Stack direction="row" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.700">
                    Nama Pelanggan
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    {tagihanData.namaPelanggan}
                  </Text>
                </Stack>

                <Stack direction="row" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.700">
                    Periode
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    {tagihanData.periode}
                  </Text>
                </Stack>

                <Stack direction="row" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.700">
                    Pemakaian Air
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    {tagihanData.pemakaian} m³
                  </Text>
                </Stack>

                <Stack direction="row" justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.700">
                    Status
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={tagihanData.status === 'Lunas' ? 'green.600' : 'red.600'}
                  >
                    {tagihanData.status}
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
                      {formatRupiah(tagihanData.totalTagihan)}
                    </Text>
                  </Stack>
                </Box>
              </VStack>

              {tagihanData.status !== 'Lunas' && (
                <Button
                  mt={4}
                  w="full"
                  bg="green.500"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'green.600' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Bayar Sekarang
                </Button>
              )}
            </Box>
          )}

          {/* Error State - Data Tidak Ditemukan */}
          {error && error.includes('tidak ditemukan') && (
            <Box
              mt={6}
              p={{ base: 4, md: 6 }}
              textAlign="center"
            >
              {/* Icon SVG Error */}
              <Box mb={4} display="flex" justifyContent="center">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect x="20" y="10" width="70" height="90" rx="4" fill="#BFDBFE"/>
                  <rect x="30" y="20" width="30" height="3" rx="1.5" fill="#60A5FA"/>
                  <rect x="30" y="30" width="40" height="3" rx="1.5" fill="#60A5FA"/>
                  <rect x="30" y="40" width="35" height="3" rx="1.5" fill="#60A5FA"/>
                  <rect x="75" y="15" width="15" height="80" rx="2" fill="#93C5FD"/>
                  <circle cx="70" cy="65" r="25" fill="#FCA5A5"/>
                  <circle cx="70" cy="65" r="20" fill="#F87171"/>
                  <circle cx="70" cy="65" r="15" fill="#EF4444"/>
                  <path d="M62 57L78 73M78 57L62 73" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <ellipse cx="80" cy="90" rx="30" ry="5" fill="#60A5FA" opacity="0.3"/>
                </svg>
              </Box>

              <Heading fontSize={{ base: 'lg', md: 'xl' }} color="gray.800" mb={2}>
                Maaf, data tidak ditemukan.
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Sepertinya tidak ada data yang tersedia saat ini. Coba refresh atau kembali nanti!
              </Text>
            </Box>
          )}
          </Box>
        </Container>
      </Box>

      {/* Modal Pembayaran */}
      {isModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          onClick={() => setIsModalOpen(false)}
        >
          <Box
            bg="white"
            maxW="500px"
            w="90%"
            mx={4}
            borderRadius="lg"
            boxShadow="xl"
            onClick={(e) => e.stopPropagation()}
            position="relative"
            maxH="90vh"
            overflowY="auto"
          >
            {/* Header */}
            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
              <Heading fontSize={{ base: 'lg', md: 'xl' }} color="brand.navy">
                Informasi Pembayaran
              </Heading>
            </Box>

            {/* Body */}
            <Box p={4}>
              <VStack gap={4} align="stretch">
              {/* Nomor Rekening */}
              <Box
                p={4}
                bg="blue.50"
                borderRadius="md"
                border="1px solid"
                borderColor="blue.200"
              >
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Nomor Rekening
                </Text>
                <Stack direction="row" align="center" justify="space-between">
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Bank BCA
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="brand.navy">
                      1234567890
                    </Text>
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      a.n. PDAM Jawa Barat
                    </Text>
                  </Box>
                  <Button
                    size="sm"
                    bg="blue.500"
                    color="white"
                    px={6}
                    _hover={{ bg: 'blue.600' }}
                    onClick={() => {
                      navigator.clipboard.writeText('1234567890');
                      alert('Nomor rekening berhasil disalin!');
                    }}
                  >
                    Salin
                  </Button>
                </Stack>
              </Box>

              {/* WhatsApp Konfirmasi */}
              <Box
                p={4}
                bg="green.50"
                borderRadius="md"
                border="1px solid"
                borderColor="green.200"
              >
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Konfirmasi Pembayaran via WhatsApp
                </Text>
                <Stack direction="row" align="center" justify="space-between">
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Customer Service PDAM
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="green.700">
                      +62 812-3456-7890
                    </Text>
                  </Box>
                  <Button
                    size="sm"
                    bg="green.500"
                    color="white"
                    px={4}
                    _hover={{ bg: 'green.600' }}
                    onClick={() => {
                      const message = `Halo, saya ingin konfirmasi pembayaran tagihan air.\nNomor Pelanggan: ${tagihanData?.nomorPelanggan}\nNama: ${tagihanData?.namaPelanggan}\nTotal Tagihan: ${formatRupiah(tagihanData?.totalTagihan || 0)}`;
                      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    Chat WA
                  </Button>
                </Stack>
              </Box>

              {/* Instruksi */}
              <Box
                p={3}
                bg="yellow.50"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="yellow.400"
              >
                <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>
                  Instruksi Pembayaran:
                </Text>
                <VStack gap={1} align="stretch">
                  <Text fontSize="xs" color="gray.600">
                    1. Transfer sesuai jumlah tagihan ke rekening di atas
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    2. Simpan bukti transfer
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    3. Hubungi WhatsApp untuk konfirmasi pembayaran
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    4. Kirimkan bukti transfer ke Customer Service
                  </Text>
                </VStack>
              </Box>
              </VStack>
            </Box>

            {/* Footer */}
            <Box p={4} borderTop="1px solid" borderColor="gray.200">
              <Button
                w="full"
                bg="gray.200"
                color="gray.700"
                _hover={{ bg: 'gray.300' }}
                onClick={() => setIsModalOpen(false)}
              >
                Tutup
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CekTagihan;
