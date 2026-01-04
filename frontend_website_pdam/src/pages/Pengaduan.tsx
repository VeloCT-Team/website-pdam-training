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
import { pengaduanService } from '../services/pengaduan.service';

interface FormData {
  nama: string;
  nomorPelanggan: string;
  noHandphone: string;
  email: string;
  kategoriPengaduan: string;
  deskripsiPengaduan: string;
  lokasi: string;
}

const Pengaduan = () => {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nomorPelanggan: '',
    noHandphone: '',
    email: '',
    kategoriPengaduan: '',
    deskripsiPengaduan: '',
    lokasi: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Kategori pengaduan
  const kategoriList = [
    'Air Tidak Mengalir',
    'Kebocoran Pipa',
    'Air Keruh/Berbau',
    'Meteran Rusak',
    'Tagihan Tidak Sesuai',
    'Pelayanan Petugas',
    'Lainnya',
  ];

  // Style untuk select dan textarea
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#F7FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#2A4D88';
    e.target.style.boxShadow = '0 0 0 1px #2A4D88';
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#E2E8F0';
    e.target.style.boxShadow = 'none';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude}, ${longitude}`;
          setFormData((prev) => ({ ...prev, lokasi: locationString }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengambil lokasi. Pastikan Anda mengizinkan akses lokasi.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolocation.');
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Kirim data ke API backend
      await pengaduanService.create({
        nama: formData.nama,
        nomorPelanggan: formData.nomorPelanggan,
        noHandphone: formData.noHandphone,
        email: formData.email,
        kategori: formData.kategoriPengaduan,
        deskripsi: formData.deskripsiPengaduan,
        lokasi: formData.lokasi,
      });

      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form
      setFormData({
        nama: '',
        nomorPelanggan: '',
        noHandphone: '',
        email: '',
        kategoriPengaduan: '',
        deskripsiPengaduan: '',
        lokasi: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting pengaduan:', error);
      alert('Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 6 }}>
      <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md">
          {/* Header */}
          <VStack gap={2} textAlign="center" mb={6}>
            <Heading
              fontSize={{ base: 'xl', md: '2xl' }}
              color="brand.navy"
              fontWeight="bold"
            >
              Form Pengaduan
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              Sampaikan keluhan atau pengaduan Anda terkait layanan air
            </Text>
          </VStack>

          {/* Form */}
          <Box as="form" onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              {/* Nama */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Nama Lengkap
                </Text>
                <Input
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  type="text"
                  size="lg"
                  px={4}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                  required
                />
              </Box>

              {/* Nomor Pelanggan */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Nomor Pelanggan
                </Text>
                <Input
                  name="nomorPelanggan"
                  value={formData.nomorPelanggan}
                  onChange={handleInputChange}
                  placeholder="9 digit nomor pelanggan"
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  size="lg"
                  px={4}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                  required
                />
              </Box>

              {/* No Handphone */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  No Handphone (WhatsApp)
                </Text>
                <Input
                  name="noHandphone"
                  value={formData.noHandphone}
                  onChange={handleInputChange}
                  placeholder="+62 812-3456-7890"
                  type="tel"
                  size="lg"
                  px={4}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                  required
                />
              </Box>

              {/* Email */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Email
                </Text>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  type="email"
                  size="lg"
                  px={4}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                  required
                />
              </Box>

              {/* Kategori Pengaduan */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Kategori Pengaduan
                </Text>
                <select
                  name="kategoriPengaduan"
                  value={formData.kategoriPengaduan}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Pilih Kategori Pengaduan</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </Box>

              {/* Deskripsi Pengaduan */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Deskripsi Pengaduan
                </Text>
                <textarea
                  name="deskripsiPengaduan"
                  value={formData.deskripsiPengaduan}
                  onChange={handleInputChange}
                  placeholder="Jelaskan pengaduan Anda secara detail..."
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </Box>

              {/* Lokasi */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Lokasi Pengaduan
                </Text>
                <Stack direction={{ base: 'column', md: 'row' }} gap={2}>
                  <Input
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Koordinat lokasi atau alamat"
                    type="text"
                    size="lg"
                    px={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    flex={1}
                    required
                  />
                  <Button
                    type="button"
                    size="lg"
                    bg="brand.navy"
                    color="white"
                    px={6}
                    _hover={{ bg: '#1e3a5f' }}
                    onClick={handleGetLocation}
                    loading={isGettingLocation}
                    flexShrink={0}
                  >
                    {isGettingLocation ? 'Mengambil Lokasi...' : 'Ambil Lokasi'}
                  </Button>
                </Stack>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Klik "Ambil Lokasi" untuk mendapatkan koordinat GPS otomatis
                </Text>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                bg="green.500"
                color="white"
                size="lg"
                w="full"
                mt={2}
                _hover={{ bg: 'green.600' }}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
              </Button>
            </VStack>
          </Box>

          {/* Info */}
          <Box mt={6} p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>
              Catatan:
            </Text>
            <Text fontSize="xs" color="gray.600">
              Pastikan nomor WhatsApp yang Anda berikan aktif karena tim kami akan menghubungi Anda
              melalui WhatsApp untuk menindaklanjuti pengaduan Anda.
            </Text>
          </Box>
        </Box>
      </Container>

      {/* Modal Success */}
      {showSuccess && (
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
          onClick={() => setShowSuccess(false)}
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
          >
            {/* Header */}
            <Box p={6} textAlign="center">
              <VStack gap={3}>
                {/* Icon Success */}
                <Box
                  w="60px"
                  h="60px"
                  borderRadius="full"
                  bg="green.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box fontSize="4xl" color="green.600">
                    ✓
                  </Box>
                </Box>

                <Heading fontSize={{ base: 'lg', md: 'xl' }} color="green.700">
                  Data Pengaduan Telah Dikirim!
                </Heading>

                <Text fontSize="sm" color="gray.700" textAlign="center" px={2}>
                  Terima kasih atas pengaduan Anda. Tim kami akan segera menindaklanjuti dan
                  menghubungi Anda melalui WhatsApp dalam waktu 1x24 jam.
                </Text>
              </VStack>
            </Box>

            {/* Footer */}
            <Box p={4} borderTop="1px solid" borderColor="gray.200">
              <Button
                w="full"
                bg="green.500"
                color="white"
                _hover={{ bg: 'green.600' }}
                onClick={() => setShowSuccess(false)}
              >
                Tutup
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Pengaduan;
