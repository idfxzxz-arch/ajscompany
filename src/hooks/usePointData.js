import { useState, useEffect } from 'react';
import { supabaseUmara, supabaseJne } from '../services/supabase';

export function usePointData() {
  const [data, setData] = useState({ umara: [], jne: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ===== UMARA POINTS =====
        const { data: umaraUsers, error: umaraError } = await supabaseUmara
          .from('users')
          .select('id, name, role, points')
          .eq('status', 'active')
          .order('points', { ascending: false })
          .limit(10);

        if (umaraError) throw umaraError;

        // ===== JNE POINTS =====
        const { data: jnePoin, error: jnePoinError } = await supabaseJne
          .from('poin_karyawan')
          .select('karyawan_id, total_poin, peringkat')
          .order('total_poin', { ascending: false })
          .limit(10);

        if (jnePoinError) throw jnePoinError;

        // Get JNE user names
        let jneLeaderboard = [];
        if (jnePoin && jnePoin.length > 0) {
          const ids = jnePoin.map(p => p.karyawan_id);
          const { data: jneUsers, error: jneUsersError } = await supabaseJne
            .from('users')
            .select('id, name, role')
            .in('id', ids);

          if (jneUsersError) throw jneUsersError;

          jneLeaderboard = jnePoin.map(p => {
            const user = (jneUsers || []).find(u => u.id === p.karyawan_id);
            return {
              id: p.karyawan_id,
              name: user?.name || 'Unknown',
              role: user?.role || '-',
              points: p.total_poin || 0,
              rank: p.peringkat
            };
          });
        }

        setData({
          umara: (umaraUsers || []).map(u => ({
            id: u.id,
            name: u.name,
            role: u.role,
            points: u.points || 0
          })),
          jne: jneLeaderboard,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching point data:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();

    // Realtime
    const umaraChannel = supabaseUmara.channel('point-umara')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchData)
      .subscribe();

    const jnePoinChannel = supabaseJne.channel('point-jne')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poin_karyawan' }, fetchData)
      .subscribe();

    return () => {
      supabaseUmara.removeChannel(umaraChannel);
      supabaseJne.removeChannel(jnePoinChannel);
    };
  }, []);

  return data;
}
