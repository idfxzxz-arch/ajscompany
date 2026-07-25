import { Download } from 'lucide-react';

export default function Laporan() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Laporan & Export Data</h2>
      <div className="card">
        <div className="flex gap-4 mb-6">
          <select className="border border-umr rounded p-2 text-sm" defaultValue="Semua">
            <option>Semua Entitas</option>
            <option>UMARATAX</option>
            <option>JNE</option>
          </select>
          <select className="border border-umr rounded p-2 text-sm" defaultValue="Bulan Ini">
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>Tahun Ini</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-body text-primary font-bold py-2 px-4 rounded border">
            <Download size={18} /> Export PDF
          </button>
          <button className="flex items-center gap-2 bg-success text-white font-bold py-2 px-4 rounded border-none">
            <Download size={18} /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
