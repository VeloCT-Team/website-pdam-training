import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Container, Text, Stack, VStack, Button, createToaster, Toaster, Tabs } from '@chakra-ui/react';
import { pengaduanService } from '../services/pengaduan.service';
import type { PengaduanData } from '../services/pengaduan.service';

const toaster = createToaster({
  placement: 'top',
  duration: 5000,
});

type StatusType = 'Belum Ditindak' | 'Sedang Diproses' | 'Selesai';

// Extended type for UI display with formatted date
interface PengaduanDataWithFormatted extends PengaduanData {
  tanggalPengaduan: string;
}

const AdminPengaduan = () => {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<PengaduanDataWithFormatted[]>([]);
  const [selectedData, setSelectedData] = useState<PengaduanDataWithFormatted | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StatusType>('Belum Ditindak');

  const handleCardClick = (data: PengaduanDataWithFormatted) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleUbahStatus = async (newStatus: StatusType) => {
    if (!selectedData) return;

    const namaUser = selectedData.nama;
    const idData = selectedData.id;

    try {
      // Call API to update status
      await pengaduanService.updateStatus(selectedData.id, newStatus);

      // Update status di dataList
      setDataList(dataList.map(item =>
        item.id === selectedData.id
          ? { ...item, status: newStatus }
          : item
      ));

      // Tutup modal
      closeModal();

      // Tampilkan toast konfirmasi
      let toastMessage = '';
      if (newStatus === 'Sedang Diproses') {
        toastMessage = `Pengaduan #${idData} dari ${namaUser} telah ditandai sedang diproses.`;
      } else if (newStatus === 'Selesai') {
        toastMessage = `Pengaduan #${idData} dari ${namaUser} telah diselesaikan.`;
      }

      toaster.success({
        title: 'Status Berhasil Diubah',
        description: toastMessage,
      });
    } catch (error) {
      toaster.error({
        title: 'Gagal Mengubah Status',
        description: 'Terjadi kesalahan saat mengubah status pengaduan.',
      });
    }
  };

  const fetchPengaduan = async () => {
    try {
      const response = await pengaduanService.getAll();
      // Transform data to add formatted date
      const transformedData: PengaduanDataWithFormatted[] = response.data.map(item => ({
        ...item,
        tanggalPengaduan: new Date(item.createdAt).toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setDataList(transformedData);
    } catch (error) {
      console.error('Error fetching pengaduan:', error);
      toaster.error({
        title: 'Gagal Memuat Data',
        description: 'Terjadi kesalahan saat memuat data pengaduan.',
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
    fetchPengaduan();
  }, [navigate]);

  const getStatusColor = (status: StatusType) => {
    if (status === 'Selesai') return { bg: 'green.100', color: 'green.700' };
    if (status === 'Sedang Diproses') return { bg: 'yellow.100', color: 'yellow.700' };
    return { bg: 'red.100', color: 'red.700' };
  };

  // Filter data berdasarkan tab aktif
  const filteredData = dataList.filter(item => item.status === activeTab);

  const tabsData = [
    { value: 'Belum Ditindak', label: 'Belum Ditindak', count: dataList.filter(d => d.status === 'Belum Ditindak').length },
    { value: 'Sedang Diproses', label: 'Sedang Diproses', count: dataList.filter(d => d.status === 'Sedang Diproses').length },
    { value: 'Selesai', label: 'Selesai', count: dataList.filter(d => d.status === 'Selesai').length },
  ];

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
              Data Pengaduan
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Kelola pengaduan pelanggan berdasarkan status
            </Text>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value as StatusType)}
          variant="enclosed"
        >
          <Tabs.List mb={6} bg="white" p={2} borderRadius="lg" boxShadow="sm">
            {tabsData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                px={4}
                py={2}
                fontWeight="600"
                fontSize="sm"
                color={activeTab === tab.value ? 'white' : 'gray.600'}
                bg={activeTab === tab.value ? 'brand.navy' : 'transparent'}
                borderRadius="md"
                _hover={{ bg: activeTab === tab.value ? 'brand.navy' : 'gray.100' }}
                transition="all 0.2s"
              >
                {tab.label} ({tab.count})
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {tabsData.map((tab) => (
            <Tabs.Content key={tab.value} value={tab.value}>
              <VStack gap={4} align="stretch">
                {filteredData.length === 0 ? (
                  <Box
                    bg="white"
                    p={8}
                    borderRadius="lg"
                    boxShadow="md"
                    textAlign="center"
                  >
                    <Text fontSize="md" color="gray.600">
                      Tidak ada pengaduan dengan status "{tab.label}"
                    </Text>
                  </Box>
                ) : (
                  filteredData.map((data) => (
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
                              {data.tanggalPengaduan}
                            </Text>
                            <Heading fontSize="lg" color="brand.navy">
                              {data.nama}
                            </Heading>
                          </Box>
                          <Stack direction="row" gap={2} align="center">
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
                            <Box
                              px={3}
                              py={1}
                              bg={getStatusColor(data.status).bg}
                              borderRadius="md"
                              fontSize="xs"
                              fontWeight="600"
                              color={getStatusColor(data.status).color}
                            >
                              {data.status}
                            </Box>
                          </Stack>
                        </Stack>

                        <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                          <Box flex={1}>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              No Pelanggan
                            </Text>
                            <Text fontSize="sm" fontWeight="600">
                              {data.nomorPelanggan}
                            </Text>
                          </Box>

                          <Box flex={1}>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              No Handphone
                            </Text>
                            <Text fontSize="sm" fontWeight="600">
                              {data.noHandphone}
                            </Text>
                          </Box>

                          <Box flex={1}>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              Kategori
                            </Text>
                            <Box
                              display="inline-block"
                              px={2}
                              py={1}
                              bg="orange.100"
                              borderRadius="md"
                              fontSize="xs"
                              fontWeight="600"
                              color="orange.700"
                            >
                              {data.kategori}
                            </Box>
                          </Box>
                        </Stack>

                        <Text fontSize="xs" color="blue.600" fontWeight="600" textAlign="right">
                          Klik untuk melihat detail →
                        </Text>
                      </VStack>
                    </Box>
                  ))
                )}
              </VStack>
            </Tabs.Content>
          ))}
        </Tabs.Root>
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
            maxW="800px"
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
                    Detail Pengaduan #{selectedData.id}
                  </Heading>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {selectedData.tanggalPengaduan}
                  </Text>
                </Box>
                <Stack direction={{ base: 'column', md: 'row' }} gap={2} w="full">
                  {/* Button ubah status berdasarkan status saat ini */}
                  {selectedData.status === 'Belum Ditindak' && (
                    <Button
                      size={{ base: 'md', md: 'sm' }}
                      bg="blue.500"
                      color="white"
                      px={{ base: 4, md: 4 }}
                      py={{ base: 3, md: 2 }}
                      h={{ base: '44px', md: 'auto' }}
                      fontSize={{ base: 'sm', md: 'sm' }}
                      _hover={{ bg: 'blue.600' }}
                      onClick={() => handleUbahStatus('Sedang Diproses')}
                      flex={{ base: 1, md: 'auto' }}
                    >
                      Mulai Proses
                    </Button>
                  )}
                  {selectedData.status === 'Sedang Diproses' && (
                    <Button
                      size={{ base: 'md', md: 'sm' }}
                      bg="green.500"
                      color="white"
                      px={{ base: 4, md: 4 }}
                      py={{ base: 3, md: 2 }}
                      h={{ base: '44px', md: 'auto' }}
                      fontSize={{ base: 'sm', md: 'sm' }}
                      _hover={{ bg: 'green.600' }}
                      onClick={() => handleUbahStatus('Selesai')}
                      flex={{ base: 1, md: 'auto' }}
                    >
                      Tandai Selesai
                    </Button>
                  )}
                  <Button
                    size={{ base: 'md', md: 'sm' }}
                    bg="gray.200"
                    color="gray.700"
                    px={{ base: 4, md: 4 }}
                    py={{ base: 3, md: 2 }}
                    h={{ base: '44px', md: 'auto' }}
                    fontSize={{ base: 'sm', md: 'sm' }}
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
                {/* Status */}
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={2}>
                    Status Pengaduan
                  </Text>
                  <Box
                    display="inline-block"
                    px={4}
                    py={2}
                    bg={getStatusColor(selectedData.status).bg}
                    borderRadius="md"
                    fontSize="md"
                    fontWeight="600"
                    color={getStatusColor(selectedData.status).color}
                  >
                    {selectedData.status}
                  </Box>
                </Box>

                {/* Data Pelapor */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="blue.200">
                    Data Pelapor
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Nama Lengkap
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.nama}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Nomor Pelanggan
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.nomorPelanggan}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          No Handphone
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.noHandphone}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Email
                        </Text>
                        <Text fontSize="sm" fontWeight="600">
                          {selectedData.email}
                        </Text>
                      </Box>
                    </Stack>
                  </VStack>
                </Box>

                {/* Detail Pengaduan */}
                <Box>
                  <Heading fontSize="md" color="brand.navy" mb={3} pb={2} borderBottom="2px solid" borderColor="orange.200">
                    Detail Pengaduan
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Kategori Pengaduan
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
                        {selectedData.kategori}
                      </Box>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Deskripsi Pengaduan
                      </Text>
                      <Text fontSize="sm" fontWeight="600" lineHeight="1.6">
                        {selectedData.deskripsi}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Lokasi (Koordinat)
                      </Text>
                      <Text fontSize="sm" fontWeight="600" color="blue.600">
                        {selectedData.lokasi}
                      </Text>
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

export default AdminPengaduan;
