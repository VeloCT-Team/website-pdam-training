import { useNavigate } from 'react-router-dom';
import { Box, Heading, Container, Text, VStack, Button, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 4, md: 6 }}>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Header */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          boxShadow="md"
          mb={6}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color="brand.navy">
              Dashboard Admin
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Selamat datang di panel admin PDAM
            </Text>
          </Box>
          <Button
            bg="red.500"
            color="white"
            size="md"
            _hover={{ bg: 'red.600' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {/* Menu Cards */}
        <VStack gap={4} align="stretch">
          {/* Card Daftar Sambungan */}
          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
            onClick={() => navigate('/admin/daftar-sambungan')}
          >
            <Stack direction="row" justify="space-between" align="center">
              <Box>
                <Heading fontSize={{ base: 'lg', md: 'xl' }} color="brand.navy" mb={2}>
                  Daftar Sambungan
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Lihat dan kelola data pendaftaran sambungan baru dari pelanggan
                </Text>
              </Box>
              <Box fontSize="3xl" color="blue.500">
                📝
              </Box>
            </Stack>
          </Box>

          {/* Card Pengaduan */}
          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
            onClick={() => navigate('/admin/pengaduan')}
          >
            <Stack direction="row" justify="space-between" align="center">
              <Box>
                <Heading fontSize={{ base: 'lg', md: 'xl' }} color="brand.navy" mb={2}>
                  Pengaduan
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Lihat dan kelola pengaduan dari pelanggan
                </Text>
              </Box>
              <Box fontSize="3xl" color="green.500">
                📢
              </Box>
            </Stack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
