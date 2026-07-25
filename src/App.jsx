import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MonitoringUmaratax from './pages/MonitoringUmaratax';
import MonitoringJne from './pages/MonitoringJne';
import PointKaryawan from './pages/PointKaryawan';
import Analytics from './pages/Analytics';
import PenilaianAkhirTahun from './pages/PenilaianAkhirTahun';
import Laporan from './pages/Laporan';
import Notifikasi from './pages/Notifikasi';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="monitoring/umaratax" element={<MonitoringUmaratax />} />
          <Route path="monitoring/jne" element={<MonitoringJne />} />
          <Route path="point" element={<PointKaryawan />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="penilaian" element={<PenilaianAkhirTahun />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="notifikasi" element={<Notifikasi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
