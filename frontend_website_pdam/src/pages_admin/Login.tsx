import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
} from '@chakra-ui/react';
import { authService } from '../services/auth.service';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call API login
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Login berhasil - simpan token dan user data ke localStorage
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));

      // Redirect ke dashboard
      navigate('/admin/daftar-sambungan');
    } catch (err: any) {
      // Handle error
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="lg" boxShadow="lg" w="full" maxW="450px">
        {/* Header */}
        <VStack gap={2} textAlign="center" mb={6}>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color="brand.navy" fontWeight="bold">
            Login Admin
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Masukkan username dan password untuk mengakses dashboard admin
          </Text>
        </VStack>

        {/* Error Message */}
        {error && (
          <Box mb={4} p={3} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
            <Text fontSize="sm" color="red.700" textAlign="center">
              {error}
            </Text>
          </Box>
        )}

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            {/* Username */}
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Username
              </Text>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
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

            {/* Password */}
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Password
              </Text>
              <Input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                type="password"
                size="lg"
                px={4}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                required
              />
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
              loading={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLogin;
