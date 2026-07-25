import { useState, useEffect } from 'react';
import { supabaseJne } from '../services/supabase';
import { readTable, getValue } from '../services/databaseAdapter';

export function useJneMonitoring() {
  const [data, setData] = useState({ karyawan: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        const usersResponse = await readTable(supabaseJne, ['users', 'karyawan', 'employees'], { limit: 200 });
        const users = usersResponse.data || [];

        const absensiResponse = await readTable(supabaseJne, ['absensi', 'attendance', 'kehadiran'], { limit: 200 });
        const absensi = absensiResponse.data || [];

        const pengantaranResponse = await readTable(supabaseJne, ['pengantaran_gudang', 'deliveries', 'pengantaran'], { limit: 200 });
        const pengantaran = pengantaranResponse.data || [];

        const pengambilanResponse = await readTable(supabaseJne, ['pengambilan_paket', 'pickup_orders', 'pengambilan'], { limit: 200 });
        const pengambilan = pengambilanResponse.data || [];

        const karyawan = (users || []).map(user => {
          const userId = user.id;
          const userName = getValue(user, ['name', 'full_name', 'nama', 'employee_name']);
          const userRole = getValue(user, ['role', 'position', 'jabatan']);

          const abs = (absensi || []).find(entry => {
            const idValue = getValue(entry, ['karyawan_id', 'employee_id', 'user_id', 'id']);
            return String(idValue) === String(userId);
          }) || (absensi || []).find(entry => {
            const nameValue = getValue(entry, ['karyawan_name', 'name', 'nama', 'staff']);
            return nameValue === userName;
          });

          let status = 'Belum Hadir';
          if (abs) {
            status = getValue(abs, ['status', 'state', 'kehadiran'], 'Belum Hadir');
          }

          const userPengantaran = (pengantaran || []).filter(entry => {
            const kurirValue = getValue(entry, ['kurir_id', 'driver_id', 'user_id', 'karyawan_id']);
            return String(kurirValue) === String(userId);
          });

          const userPengambilan = (pengambilan || []).filter(entry => {
            const pengambilValue = getValue(entry, ['pengambil_id', 'picker_id', 'user_id', 'karyawan_id']);
            return String(pengambilValue) === String(userId);
          });

          const pendingCount = userPengantaran.filter(entry => {
            const statusValue = String(getValue(entry, ['status', 'state'], '')).toLowerCase();
            return statusValue === 'pending' || statusValue === 'proses' || statusValue === 'process' || statusValue === 'in_progress';
          }).length + userPengambilan.filter(entry => {
            const statusValue = String(getValue(entry, ['status', 'state'], '')).toLowerCase();
            return statusValue === 'pending';
          }).length;

          const doneCount = userPengantaran.filter(entry => {
            const statusValue = String(getValue(entry, ['status', 'state'], '')).toLowerCase();
            return statusValue === 'selesai' || statusValue === 'done' || statusValue === 'completed';
          }).length + userPengambilan.filter(entry => {
            const statusValue = String(getValue(entry, ['status', 'state'], '')).toLowerCase();
            return statusValue === 'diambil' || statusValue === 'taken' || statusValue === 'done' || statusValue === 'completed';
          }).length;

          const isKurir = String(userRole).toLowerCase().includes('kurir');
          const attendanceStatus = String(getValue(abs, ['status', 'state', 'kehadiran'], '')).toLowerCase();
          if (isKurir && attendanceStatus === 'hadir') {
            const hasActiveDelivery = userPengantaran.some(entry => {
              const statusValue = String(getValue(entry, ['status', 'state'], '')).toLowerCase();
              return statusValue === 'proses' || statusValue === 'process' || statusValue === 'in_progress';
            });
            status = hasActiveDelivery ? 'Mengantar' : 'Standby';
          }

          return {
            id: `JNE-${isKurir ? 'K' : 'G'}${String(userId).padStart(3, '0')}`,
            rawId: userId,
            name: userName || `Karyawan ${userId}`,
            role: isKurir ? 'Kurir' : (String(userRole).toLowerCase().includes('supervisor') ? 'Supervisor' : 'Petugas Gudang'),
            status,
            pending: isKurir ? pendingCount : '-',
            done: isKurir ? doneCount : '-'
          };
        });

        setData({ karyawan, loading: false, error: null });
      } catch (err) {
        console.error('Error fetching JNE monitoring data:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();

    const usersChannel = supabaseJne.channel('jne-monitoring-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchData)
      .subscribe();

    const absensiChannel = supabaseJne.channel('jne-monitoring-absensi')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'absensi' }, fetchData)
      .subscribe();

    const pengantaranChannel = supabaseJne.channel('jne-monitoring-pengantaran')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengantaran_gudang' }, fetchData)
      .subscribe();

    const pengambilanChannel = supabaseJne.channel('jne-monitoring-pengambilan')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengambilan_paket' }, fetchData)
      .subscribe();

    return () => {
      supabaseJne.removeChannel(usersChannel);
      supabaseJne.removeChannel(absensiChannel);
      supabaseJne.removeChannel(pengantaranChannel);
      supabaseJne.removeChannel(pengambilanChannel);
    };
  }, []);

  return data;
}
