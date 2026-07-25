import { useState, useEffect } from 'react';
import { supabaseUmara, supabaseJne } from '../services/supabase';

export function useRealtimeStats() {
  const [stats, setStats] = useState({
    umaratax: { karyawan: 0, kehadiran: 0, tugasSelesai: 0, totalTugas: 0, produktivitas: 0 },
    jne: { paketMasuk: 0, paketKeluar: 0, paketPending: 0, paketBerhasil: 0, totalKurir: 0, totalKaryawan: 0 },
    overall: { totalKaryawan: 0, bestUmara: '-', bestJne: '-' }
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      // ===== UMARA STATS =====
      const { count: umaraKaryawan } = await supabaseUmara
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: totalTugas } = await supabaseUmara
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      const { count: tugasSelesai } = await supabaseUmara
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done');

      // Kehadiran hari ini
      const today = new Date().toISOString().split('T')[0];
      const { count: kehadiranHariIni } = await supabaseUmara
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .in('status', ['Hadir', 'Remote']);

      const produktivitas = totalTugas > 0
        ? Math.round((tugasSelesai / totalTugas) * 100)
        : 0;

      const kehadiranPersen = umaraKaryawan > 0
        ? Math.round((kehadiranHariIni / umaraKaryawan) * 100)
        : 0;

      // ===== JNE STATS =====
      const { count: jneKaryawan } = await supabaseJne
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: totalKurir } = await supabaseJne
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'Kurir');

      // Pengantaran gudang (paket masuk = semua, keluar = selesai, pending, berhasil)
      const { count: paketMasuk } = await supabaseJne
        .from('pengantaran_gudang')
        .select('*', { count: 'exact', head: true });

      const { count: paketKeluar } = await supabaseJne
        .from('pengantaran_gudang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Selesai');

      const { count: paketPending } = await supabaseJne
        .from('pengantaran_gudang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      const { count: paketProses } = await supabaseJne
        .from('pengantaran_gudang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Proses');

      // ===== BEST EMPLOYEES =====
      const { data: bestUmaraData } = await supabaseUmara
        .from('users')
        .select('name')
        .eq('status', 'active')
        .order('points', { ascending: false })
        .limit(1);

      const { data: bestJneData } = await supabaseJne
        .from('poin_karyawan')
        .select('karyawan_id, total_poin')
        .order('total_poin', { ascending: false })
        .limit(1);

      let bestJneName = '-';
      if (bestJneData && bestJneData.length > 0) {
        const { data: jneUser } = await supabaseJne
          .from('users')
          .select('name')
          .eq('id', bestJneData[0].karyawan_id)
          .single();
        bestJneName = jneUser?.name || '-';
      }

      setStats({
        umaratax: {
          karyawan: umaraKaryawan || 0,
          kehadiran: kehadiranPersen,
          tugasSelesai: tugasSelesai || 0,
          totalTugas: totalTugas || 0,
          produktivitas
        },
        jne: {
          paketMasuk: paketMasuk || 0,
          paketKeluar: paketKeluar || 0,
          paketPending: (paketPending || 0) + (paketProses || 0),
          paketBerhasil: paketKeluar || 0,
          totalKurir: totalKurir || 0,
          totalKaryawan: jneKaryawan || 0
        },
        overall: {
          totalKaryawan: (umaraKaryawan || 0) + (jneKaryawan || 0),
          bestUmara: bestUmaraData?.[0]?.name || '-',
          bestJne: bestJneName
        }
      });
    };

    fetchAllStats();

    // Realtime subscriptions — UMARA
    const umaraUsersChannel = supabaseUmara.channel('umara-users-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllStats)
      .subscribe();

    const umaraTasksChannel = supabaseUmara.channel('umara-tasks-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchAllStats)
      .subscribe();

    const umaraAttendanceChannel = supabaseUmara.channel('umara-attendance-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, fetchAllStats)
      .subscribe();

    // Realtime subscriptions — JNE
    const jneUsersChannel = supabaseJne.channel('jne-users-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllStats)
      .subscribe();

    const jnePengantaranChannel = supabaseJne.channel('jne-pengantaran-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengantaran_gudang' }, fetchAllStats)
      .subscribe();

    const jnePoinChannel = supabaseJne.channel('jne-poin-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poin_karyawan' }, fetchAllStats)
      .subscribe();

    return () => {
      supabaseUmara.removeChannel(umaraUsersChannel);
      supabaseUmara.removeChannel(umaraTasksChannel);
      supabaseUmara.removeChannel(umaraAttendanceChannel);
      supabaseJne.removeChannel(jneUsersChannel);
      supabaseJne.removeChannel(jnePengantaranChannel);
      supabaseJne.removeChannel(jnePoinChannel);
    };
  }, []);

  return stats;
}
