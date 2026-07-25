export default function Notifikasi() {
  const notifs = [
    { type: 'UMARATAX', msg: 'Target Bulanan tercapai.', time: '10 menit lalu' },
    { type: 'JNE', msg: 'Pengiriman Hari Ini melebihi target.', time: '1 jam lalu' },
    { type: 'UMARATAX', msg: 'Produktivitas meningkat.', time: '2 jam lalu' },
    { type: 'JNE', msg: 'Kurir memperoleh point tambahan.', time: '1 hari lalu' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Notifikasi Sistem</h2>
      <div className="flex flex-col gap-4">
        {notifs.map((n, idx) => (
          <div key={idx} className="card flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
            <div className="flex items-center gap-4">
              <span className={`badge ${n.type === 'UMARATAX' ? 'badge-umr' : 'badge-jne'}`}>{n.type}</span>
              <span className="font-semibold">{n.msg}</span>
            </div>
            <span className="text-sm text-secondary">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
