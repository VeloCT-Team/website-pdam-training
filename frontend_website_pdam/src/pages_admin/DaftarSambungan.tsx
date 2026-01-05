import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Container, Text, Stack, VStack, Button, createToaster, Toaster } from '@chakra-ui/react';
import { pendaftaranService } from '../services/pendaftaran.service';
import type { PendaftaranData } from '../services/pendaftaran.service';

const toaster = createToaster({
  placement: 'top',
  duration: 5000,
});

// Extended type for UI display with formatted date
interface PendaftaranDataWithFormatted extends PendaftaranData {
  tanggalDaftar: string;
}

const AdminDaftarSambungan = () => {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<PendaftaranDataWithFormatted[]>([]);
  const [selectedData, setSelectedData] = useState<PendaftaranDataWithFormatted | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (data: PendaftaranDataWithFormatted) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleProses = async () => {
    if (!selectedData) return;

    const namaCalon = selectedData.namaCalon;
    const hpCalon = selectedData.hpCalon;
    const idData = selectedData.id;

    try {
      // Call API to delete the pendaftaran
      await pendaftaranService.delete(selectedData.id);

      // Hapus data dari list
      setDataList(dataList.filter(item => item.id !== selectedData.id));

      // Tutup modal
      closeModal();

      // Tampilkan toast konfirmasi
      toaster.success({
        title: 'Data Telah Diproses',
        description: `Pendaftaran #${idData} atas nama ${namaCalon} telah ditandai sebagai diproses. Admin akan menghubungi pelanggan melalui WhatsApp di nomor ${hpCalon}`,
      });
    } catch (error) {
      toaster.error({
        title: 'Gagal Memproses Data',
        description: 'Terjadi kesalahan saat memproses pendaftaran.',
      });
    }
  };

  const fetchPendaftaran = async () => {
    try {
      const response = await pendaftaranService.getAll();
      // Transform data to add formatted date
      const transformedData: PendaftaranDataWithFormatted[] = response.data.map(item => ({
        ...item,
        tanggalDaftar: new Date(item.createdAt).toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setDataList(transformedData);
    } catch (error) {
      console.error('Error fetching pendaftaran:', error);
      toaster.error({
        title: 'Gagal Memuat Data',
        description: 'Terjadi kesalahan saat memuat data pendaftaran.',
      });
    }
  };

  const handleViewDocument = (fileUrl: string | null | undefined) => {
    if (!fileUrl) {
      toaster.error({
        title: 'Dokumen Tidak Tersedia',
        description: 'Dokumen ini belum diunggah.',
      });
      return;
    }
    // Langsung buka URL Cloudinary
    window.open(fileUrl, '_blank');
  };

  const handleDownloadDocument = async (fileUrl: string | null | undefined) => {
    if (!fileUrl) {
      toaster.error({
        title: 'Dokumen Tidak Tersedia',
        description: 'Dokumen ini belum diunggah.',
      });
      return;
    }

    try {
      // Extract filename dari URL Cloudinary
      const filename = fileUrl.split('/').pop() || 'document';

      // Fetch file as blob dari Cloudinary
      const response = await fetch(fileUrl);

      if (!response.ok) {
        toaster.error({
          title: 'File Tidak Ditemukan',
          description: 'File dokumen tidak tersedia.',
        });
        return;
      }

      // Convert to blob
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toaster.success({
        title: 'Download Berhasil',
        description: 'File berhasil diunduh',
      });
    } catch (error) {
      console.error('Download error:', error);
      toaster.error({
        title: 'Gagal Mengunduh',
        description: 'Terjadi kesalahan saat mengunduh dokumen.',
      });
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch data from API
    fetchPendaftaran();
  }, [navigate]);

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 6 }}>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Header */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          boxShadow="md"
          mb={6}
        >
          <Box>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color="brand.navy">
              Data Daftar Sambungan
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Daftar pendaftaran sambungan baru dari pelanggan
            </Text>
          </Box>
        </Box>

        {/* Data List */}
        <VStack gap={4} align="stretch">
          {dataList.length === 0 ? (
            <Box
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="md" color="gray.600">
                Belum ada data pendaftaran
              </Text>
            </Box>
          ) : (
            dataList.map((data) => (
              <Box
                key={data.id}
                bg="white"
                p={{ base: 4, md: 6 }}
                borderRadius="lg"
                boxShadow="md"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                onClick={() => handleCardClick(data)}
              >
                <VStack gap={3} align="stretch">
                  <Stack direction="row" justify="space-between" align="start">
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        {data.tanggalDaftar}
                      </Text>
                      <Heading fontSize="lg" color="brand.navy">
                        {data.namaCalon}
                      </Heading>
                    </Box>
                    <Box
                      px={3}
                      py={1}
                      bg="blue.100"
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="600"
                      color="blue.700"
                    >
                      #{data.id}
                    </Box>
                  </Stack>

                  <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Box flex={1}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        No Handphone
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {data.hpCalon}
                      </Text>
                    </Box>

                    <Box flex={1}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Email
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {data.emailCalon}
                      </Text>
                    </Box>

                    <Box flex={1}>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Kota
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {data.kotaCalon}
                      </Text>
                    </Box>
                  </Stack>

                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Kategori Bangunan
                    </Text>
                    <Box
                      display="inline-block"
                      px={3}
                      py={1}
                      bg="purple.100"
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="600"
                      color="purple.700"
                    >
                      {data.kategoriBangunan}
                    </Box>
                  </Box>

                  <Text fontSize="xs" color="blue.600" fontWeight="600" textAlign="right">
                    Klik untuk melihat detail →
                  </Text>
                </VStack>
              </Box>
            ))
          )}
        </VStack>
      </Container>

      {/* Modal Detail */}
      {isModalOpen && selectedData && (
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
          onClick={closeModal}
        >
          <Box
            bg="white"
            maxW="900px"
            w="95%"
            mx={4}
            borderRadius="lg"
            boxShadow="xl"
            onClick={(e) => e.stopPropagation()}
            position="relative"
            maxH="90vh"
            overflowY="auto"
          >
            {/* Header */}
            <Box p={{ base: 3, md: 4 }} borderBottom="1px solid" borderColor="gray.200" position="sticky" top={0} bg="white" zIndex={1}>
              <VStack gap={3} align="stretch">
                <Box>
                  <Heading fontSize={{ base: 'md', md: 'xl' }} color="brand.navy">
                    Detail Pendaftaran #{selectedData.id}
                  </Heading>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {selectedData.tanggalDaftar}
                  </Text>
                </Box>
                <Stack direction={{ base: 'column', md: 'row' }} gap={2} w="full">
                  <Button
                    size="sm"
                    bg="green.500"
                    color="white"
                    px={{ base: 3, md: 4 }}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    _hover={{ bg: 'green.600' }}
                    onClick={handleProses}
                    flex={{ base: 1, md: 'auto' }}
                  >
                    Tandai Telah Diproses
                  </Button>
                  <Button
                    size="sm"
                    bg="gray.200"
                    color="gray.700"
                    px={{ base: 3, md: 4 }}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    _hover={{ bg: 'gray.300' }}
                    onClick={closeModal}
                    flex={{ base: 1, md: 'auto' }}
                  >
                    ✕ Tutup
                  </Button>
                </Stack>
              </VStack>
            </Box>

            {/* Body */}
            <Box p={6}>
              <VStack gap={6} align="stretch">
                {/* Data Calon Pelanggan */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="blue.200">
                    Data Calon Pelanggan
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Nama Lengkap
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.namaCalon}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          No Handphone
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.hpCalon}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Email
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.emailCalon}
                        </Text>
                      </Box>
                    </Stack>

                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Alamat Lengkap
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {selectedData.jalanCalon} No. {selectedData.noRumahCalon}, RT {selectedData.rtCalon}/RW {selectedData.rwCalon}, Kelurahan {selectedData.kelurahanCalon}, Kecamatan {selectedData.kecamatanCalon}, {selectedData.kotaCalon}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Data Penanggung Jawab */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="green.200">
                    Data Penanggung Jawab
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Nama Lengkap
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.namaPJ}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          No Handphone
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.hpPJ}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Email
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.emailPJ}
                        </Text>
                      </Box>
                    </Stack>

                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Alamat Lengkap
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {selectedData.jalanPJ} No. {selectedData.noRumahPJ}, RT {selectedData.rtPJ}/RW {selectedData.rwPJ}, Kelurahan {selectedData.kelurahanPJ}, Kecamatan {selectedData.kecamatanPJ}, {selectedData.kotaPJ}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Informasi Tambahan */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="orange.200">
                    Informasi Bangunan & Kebutuhan
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Kategori Bangunan
                        </Text>
                        <Box
                          display="inline-block"
                          px={3}
                          py={1}
                          bg="purple.100"
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="600"
                          color="purple.700"
                        >
                          {selectedData.kategoriBangunan}
                        </Box>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Peruntukan Bangunan
                        </Text>
                        <Box
                          display="inline-block"
                          px={3}
                          py={1}
                          bg="orange.100"
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="600"
                          color="orange.700"
                        >
                          {selectedData.peruntukanBangunan}
                        </Box>
                      </Box>
                    </Stack>

                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Kebutuhan Air
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.kebutuhanAir}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Ketersediaan Tangki
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.ketersediaanTangki}
                        </Text>
                      </Box>
                    </Stack>

                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Lokasi (Koordinat)
                      </Text>
                      <Text fontSize="sm" fontWeight="600" color="blue.600">
                        {selectedData.lokasiLat}, {selectedData.lokasiLng}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Dokumen */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="purple.200">
                    Dokumen Pendukung
                  </Heading>
                  <VStack gap={3} align="stretch">
                    {/* KTP Calon Pelanggan */}
                    <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                      <Stack direction="row" justify="space-between" align="center">
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                            KTP Calon Pelanggan
                          </Text>
                          <Text fontSize="xs" color={selectedData.ktpCalon ? 'green.600' : 'red.600'} fontWeight="600">
                            {selectedData.ktpCalon ? 'Tersedia' : 'Tidak Tersedia'}
                          </Text>
                        </Box>
                        <Stack direction="row" gap={2}>
                          <Button
                            size="sm"
                            bg="blue.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => handleViewDocument(selectedData.ktpCalon)}
                            disabled={!selectedData.ktpCalon}
                          >
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'green.600' }}
                            onClick={() => handleDownloadDocument(selectedData.ktpCalon)}
                            disabled={!selectedData.ktpCalon}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Kartu Keluarga */}
                    <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                      <Stack direction="row" justify="space-between" align="center">
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                            Kartu Keluarga
                          </Text>
                          <Text fontSize="xs" color={selectedData.kartuKeluarga ? 'green.600' : 'red.600'} fontWeight="600">
                            {selectedData.kartuKeluarga ? 'Tersedia' : 'Tidak Tersedia'}
                          </Text>
                        </Box>
                        <Stack direction="row" gap={2}>
                          <Button
                            size="sm"
                            bg="blue.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => handleViewDocument(selectedData.kartuKeluarga)}
                            disabled={!selectedData.kartuKeluarga}
                          >
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'green.600' }}
                            onClick={() => handleDownloadDocument(selectedData.kartuKeluarga)}
                            disabled={!selectedData.kartuKeluarga}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* PBB */}
                    <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                      <Stack direction="row" justify="space-between" align="center">
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                            PBB
                          </Text>
                          <Text fontSize="xs" color={selectedData.pbb ? 'green.600' : 'red.600'} fontWeight="600">
                            {selectedData.pbb ? 'Tersedia' : 'Tidak Tersedia'}
                          </Text>
                        </Box>
                        <Stack direction="row" gap={2}>
                          <Button
                            size="sm"
                            bg="blue.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => handleViewDocument(selectedData.pbb)}
                            disabled={!selectedData.pbb}
                          >
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'green.600' }}
                            onClick={() => handleDownloadDocument(selectedData.pbb)}
                            disabled={!selectedData.pbb}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Foto Bangunan */}
                    <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                      <Stack direction="row" justify="space-between" align="center">
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                            Foto Bangunan
                          </Text>
                          <Text fontSize="xs" color={selectedData.fotoBangunan ? 'green.600' : 'red.600'} fontWeight="600">
                            {selectedData.fotoBangunan ? 'Tersedia' : 'Tidak Tersedia'}
                          </Text>
                        </Box>
                        <Stack direction="row" gap={2}>
                          <Button
                            size="sm"
                            bg="blue.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'blue.600' }}
                            onClick={() => handleViewDocument(selectedData.fotoBangunan)}
                            disabled={!selectedData.fotoBangunan}
                          >
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            px={4}
                            _hover={{ bg: 'green.600' }}
                            onClick={() => handleDownloadDocument(selectedData.fotoBangunan)}
                            disabled={!selectedData.fotoBangunan}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}

      <Toaster toaster={toaster}>
        {(toast) => (
          <Box
            bg={toast.type === 'success' ? 'green.500' : toast.type === 'error' ? 'red.500' : 'blue.500'}
            color="white"
            p={4}
            borderRadius="md"
            boxShadow="lg"
          >
            <Text fontWeight="600" mb={1}>
              {toast.title}
            </Text>
            {toast.description && (
              <Text fontSize="sm">
                {toast.description}
              </Text>
            )}
          </Box>
        )}
      </Toaster>
    </Box>
  );
};

export default AdminDaftarSambungan;
