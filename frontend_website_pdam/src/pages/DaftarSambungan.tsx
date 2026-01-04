import {
  Box,
  Heading,
  Container,
  Text,
  VStack,
  Input,
  Button,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pendaftaranService } from '../services/pendaftaran.service';
import { wilayahService, type Kota, type Kecamatan, type Kelurahan } from '../services/wilayah.service';
import SearchableSelect from '../components/SearchableSelect';

// Fix icon paths untuk Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DaftarSambungan = () => {
  const [formData, setFormData] = useState({
    namaCalon: '',
    hpCalon: '',
    emailCalon: '',
    kotaCalon: '',
    kotaCalonId: '',
    kecamatanCalon: '',
    kecamatanCalonId: '',
    kelurahanCalon: '',
    jalanCalon: '',
    noRumahCalon: '',
    rtCalon: '',
    rwCalon: '',
    samaDenganCalon: false,
    namaPJ: '',
    hpPJ: '',
    emailPJ: '',
    kotaPJ: '',
    kotaPJId: '',
    kecamatanPJ: '',
    kecamatanPJId: '',
    kelurahanPJ: '',
    jalanPJ: '',
    noRumahPJ: '',
    rtPJ: '',
    rwPJ: '',
    kebutuhanAir: '',
    ketersediaanTangki: '',
    kategoriBangunan: '',
    peruntukanBangunan: '',
    lokasiLat: -6.5971,
    lokasiLng: 106.8060,
    ktpCalon: null as File | null,
    kkCalon: null as File | null,
    pbb: null as File | null,
    fotoBangunan: null as File | null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Refs untuk file inputs
  const ktpFileRef = useRef<HTMLInputElement>(null);
  const kkFileRef = useRef<HTMLInputElement>(null);
  const pbbFileRef = useRef<HTMLInputElement>(null);
  const fotoBangunanFileRef = useRef<HTMLInputElement>(null);

  // Data wilayah Jawa Barat dari API
  const [kotaList, setKotaList] = useState<Kota[]>([]);
  const [kecamatanListCalon, setKecamatanListCalon] = useState<Kecamatan[]>([]);
  const [kelurahanListCalon, setKelurahanListCalon] = useState<Kelurahan[]>([]);
  const [kecamatanListPJ, setKecamatanListPJ] = useState<Kecamatan[]>([]);
  const [kelurahanListPJ, setKelurahanListPJ] = useState<Kelurahan[]>([]);

  // Loading states
  const [isLoadingKota, setIsLoadingKota] = useState(false);
  const [isLoadingKecamatanCalon, setIsLoadingKecamatanCalon] = useState(false);
  const [isLoadingKelurahanCalon, setIsLoadingKelurahanCalon] = useState(false);
  const [isLoadingKecamatanPJ, setIsLoadingKecamatanPJ] = useState(false);
  const [isLoadingKelurahanPJ, setIsLoadingKelurahanPJ] = useState(false);

  const kategoriBangunanList = ['Rumah Tinggal', 'Ruko', 'Gedung', 'Apartemen', 'Kantor'];
  const peruntukanBangunanList = ['Tempat Tinggal', 'Usaha', 'Industri', 'Sosial'];

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    backgroundColor: '#F9FAFB',
    fontSize: '16px',
    height: '44px',
  };

  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#2A4D88';
    e.target.style.outline = 'none';
    e.target.style.boxShadow = '0 0 0 1px #2A4D88';
  };

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#D1D5DB';
    e.target.style.boxShadow = 'none';
  };

  // Load data kota Jawa Barat saat component mount
  useEffect(() => {
    const loadKotaJawaBarat = async () => {
      setIsLoadingKota(true);
      // ID Provinsi Jawa Barat = 32
      const data = await wilayahService.getKota('32');
      setKotaList(data);
      setIsLoadingKota(false);
    };
    loadKotaJawaBarat();
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [formData.lokasiLat, formData.lokasiLng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markerRef.current = L.marker([formData.lokasiLat, formData.lokasiLng], {
        draggable: true,
      }).addTo(mapInstanceRef.current);

      markerRef.current.on('dragend', (e: L.DragEndEvent) => {
        const position = e.target.getLatLng();
        setFormData(prev => ({
          ...prev,
          lokasiLat: position.lat,
          lokasiLng: position.lng,
        }));
      });

      mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        setFormData(prev => ({
          ...prev,
          lokasiLat: lat,
          lokasiLng: lng,
        }));
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setFormData(prev => ({
          ...prev,
          lokasiLat: newLat,
          lokasiLng: newLng,
        }));

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 15);
          markerRef.current.setLatLng([newLat, newLng]);
        }
      } else {
        alert('Lokasi tidak ditemukan. Silakan coba kata kunci lain.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Terjadi kesalahan saat mencari lokasi.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk Kota Calon Pelanggan
  const handleKotaCalonChange = async (kotaId: string) => {
    const selectedKota = kotaList.find(k => k.id === kotaId);

    setFormData(prev => ({
      ...prev,
      kotaCalonId: kotaId,
      kotaCalon: selectedKota?.name || '',
      kecamatanCalonId: '',
      kecamatanCalon: '',
      kelurahanCalon: '',
    }));

    if (kotaId) {
      setIsLoadingKecamatanCalon(true);
      const data = await wilayahService.getKecamatan(kotaId);
      setKecamatanListCalon(data);
      setIsLoadingKecamatanCalon(false);
    } else {
      setKecamatanListCalon([]);
    }
    setKelurahanListCalon([]);
  };

  // Handler untuk Kecamatan Calon Pelanggan
  const handleKecamatanCalonChange = async (kecamatanId: string) => {
    const selectedKecamatan = kecamatanListCalon.find(k => k.id === kecamatanId);

    setFormData(prev => ({
      ...prev,
      kecamatanCalonId: kecamatanId,
      kecamatanCalon: selectedKecamatan?.name || '',
      kelurahanCalon: '',
    }));

    if (kecamatanId) {
      setIsLoadingKelurahanCalon(true);
      const data = await wilayahService.getKelurahan(kecamatanId);
      setKelurahanListCalon(data);
      setIsLoadingKelurahanCalon(false);
    } else {
      setKelurahanListCalon([]);
    }
  };

  // Handler untuk Kelurahan Calon Pelanggan
  const handleKelurahanCalonChange = (kelurahanNama: string) => {
    setFormData(prev => ({
      ...prev,
      kelurahanCalon: kelurahanNama,
    }));
  };

  // Handler untuk Kota Penanggung Jawab
  const handleKotaPJChange = async (kotaId: string) => {
    const selectedKota = kotaList.find(k => k.id === kotaId);

    setFormData(prev => ({
      ...prev,
      kotaPJId: kotaId,
      kotaPJ: selectedKota?.name || '',
      kecamatanPJId: '',
      kecamatanPJ: '',
      kelurahanPJ: '',
    }));

    if (kotaId) {
      setIsLoadingKecamatanPJ(true);
      const data = await wilayahService.getKecamatan(kotaId);
      setKecamatanListPJ(data);
      setIsLoadingKecamatanPJ(false);
    } else {
      setKecamatanListPJ([]);
    }
    setKelurahanListPJ([]);
  };

  // Handler untuk Kecamatan Penanggung Jawab
  const handleKecamatanPJChange = async (kecamatanId: string) => {
    const selectedKecamatan = kecamatanListPJ.find(k => k.id === kecamatanId);

    setFormData(prev => ({
      ...prev,
      kecamatanPJId: kecamatanId,
      kecamatanPJ: selectedKecamatan?.name || '',
      kelurahanPJ: '',
    }));

    if (kecamatanId) {
      setIsLoadingKelurahanPJ(true);
      const data = await wilayahService.getKelurahan(kecamatanId);
      setKelurahanListPJ(data);
      setIsLoadingKelurahanPJ(false);
    } else {
      setKelurahanListPJ([]);
    }
  };

  // Handler untuk Kelurahan Penanggung Jawab
  const handleKelurahanPJChange = (kelurahanNama: string) => {
    setFormData(prev => ({
      ...prev,
      kelurahanPJ: kelurahanNama,
    }));
  };

  const handleCheckboxChange = async (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      samaDenganCalon: checked,
      ...(checked ? {
        namaPJ: prev.namaCalon,
        hpPJ: prev.hpCalon,
        emailPJ: prev.emailCalon,
        kotaPJId: prev.kotaCalonId,
        kotaPJ: prev.kotaCalon,
        kecamatanPJId: prev.kecamatanCalonId,
        kecamatanPJ: prev.kecamatanCalon,
        kelurahanPJ: prev.kelurahanCalon,
        jalanPJ: prev.jalanCalon,
        noRumahPJ: prev.noRumahCalon,
        rtPJ: prev.rtCalon,
        rwPJ: prev.rwCalon,
      } : {})
    }));

    // Load kecamatan dan kelurahan untuk PJ jika checkbox dicentang
    if (checked && formData.kotaCalonId) {
      setIsLoadingKecamatanPJ(true);
      const kecamatanData = await wilayahService.getKecamatan(formData.kotaCalonId);
      setKecamatanListPJ(kecamatanData);
      setIsLoadingKecamatanPJ(false);

      if (formData.kecamatanCalonId) {
        setIsLoadingKelurahanPJ(true);
        const kelurahanData = await wilayahService.getKelurahan(formData.kecamatanCalonId);
        setKelurahanListPJ(kelurahanData);
        setIsLoadingKelurahanPJ(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add text fields
      submitData.append('namaCalon', formData.namaCalon);
      submitData.append('hpCalon', formData.hpCalon);
      submitData.append('emailCalon', formData.emailCalon);
      submitData.append('kotaCalon', formData.kotaCalon);
      submitData.append('kecamatanCalon', formData.kecamatanCalon);
      submitData.append('kelurahanCalon', formData.kelurahanCalon);
      submitData.append('jalanCalon', formData.jalanCalon);
      submitData.append('noRumahCalon', formData.noRumahCalon);
      submitData.append('rtCalon', formData.rtCalon);
      submitData.append('rwCalon', formData.rwCalon);

      submitData.append('namaPJ', formData.namaPJ);
      submitData.append('hpPJ', formData.hpPJ);
      submitData.append('emailPJ', formData.emailPJ);
      submitData.append('kotaPJ', formData.kotaPJ);
      submitData.append('kecamatanPJ', formData.kecamatanPJ);
      submitData.append('kelurahanPJ', formData.kelurahanPJ);
      submitData.append('jalanPJ', formData.jalanPJ);
      submitData.append('noRumahPJ', formData.noRumahPJ);
      submitData.append('rtPJ', formData.rtPJ);
      submitData.append('rwPJ', formData.rwPJ);

      submitData.append('kebutuhanAir', formData.kebutuhanAir);
      submitData.append('ketersediaanTangki', formData.ketersediaanTangki);
      submitData.append('kategoriBangunan', formData.kategoriBangunan);
      submitData.append('peruntukanBangunan', formData.peruntukanBangunan);
      submitData.append('lokasiLat', formData.lokasiLat.toString());
      submitData.append('lokasiLng', formData.lokasiLng.toString());

      // Add files if they exist
      if (formData.ktpCalon) submitData.append('ktpCalon', formData.ktpCalon);
      if (formData.kkCalon) submitData.append('kartuKeluarga', formData.kkCalon);
      if (formData.pbb) submitData.append('pbb', formData.pbb);
      if (formData.fotoBangunan) submitData.append('fotoBangunan', formData.fotoBangunan);

      // Submit to API
      await pendaftaranService.create(submitData);

      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form
      setFormData({
        namaCalon: '',
        hpCalon: '',
        emailCalon: '',
        kotaCalon: '',
        kotaCalonId: '',
        kecamatanCalon: '',
        kecamatanCalonId: '',
        kelurahanCalon: '',
        jalanCalon: '',
        noRumahCalon: '',
        rtCalon: '',
        rwCalon: '',
        samaDenganCalon: false,
        namaPJ: '',
        hpPJ: '',
        emailPJ: '',
        kotaPJ: '',
        kotaPJId: '',
        kecamatanPJ: '',
        kecamatanPJId: '',
        kelurahanPJ: '',
        jalanPJ: '',
        noRumahPJ: '',
        rtPJ: '',
        rwPJ: '',
        kebutuhanAir: '',
        ketersediaanTangki: '',
        kategoriBangunan: '',
        peruntukanBangunan: '',
        lokasiLat: -6.5971,
        lokasiLng: 106.8060,
        ktpCalon: null,
        kkCalon: null,
        pbb: null,
        fotoBangunan: null,
      });

      // Reset file inputs secara manual
      if (ktpFileRef.current) ktpFileRef.current.value = '';
      if (kkFileRef.current) kkFileRef.current.value = '';
      if (pbbFileRef.current) pbbFileRef.current.value = '';
      if (fotoBangunanFileRef.current) fotoBangunanFileRef.current.value = '';

      // Reset dropdown wilayah
      setKecamatanListCalon([]);
      setKelurahanListCalon([]);
      setKecamatanListPJ([]);
      setKelurahanListPJ([]);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting pendaftaran:', error);
      alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 4, md: 6 }}>
      <Container maxW="container.lg" px={{ base: 4, md: 6 }}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          boxShadow="md"
        >
          <VStack gap={2} textAlign="center" mb={6}>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color="brand.navy" fontWeight="bold">
              Daftar Sambungan Baru
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              Silahkan Isi Form Pendaftaran Sambungan Baru
            </Text>
          </VStack>
          
          <VStack gap={6} align="stretch">
            {/* Data Calon Pelanggan */}
            <Box>
              <Heading
                fontSize={{ base: 'md', md: 'lg' }}
                color="brand.navy"
                mb={4}
                pb={2}
                borderBottom="2px solid"
                borderColor="brand.gold"
              >
                Data Calon Pelanggan
              </Heading>

              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Nama Calon Pelanggan <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    name="namaCalon"
                    value={formData.namaCalon}
                    onChange={handleInputChange}
                    placeholder="Input Nama Calon Pelanggan"
                    size="lg"
                    px={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      No Handphone <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="hpCalon"
                      value={formData.hpCalon}
                      onChange={handleInputChange}
                      placeholder="+62 Input No Handphone"
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

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Email <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="emailCalon"
                      value={formData.emailCalon}
                      onChange={handleInputChange}
                      placeholder="Input Email"
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
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <SearchableSelect
                    label="Kota/Kabupaten"
                    placeholder="Pilih Kota/Kabupaten"
                    options={kotaList.map(k => ({ value: k.id, label: k.name }))}
                    value={formData.kotaCalonId}
                    onChange={handleKotaCalonChange}
                    isRequired
                    isLoading={isLoadingKota}
                  />

                  <SearchableSelect
                    label="Kecamatan"
                    placeholder="Pilih Kecamatan"
                    options={kecamatanListCalon.map(kec => ({ value: kec.id, label: kec.name }))}
                    value={formData.kecamatanCalonId}
                    onChange={handleKecamatanCalonChange}
                    isRequired
                    isDisabled={!formData.kotaCalonId}
                    isLoading={isLoadingKecamatanCalon}
                  />

                  <SearchableSelect
                    label="Kelurahan"
                    placeholder="Pilih Kelurahan"
                    options={kelurahanListCalon.map(kel => ({ value: kel.name, label: kel.name }))}
                    value={formData.kelurahanCalon}
                    onChange={handleKelurahanCalonChange}
                    isRequired
                    isDisabled={!formData.kecamatanCalonId}
                    isLoading={isLoadingKelurahanCalon}
                  />
                </SimpleGrid>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Jalan <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    name="jalanCalon"
                    value={formData.jalanCalon}
                    onChange={handleInputChange}
                    placeholder="Input Jalan"
                    size="lg"
                    px={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      No. Rumah <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="noRumahCalon"
                      value={formData.noRumahCalon}
                      onChange={handleInputChange}
                      placeholder="Input No. Rumah"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      RT <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="rtCalon"
                      value={formData.rtCalon}
                      onChange={handleInputChange}
                      placeholder="Input RT"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      RW <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="rwCalon"
                      value={formData.rwCalon}
                      onChange={handleInputChange}
                      placeholder="Input RW"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      required
                    />
                  </Box>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Data Penanggung Jawab */}
            <Box>
              <Heading
                fontSize={{ base: 'md', md: 'lg' }}
                color="brand.navy"
                mb={4}
                pb={2}
                borderBottom="2px solid"
                borderColor="brand.gold"
              >
                Data Penanggung Jawab
              </Heading>

              <Box
                as="label"
                display="flex"
                alignItems="center"
                gap={3}
                cursor="pointer"
                mb={4}
                p={3}
                borderRadius="md"
                border="2px solid"
                borderColor={formData.samaDenganCalon ? 'brand.navy' : 'gray.300'}
                bg={formData.samaDenganCalon ? 'blue.50' : 'white'}
                transition="all 0.2s"
                _hover={{ borderColor: 'brand.navy', bg: 'blue.50' }}
              >
                <input
                  type="checkbox"
                  checked={formData.samaDenganCalon}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <Text fontSize="sm" fontWeight="500">
                  Sama dengan Calon Pelanggan
                </Text>
              </Box>

              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Nama Penanggung Jawab <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    name="namaPJ"
                    value={formData.namaPJ}
                    onChange={handleInputChange}
                    placeholder="Input Nama Penanggung Jawab"
                    size="lg"
                    px={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    disabled={formData.samaDenganCalon}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      No Handphone <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="hpPJ"
                      value={formData.hpPJ}
                      onChange={handleInputChange}
                      placeholder="+62 Input No Handphone"
                      type="tel"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      disabled={formData.samaDenganCalon}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Email <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="emailPJ"
                      value={formData.emailPJ}
                      onChange={handleInputChange}
                      placeholder="Input Email"
                      type="email"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      disabled={formData.samaDenganCalon}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <SearchableSelect
                    label="Kota/Kabupaten"
                    placeholder="Pilih Kota/Kabupaten"
                    options={kotaList.map(k => ({ value: k.id, label: k.name }))}
                    value={formData.kotaPJId}
                    onChange={handleKotaPJChange}
                    isRequired
                    isDisabled={formData.samaDenganCalon}
                    isLoading={isLoadingKota}
                  />

                  <SearchableSelect
                    label="Kecamatan"
                    placeholder="Pilih Kecamatan"
                    options={kecamatanListPJ.map(kec => ({ value: kec.id, label: kec.name }))}
                    value={formData.kecamatanPJId}
                    onChange={handleKecamatanPJChange}
                    isRequired
                    isDisabled={formData.samaDenganCalon || !formData.kotaPJId}
                    isLoading={isLoadingKecamatanPJ}
                  />

                  <SearchableSelect
                    label="Kelurahan"
                    placeholder="Pilih Kelurahan"
                    options={kelurahanListPJ.map(kel => ({ value: kel.name, label: kel.name }))}
                    value={formData.kelurahanPJ}
                    onChange={handleKelurahanPJChange}
                    isRequired
                    isDisabled={formData.samaDenganCalon || !formData.kecamatanPJId}
                    isLoading={isLoadingKelurahanPJ}
                  />
                </SimpleGrid>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Jalan <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    name="jalanPJ"
                    value={formData.jalanPJ}
                    onChange={handleInputChange}
                    placeholder="Input Jalan"
                    size="lg"
                    px={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    disabled={formData.samaDenganCalon}
                    required
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      No. Rumah <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="noRumahPJ"
                      value={formData.noRumahPJ}
                      onChange={handleInputChange}
                      placeholder="Input No. Rumah"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      disabled={formData.samaDenganCalon}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      RT <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="rtPJ"
                      value={formData.rtPJ}
                      onChange={handleInputChange}
                      placeholder="Input RT"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      disabled={formData.samaDenganCalon}
                      required
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      RW <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      name="rwPJ"
                      value={formData.rwPJ}
                      onChange={handleInputChange}
                      placeholder="Input RW"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                      disabled={formData.samaDenganCalon}
                      required
                    />
                  </Box>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Detail Bangunan */}
            <Box>
              <Heading
                fontSize={{ base: 'md', md: 'lg' }}
                color="brand.navy"
                mb={4}
                pb={2}
                borderBottom="2px solid"
                borderColor="brand.gold"
              >
                Detail Bangunan & Kebutuhan
              </Heading>

              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Kebutuhan Air <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Stack direction="row" gap={6}>
                    <Box
                      as="label"
                      cursor="pointer"
                      px={4}
                      py={2}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={formData.kebutuhanAir === '≤500m3' ? 'brand.navy' : 'gray.300'}
                      bg={formData.kebutuhanAir === '≤500m3' ? 'blue.50' : 'white'}
                      transition="all 0.2s"
                    >
                      <input
                        type="radio"
                        name="kebutuhanAir"
                        value="≤500m3"
                        checked={formData.kebutuhanAir === '≤500m3'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      ≤ 500m³
                    </Box>
                    <Box
                      as="label"
                      cursor="pointer"
                      px={4}
                      py={2}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={formData.kebutuhanAir === '>500m3' ? 'brand.navy' : 'gray.300'}
                      bg={formData.kebutuhanAir === '>500m3' ? 'blue.50' : 'white'}
                      transition="all 0.2s"
                    >
                      <input
                        type="radio"
                        name="kebutuhanAir"
                        value=">500m3"
                        checked={formData.kebutuhanAir === '>500m3'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      &gt; 500m³
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Ketersediaan Tangki <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Stack direction="row" gap={6}>
                    <Box
                      as="label"
                      cursor="pointer"
                      px={4}
                      py={2}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={formData.ketersediaanTangki === 'Ya' ? 'brand.navy' : 'gray.300'}
                      bg={formData.ketersediaanTangki === 'Ya' ? 'blue.50' : 'white'}
                      transition="all 0.2s"
                    >
                      <input
                        type="radio"
                        name="ketersediaanTangki"
                        value="Ya"
                        checked={formData.ketersediaanTangki === 'Ya'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      Ya
                    </Box>
                    <Box
                      as="label"
                      cursor="pointer"
                      px={4}
                      py={2}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={formData.ketersediaanTangki === 'Tidak' ? 'brand.navy' : 'gray.300'}
                      bg={formData.ketersediaanTangki === 'Tidak' ? 'blue.50' : 'white'}
                      transition="all 0.2s"
                    >
                      <input
                        type="radio"
                        name="ketersediaanTangki"
                        value="Tidak"
                        checked={formData.ketersediaanTangki === 'Tidak'}
                        onChange={handleInputChange}
                        style={{ marginRight: '8px' }}
                      />
                      Tidak
                    </Box>
                  </Stack>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Kategori Bangunan <Text as="span" color="red.500">*</Text>
                    </Text>
                    <select
                      name="kategoriBangunan"
                      value={formData.kategoriBangunan}
                      onChange={handleInputChange}
                      style={selectStyle}
                      onFocus={handleSelectFocus}
                      onBlur={handleSelectBlur}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriBangunanList.map(kat => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Peruntukan Bangunan <Text as="span" color="red.500">*</Text>
                    </Text>
                    <select
                      name="peruntukanBangunan"
                      value={formData.peruntukanBangunan}
                      onChange={handleInputChange}
                      style={selectStyle}
                      onFocus={handleSelectFocus}
                      onBlur={handleSelectBlur}
                      required
                    >
                      <option value="">Pilih Peruntukan</option>
                      {peruntukanBangunanList.map(per => (
                        <option key={per} value={per}>{per}</option>
                      ))}
                    </select>
                  </Box>
                </SimpleGrid>

                {/* Peta Leaflet */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Titik Lokasi Bangunan <Text as="span" color="red.500">*</Text>
                  </Text>
                  
                  <Stack direction="row" gap={2} mb={3}>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      placeholder="Cari Lokasi (contoh: Bogor, Indonesia)"
                      size="lg"
                      px={4}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    />
                    <Button
                      onClick={handleSearch}
                      bg="brand.navy"
                      color="white"
                      size="lg"
                      px={6}
                      _hover={{ bg: '#1e3a5f' }}
                    >
                      Cari
                    </Button>
                  </Stack>

                  <Box
                    ref={mapRef}
                    h="400px"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.300"
                    overflow="hidden"
                    mb={3}
                  />

                  <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm" color="gray.700">
                    <Text fontWeight="600" mb={1}>Koordinat Terpilih:</Text>
                    <Text>Latitude: {formData.lokasiLat.toFixed(6)}</Text>
                    <Text>Longitude: {formData.lokasiLng.toFixed(6)}</Text>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      💡 Klik pada peta atau drag marker untuk memilih lokasi
                    </Text>
                  </Box>
                </Box>
              </VStack>
            </Box>

            {/* Upload Dokumen */}
            <Box>
              <Heading
                fontSize={{ base: 'lg', md: 'xl' }}
                color="brand.navy"
                mb={6}
                pb={3}
                borderBottom="2px solid"
                borderColor="brand.gold"
              >
                Upload Dokumen
              </Heading>

              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Fotocopy KTP <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    ref={ktpFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, 'ktpCalon')}
                    p={2}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    required
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    File: jpeg, png, jpg. Max: 2MB
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Fotocopy KK <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    ref={kkFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, 'kkCalon')}
                    p={2}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    required
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    File: jpeg, png, jpg. Max: 2MB
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Fotocopy PBB
                  </Text>
                  <Input
                    ref={pbbFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, 'pbb')}
                    p={2}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    File: jpeg, png, jpg. Max: 2MB
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Foto Bangunan <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    ref={fotoBangunanFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, 'fotoBangunan')}
                    p={2}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'brand.navy', boxShadow: '0 0 0 1px #2A4D88' }}
                    required
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    File: jpeg, png, jpg. Max: 2MB
                  </Text>
                </Box>
              </VStack>
            </Box>

            {/* Submit Button */}
            <Box pt={4}>
              <Button
                type="submit"
                w="full"
                size="lg"
                bg="brand.navy"
                color="white"
                fontWeight="700"
                _hover={{
                  bg: '#1e3a5f',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                _active={{ transform: 'scale(0.98)' }}
                transition="all 0.2s"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </Button>
            </Box>
          </VStack>
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
                  Pendaftaran Berhasil Dikirim!
                </Heading>

                <Text fontSize="sm" color="gray.700" textAlign="center" px={2}>
                  Terima kasih atas pendaftaran Anda. Tim kami akan menghubungi Anda melalui WhatsApp
                  dalam waktu 1x24 jam untuk proses selanjutnya.
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

export default DaftarSambungan;