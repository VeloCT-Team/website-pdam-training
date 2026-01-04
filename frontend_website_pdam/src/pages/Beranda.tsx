import { Box, Heading, Text, VStack, Container, SimpleGrid, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Beranda = () => {
  const services = [
    {
      title: 'Daftar Sambungan',
      description: 'Daftarkan sambungan air baru untuk rumah atau usaha Anda',
      icon: '🏠',
      path: '/daftar-sambungan',
      color: 'blue.50',
    },
    {
      title: 'Cek Tagihan',
      description: 'Lihat dan bayar tagihan air bulanan Anda dengan mudah',
      icon: '💰',
      path: '/cek-tagihan',
      color: 'green.50',
    },
    {
      title: 'Simulasi Tagihan',
      description: 'Hitung estimasi tagihan air berdasarkan pemakaian Anda',
      icon: '📊',
      path: '/simulasi-tagihan',
      color: 'purple.50',
    },
    {
      title: 'Pengaduan',
      description: 'Laporkan keluhan atau masalah terkait layanan air',
      icon: '📞',
      path: '/pengaduan',
      color: 'orange.50',
    },
  ];


  return (
    <Box w="100%">
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-br, brand.navy, #1e3a5f)"
        color="white"
        py={{ base: 8, md: 12, lg: 16 }}
        position="relative"
        overflow="hidden"
        w="100%"
        minH={{ base: '450px', md: '550px', lg: '600px' }}
        display="flex"
        alignItems="flex-start"
        pt={{ base: 8, md: 10, lg: 12 }}
      >

        {/* Floating water bubbles - Enhanced */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={`bubble-${i}`}
            position="absolute"
            bottom={`${10 + i * 12}%`}
            left={`${12 + i * 15}%`}
            w={{ base: '40px', md: '70px' }}
            h={{ base: '40px', md: '70px' }}
            borderRadius="full"
            bg={`rgba(255, 255, 255, ${0.15 + (i % 2) * 0.1})`}
            border="2px solid"
            borderColor="whiteAlpha.400"
            backdropFilter="blur(10px)"
            animation={`float ${3.5 + i}s ease-in-out infinite`}
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}

        {/* Rising bubbles from bottom */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={`rise-${i}`}
            position="absolute"
            bottom="0"
            left={`${20 + i * 18}%`}
            w={{ base: '15px', md: '25px' }}
            h={{ base: '15px', md: '25px' }}
            borderRadius="full"
            bg="whiteAlpha.400"
            animation={`bubbleRise ${4 + i * 0.8}s ease-in infinite`}
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}


        <Container maxW="container.xl" px={{ base: 4, sm: 6, md: 8 }} position="relative" zIndex={10}>
          <VStack gap={{ base: 6, md: 8 }} align="center" textAlign="center">
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              lineHeight={{ base: '1.3', md: '1.2' }}
              px={{ base: 2, md: 0 }}
              letterSpacing="-0.5px"
              color="gray.600"
            >
              Air Bersih untuk
              <Text
                as="span"
                color="brand.gold"
                display="block"
                mt={2}
              >
                Jawa Barat yang Lebih Baik
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
              maxW={{ base: '100%', sm: '90%', md: '2xl' }}
              lineHeight={{ base: '1.6', md: '1.7' }}
              px={{ base: 2, md: 0 }}
              fontWeight="500"
              color="gray.600"
            >
              Melayani lebih dari 800 ribu pelanggan di Jawa Barat dengan komitmen
              kualitas dan keberlanjutan layanan air bersih terpercaya
            </Text>

            {/* CTA Buttons */}
            <Box
              display="flex"
              gap={{ base: 3, md: 4 }}
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              mt={4}
              w="100%"
            >
              <RouterLink to="/daftar-sambungan">
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  bg="brand.gold"
                  color="brand.navy"
                  px={{ base: 6, md: 8 }}
                  py={{ base: 5, md: 6 }}
                  fontWeight="700"
                  fontSize={{ base: 'sm', md: 'md' }}
                  boxShadow="0 4px 20px rgba(184, 142, 47, 0.5)"
                  _hover={{
                    bg: '#9a7326',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(184, 142, 47, 0.7)'
                  }}
                  _active={{ transform: 'scale(0.98)' }}
                  transition="all 0.2s"
                >
                  Daftar Sekarang
                </Button>
              </RouterLink>
              <RouterLink to="/cek-tagihan">
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  variant="outline"
                  borderWidth="2px"
                  borderColor="brand.gold"
                  color="brand.gold"
                  bg="transparent"
                  px={{ base: 6, md: 8 }}
                  py={{ base: 5, md: 6 }}
                  fontWeight="700"
                  fontSize={{ base: 'sm', md: 'md' }}
                  _hover={{
                    bg: 'brand.gold',
                    color: 'brand.navy',
                    borderColor: 'brand.gold'
                  }}
                  _active={{ transform: 'scale(0.98)' }}
                  transition="all 0.2s"
                >
                  Cek Tagihan
                </Button>
              </RouterLink>
            </Box>
          </VStack>
        </Container>

        {/* Animated Wave decoration at bottom */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h={{ base: '100px', md: '140px', lg: '180px' }}
          overflow="hidden"
        >
          {/* Wave Layer 1 - Deep Blue */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="200%"
            h="100%"
            bg="#1a365d"
            opacity={0.8}
            animation="wave 10s linear infinite"
            style={{
              clipPath: 'polygon(0 30%, 10% 40%, 20% 35%, 30% 45%, 40% 40%, 50% 50%, 60% 45%, 70% 55%, 80% 50%, 90% 60%, 100% 55%, 100% 100%, 0 100%)',
            }}
          />
          {/* Wave Layer 2 - Medium Blue */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="200%"
            h="90%"
            bg="#2c5282"
            opacity={0.7}
            animation="wave 8s linear infinite"
            style={{
              clipPath: 'polygon(0 40%, 10% 50%, 20% 45%, 30% 55%, 40% 50%, 50% 60%, 60% 55%, 70% 65%, 80% 60%, 90% 70%, 100% 65%, 100% 100%, 0 100%)',
              animationDelay: '-2s',
            }}
          />
          {/* Wave Layer 3 - Light Blue */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="200%"
            h="80%"
            bg="#4299e1"
            opacity={0.6}
            animation="wave 12s linear infinite"
            style={{
              clipPath: 'polygon(0 50%, 10% 60%, 20% 55%, 30% 65%, 40% 60%, 50% 70%, 60% 65%, 70% 75%, 80% 70%, 90% 80%, 100% 75%, 100% 100%, 0 100%)',
              animationDelay: '-4s',
            }}
          />
          {/* Wave Layer 4 - Lightest Blue/White */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w="200%"
            h="70%"
            bgGradient="linear(to-r, #e0f2fe, #bfdbfe)"
            opacity={0.5}
            animation="wave 14s linear infinite"
            style={{
              clipPath: 'polygon(0 60%, 10% 70%, 20% 65%, 30% 75%, 40% 70%, 50% 80%, 60% 75%, 70% 85%, 80% 80%, 90% 90%, 100% 85%, 100% 100%, 0 100%)',
              animationDelay: '-6s',
            }}
          />
        </Box>
      </Box>

      {/* Services Section */}
      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack gap={{ base: 8, md: 12 }}>
          <VStack gap={4} textAlign="center">
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              color="brand.navy"
              fontWeight="bold"
            >
              Layanan Kami
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              maxW="2xl"
              lineHeight="1.7"
            >
              Kemudahan akses layanan air bersih untuk semua kebutuhan Anda
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={{ base: 6, md: 8 }}
            w="100%"
          >
            {services.map((service, index) => {
              // Determine animation direction: left cards go left, right cards go right
              const isLeftSide = index < 2;
              const hoverTransform = isLeftSide
                ? 'translateY(-16px) translateX(-8px) rotate(-2deg)'
                : 'translateY(-16px) translateX(8px) rotate(2deg)';

              return (
              <RouterLink key={index} to={service.path} style={{ textDecoration: 'none' }}>
                <Box
                  position="relative"
                  p={{ base: 4, md: 6 }}
                  cursor="pointer"
                  h="100%"
                  minH={{ base: '280px', md: '320px' }}
                  transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: hoverTransform,
                    '& .card-bg': {
                      transform: 'scale(1.05)',
                    },
                    '& .card-outline': {
                      opacity: 1,
                    },
                    '& .icon-wrapper': {
                      transform: 'scale(1.15) rotate(8deg)',
                      bg: 'brand.gold',
                    },
                    '& .wave-line': {
                      width: '100%',
                    },
                    '& .content-wrapper h2': {
                      color: 'brand.gold',
                    },
                  }}
                >
                  {/* Hexagon/Octagon shaped background */}
                  <Box
                    className="card-bg"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="white"
                    borderRadius="3xl"
                    transition="all 0.5s"
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      bgGradient: 'linear(135deg, brand.navy, #1e3a5f)',
                      opacity: 0.05,
                    }}
                  />

                  <Box
                    className="card-outline"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    transition="all 0.5s"
                    opacity={0}
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    }}
                    border="3px solid"
                    borderColor="brand.navy"
                    boxShadow="0 0 30px rgba(184, 142, 47, 0.5)"
                  />

                  <VStack
                    className="content-wrapper"
                    align="center"
                    gap={5}
                    position="relative"
                    zIndex={1}
                    h="100%"
                    justify="center"
                  >

                    <Box
                      className="icon-wrapper"
                      w="90px"
                      h="90px"
                      borderRadius="full"
                      bg="whiteAlpha.800"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="4xl"
                      transition="all 0.5s"
                      boxShadow="0 8px 20px rgba(184, 142, 47, 0.2)"
                      border="3px solid"
                      borderColor="brand.navy"
                    >
                      <Text>{service.icon}</Text>
                    </Box>

                    {/* Wave line decoration */}
                    <Box
                      className="wave-line"
                      h="3px"
                      w="50%"
                      bgGradient="linear(to-r, transparent, brand.gold, transparent)"
                      transition="all 0.5s"
                    />

                    <Heading
                      fontSize={{ base: 'xl', md: '2xl' }}
                      color="brand.navy"
                      fontWeight="700"
                      transition="all 0.3s"
                      textAlign="center"
                      px={2}
                    >
                      {service.title}
                    </Heading>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                      lineHeight="1.7"
                      transition="all 0.3s"
                      textAlign="center"
                      px={2}
                    >
                      {service.description}
                    </Text>

                    {/* Bottom accent dots */}
                    <Flex gap={2} mt="auto">
                      {[...Array(3)].map((_, i) => (
                        <Box
                          key={i}
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg="brand.navy"
                          opacity={0.3}
                          transition="all 0.3s"
                          style={{ transitionDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </Flex>
                  </VStack>
                </Box>
              </RouterLink>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Info Section */}
      <Box bg="brand.navy" color="white" py={{ base: 4, md: 8 }}>
        <Container maxW="container.xl" px={{ base: 4, sm: 6, md: 8 }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 12 }} alignItems="center">
            <VStack align={{ base: 'center', md: 'start' }} gap={4} textAlign={{ base: 'center', md: 'left' }}>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
                Tentang PDAM Jawa Barat
              </Heading>
              <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.8" color="whiteAlpha.900">
                Perusahaan Daerah Air Minum Jawa Barat adalah
                perusahaan milik Pemerintah Provinsi Jawa Barat yang bertanggung
                jawab atas penyediaan air minum bersih dan sehat untuk seluruh wilayah Jawa Barat.
              </Text>
              <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.8" color="whiteAlpha.900">
                Dengan komitmen tinggi terhadap kualitas dan keberlanjutan, kami
                terus berinovasi untuk memberikan layanan air bersih terbaik bagi masyarakat
                Jawa Barat yang lebih sejahtera.
              </Text>
            </VStack>
            <Box
              bg="whiteAlpha.100"
              p={{ base: 4, md: 6 }}
              borderRadius="2xl"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <VStack gap={4} align="start">
                <Heading fontSize={{ base: 'md', md: 'lg' }} color="brand.gold">
                  Hubungi Kami
                </Heading>
                <VStack align="start" gap={3} fontSize={{ base: 'sm', md: 'md' }}>
                  <Text>📍 Jl. Badaksinga No. 38, Bandung</Text>
                  <Text>📞 Call Center: 119 (24 Jam)</Text>
                  <Text>✉️ customer.care@pdamjabar.co.id</Text>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Beranda;
