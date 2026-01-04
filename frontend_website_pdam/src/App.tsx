import { Box } from '@chakra-ui/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin';
import Beranda from './pages/Beranda';
import DaftarSambungan from './pages/DaftarSambungan';
import CekTagihan from './pages/CekTagihan';
import SimulasiTagihan from './pages/SimulasiTagihan';
import Pengaduan from './pages/Pengaduan';

// Admin pages
import AdminLogin from './pages_admin/Login';
import AdminDaftarSambungan from './pages_admin/DaftarSambungan';
import AdminPengaduan from './pages_admin/Pengaduan';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLoginRoute = location.pathname === '/admin/login';

  return (
    <Box minH="100vh" bg="white">
      {/* Show Navbar for non-admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Show NavbarAdmin for admin routes except login */}
      {isAdminRoute && !isAdminLoginRoute && <NavbarAdmin />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Beranda />} />
        <Route path="/daftar-sambungan" element={<DaftarSambungan />} />
        <Route path="/cek-tagihan" element={<CekTagihan />} />
        <Route path="/simulasi-tagihan" element={<SimulasiTagihan />} />
        <Route path="/pengaduan" element={<Pengaduan />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/daftar-sambungan" element={<AdminDaftarSambungan />} />
        <Route path="/admin/pengaduan" element={<AdminPengaduan />} />
      </Routes>
    </Box>
  );
}

export default App;
