export default function PenilaianAkhirTahun() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Penilaian Akhir Tahun</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-umr">🏆 Best Employee UMARATAX</h3>
          <div className="text-2xl font-bold">Siti Aminah</div>
          <p className="text-secondary mt-2">Kategori: Highest Productivity</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-jne">🏆 Best Kurir JNE</h3>
          <div className="text-2xl font-bold">Ahmad Supriyadi</div>
          <p className="text-secondary mt-2">Kategori: Highest Delivery</p>
        </div>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="text-lg font-bold mb-4">⭐ Employee of The Year (Overall)</h3>
          <div className="text-3xl font-bold text-center py-4">Budi Santoso <span className="badge badge-umr text-lg align-middle">UMARATAX</span></div>
        </div>
      </div>
    </div>
  );
}
