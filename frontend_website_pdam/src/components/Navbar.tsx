import {
  Box,
  Flex,
  HStack,
  Image,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Daftar Sambungan', path: '/daftar-sambungan' },
    { name: 'Cek Tagihan', path: '/cek-tagihan' },
    { name: 'Simulasi Tagihan', path: '/simulasi-tagihan' },
    { name: 'Pengaduan', path: '/pengaduan' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <Box
        as="nav"
        bg="brand.navy"
        color="white"
        position="sticky"
        top={0}
        zIndex={1000}
        shadow="md"
      >
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Box>
              <RouterLink to="/">
                <Image
                  src="/pam_jaya.png"
                  alt="PAM JAYA"
                  h={{ base: '40px', md: '50px' }}
                  objectFit="contain"
                  borderRadius="md"
                  bg="white"
                  p={1}
                />
              </RouterLink>
            </Box>

            {/* Desktop Menu */}
            <HStack
              display={{ base: 'none', md: 'flex' }}
              gap={{ base: 4, lg: 6 }}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <RouterLink key={link.path} to={link.path}>
                    <Box
                      px={3}
                      py={2}
                      rounded="md"
                      fontWeight="500"
                      fontSize="sm"
                      letterSpacing="0.3px"
                      transition="all 0.2s"
                      color={isActive ? 'brand.gold' : 'white'}
                      borderBottom={isActive ? '2px solid' : 'none'}
                      borderColor="brand.gold"
                      _hover={{
                        color: 'brand.gold',
                        transform: 'translateY(-2px)',
                      }}
                      _active={{
                        color: 'brand.gold',
                        transform: 'scale(0.95)',
                      }}
                    >
                      {link.name}
                    </Box>
                  </RouterLink>
                );
              })}
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </IconButton>
          </Flex>
        </Box>
      </Box>

      {/* Mobile Menu Overlay Dropdown */}
      {mobileMenuOpen && (
        <Box
          position="fixed"
          top="68px"
          right={4}
          width={{ base: '220px', sm: '240px' }}
          bg="white"
          shadow="2xl"
          zIndex={999}
          display={{ base: 'block', md: 'none' }}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack align="stretch" py={1} gap={0}>
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <RouterLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Box
                    px={4}
                    py={2.5}
                    color={isActive ? 'brand.gold' : 'gray.700'}
                    fontWeight={isActive ? '600' : '500'}
                    fontSize="sm"
                    letterSpacing="0.2px"
                    transition="all 0.15s ease"
                    borderBottomWidth={index === navLinks.length - 1 ? '0' : '1px'}
                    borderColor="gray.100"
                    borderLeftWidth={isActive ? '3px' : '0'}
                    borderLeftColor="brand.gold"
                    _hover={{
                      bg: 'brand.navy',
                      color: 'white',
                      paddingLeft: 5,
                    }}
                    _active={{
                      bg: 'brand.gold',
                      color: 'white',
                      transform: 'scale(0.98)',
                    }}
                  >
                    {link.name}
                  </Box>
                </RouterLink>
              );
            })}
          </VStack>
        </Box>
      )}

      {/* Backdrop overlay */}
      {mobileMenuOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.400"
          zIndex={998}
          display={{ base: 'block', md: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
