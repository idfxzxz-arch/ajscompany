import { Truck, Loader } from 'lucide-react';
import { useJneMonitoring } from '../../hooks/useJneMonitoring';

export default function MonitoringJne() {
  const { karyawan, loading, error } = useJneMonitoring();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="badge badge-jne">JNE MANAGEMENT</span>
        <div className="live-indicator" style={{ marginLeft: 'auto' }}>
          <span className="live-dot"></span>
          <span className="text-sm font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Truck className="text-jne" /> Aktivitas Kurir & Gudang
          <span className="text-sm text-secondary font-normal" style={{ marginLeft: 'auto' }}>
            {karyawan.length} karyawan
          </span>
        </h3>

        {loading ? (
          <div className="loading-container">
            <Loader size={20} />
            <span>Memuat data dari Supabase...</span>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p className="text-danger">Error: {error}</p>
          </div>
        ) : karyawan.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data karyawan JNE.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="py-2">ID</th>
                <th className="py-2">Nama</th>
                <th className="py-2">Posisi</th>
                <th className="py-2">Status</th>
                <th className="py-2">Paket Pending</th>
                <th className="py-2">Paket Selesai</th>
              </tr>
            </thead>
            <tbody>
              {karyawan.map((item) => (
                <tr key={item.rawId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="py-3"><span className="badge badge-jne">{item.id}</span></td>
                  <td className="py-3 font-semibold">{item.name}</td>
                  <td className="py-3 text-secondary">{item.role}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      item.status === 'Mengantar' ? 'bg-warning text-white' : 
                      item.status === 'Standby' ? 'bg-info text-white' :
                      item.status === 'Hadir' ? 'bg-success text-white' :
                      item.status === 'Terlambat' ? 'bg-warning text-white' :
                      'badge-neutral'
                    }`}>{item.status}</span>
                  </td>
                  <td className="py-3 font-bold text-danger">{item.pending}</td>
                  <td className="py-3 font-bold text-success">{item.done}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
