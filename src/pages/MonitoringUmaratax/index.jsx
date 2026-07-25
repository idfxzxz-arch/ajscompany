import { Building2, Loader } from 'lucide-react';
import { useUmaraMonitoring } from '../../hooks/useUmaraMonitoring';

export default function MonitoringUmaratax() {
  const { karyawan, loading, error } = useUmaraMonitoring();

  const getRoleLabel = (role) => {
    const map = {
      developer: 'Developer',
      manager: 'Manager',
      staff: 'Staff',
      staff_magang: 'Staff Magang'
    };
    return map[role] || role;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="badge badge-umr">UMARATAX MANAGEMENT</span>
        <div className="live-indicator" style={{ marginLeft: 'auto' }}>
          <span className="live-dot"></span>
          <span className="text-sm font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Building2 className="text-umr" /> Aktivitas & Kehadiran Karyawan
          <span className="text-sm text-secondary font-normal" style={{ marginLeft: 'auto' }}>
            {karyawan.length} karyawan aktif
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
            <p>Belum ada data karyawan.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="py-2">Nama</th>
                <th className="py-2">Posisi</th>
                <th className="py-2">Status Hari Ini</th>
                <th className="py-2">Tugas (Selesai/Total)</th>
                <th className="py-2">Produktivitas</th>
                <th className="py-2">Poin</th>
              </tr>
            </thead>
            <tbody>
              {karyawan.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="py-3 font-semibold">{item.name}</td>
                  <td className="py-3 text-secondary">{getRoleLabel(item.role)}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      item.status === 'Hadir' || item.status === 'Remote' ? 'bg-success text-white' : 
                      item.status === 'Terlambat' ? 'bg-warning text-white' :
                      item.status === 'Izin' ? 'bg-info text-white' :
                      'badge-neutral'
                    }`}>{item.status}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold">{item.doneTasks}/{item.totalTasks}</span>
                    {item.totalTasks > 0 && (
                      <div style={{ 
                        width: '80px', height: '6px', backgroundColor: 'var(--border-color)', 
                        borderRadius: '3px', marginTop: '4px', overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${item.taskProgress}%`, height: '100%', 
                          backgroundColor: 'var(--umr-primary)', borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                  </td>
                  <td className="py-3 font-bold text-umr">{item.prod}</td>
                  <td className="py-3 font-bold">{item.points} pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
