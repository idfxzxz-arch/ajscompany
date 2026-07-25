export default function PointKaryawan() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Point Karyawan</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Top Point UMARATAX</h3>
            <span className="badge badge-umr">UMARATAX</span>
          </div>
          <div className="flex justify-between py-2 border-b"><span className="font-semibold">Budi Santoso</span> <span className="font-bold text-umr">1,250 pt</span></div>
          <div className="flex justify-between py-2 border-b"><span className="font-semibold">Siti Aminah</span> <span className="font-bold text-umr">1,100 pt</span></div>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Top Point JNE</h3>
            <span className="badge badge-jne">JNE</span>
          </div>
          <div className="flex justify-between py-2 border-b"><span className="font-semibold">Ahmad Supriyadi</span> <span className="font-bold text-jne">1,450 pt</span></div>
          <div className="flex justify-between py-2 border-b"><span className="font-semibold">Rizky Maulana</span> <span className="font-bold text-jne">1,200 pt</span></div>
        </div>
      </div>
    </div>
  );
}
