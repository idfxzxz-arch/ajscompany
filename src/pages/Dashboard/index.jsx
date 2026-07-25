import { Users, ClipboardCheck, Briefcase, TrendingUp, Package, Truck, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, type, suffix = '' }) => {
  const isUMR = type === 'UMARATAX';
  const badgeClass = isUMR ? 'badge-umr' : (type === 'JNE' ? 'badge-jne' : 'badge-neutral');
  const iconClass = isUMR ? 'text-umr bg-umr-light' : (type === 'JNE' ? 'text-jne bg-jne-light' : 'text-primary bg-body');
  
  return (
    <div className="card stat-card">
      <div className="flex justify-between items-center mb-4">
        <span className={`badge ${badgeClass}`}>{type}</span>
        <div className={`icon-wrapper ${iconClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-sm text-secondary font-semibold">{title}</h3>
        <div className="text-2xl font-bold mt-1">
          {value} <span className="text-sm text-secondary font-normal">{suffix}</span>
        </div>
      </div>
    </div>
  );
};

const LiveIndicator = () => (
  <div className="live-indicator">
    <span className="live-dot"></span>
    <span className="text-sm font-semibold">LIVE</span>
  </div>
);

export default function Dashboard() {
  const stats = useRealtimeStats();

  return (
    <div className="dashboard">
      {/* 1. Ringkasan UMARATAX */}
      <section className="dashboard-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-umr" style={{ marginBottom: 0 }}>Ringkasan UMARATAX MANAGEMENT</h2>
          <LiveIndicator />
        </div>
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Karyawan" value={stats.umaratax.karyawan} icon={Users} type="UMARATAX" suffix="orang" />
          <StatCard title="Kehadiran Hari Ini" value={`${stats.umaratax.kehadiran}%`} icon={ClipboardCheck} type="UMARATAX" />
          <StatCard title="Tugas Selesai" value={`${stats.umaratax.tugasSelesai}/${stats.umaratax.totalTugas}`} icon={Briefcase} type="UMARATAX" />
          <StatCard title="Produktivitas" value={`${stats.umaratax.produktivitas}%`} icon={TrendingUp} type="UMARATAX" />
        </div>
      </section>

      {/* 2. Ringkasan JNE */}
      <section className="dashboard-section mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-jne" style={{ marginBottom: 0 }}>Ringkasan JNE MANAGEMENT</h2>
          <LiveIndicator />
        </div>
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Paket Masuk" value={stats.jne.paketMasuk.toLocaleString()} icon={Package} type="JNE" />
          <StatCard title="Total Paket Selesai" value={stats.jne.paketKeluar.toLocaleString()} icon={Package} type="JNE" />
          <StatCard title="Paket Pending/Proses" value={stats.jne.paketPending.toLocaleString()} icon={AlertCircle} type="JNE" />
          <StatCard title="Total Kurir" value={stats.jne.totalKurir} icon={Truck} type="JNE" suffix="orang" />
        </div>
      </section>

      {/* 3. Ringkasan Keseluruhan */}
      <section className="dashboard-section mt-8">
        <h2 className="section-title">Ringkasan Keseluruhan</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-sm text-secondary font-semibold">Total Seluruh Karyawan</h3>
            <div className="text-3xl font-bold mt-2">{stats.overall.totalKaryawan} <span className="text-sm font-normal">orang</span></div>
          </div>
          <div className="card text-center">
            <h3 className="text-sm text-secondary font-semibold">Best Employee UMARATAX</h3>
            <div className="text-xl font-bold mt-2 text-umr">{stats.overall.bestUmara} (UMR)</div>
          </div>
          <div className="card text-center">
            <h3 className="text-sm text-secondary font-semibold">Best Kurir JNE</h3>
            <div className="text-xl font-bold mt-2 text-jne">{stats.overall.bestJne} (JNE)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
