import { useState, useEffect } from 'react';
import { supabaseUmara, supabaseJne } from '../services/supabase';

export function useAnalyticsData() {
  const [data, setData] = useState({ chartData: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current year
        const year = new Date().getFullYear();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // ===== UMARA: Tasks completed per month =====
        const { data: umaraTasks, error: umaraError } = await supabaseUmara
          .from('tasks')
          .select('id, status, created_at')
          .eq('status', 'done');

        if (umaraError) throw umaraError;

        // ===== JNE: Pengantaran selesai per month =====
        const { data: jnePengantaran, error: jneError } = await supabaseJne
          .from('pengantaran_gudang')
          .select('id, status, tanggal')
          .eq('status', 'Selesai');

        if (jneError) throw jneError;

        // Group by month
        const chartData = months.map((month, idx) => {
          const monthNum = idx + 1;

          const umaraCount = (umaraTasks || []).filter(t => {
            const d = new Date(t.created_at);
            return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
          }).length;

          const jneCount = (jnePengantaran || []).filter(p => {
            const d = new Date(p.tanggal);
            return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
          }).length;

          return { name: month, umaratax: umaraCount, jne: jneCount };
        });

        // Only include months up to current month
        const currentMonth = new Date().getMonth() + 1;
        const filteredData = chartData.slice(0, currentMonth);

        setData({ chartData: filteredData, loading: false, error: null });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();

    // Realtime
    const umaraChannel = supabaseUmara.channel('analytics-umara')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData)
      .subscribe();

    const jneChannel = supabaseJne.channel('analytics-jne')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengantaran_gudang' }, fetchData)
      .subscribe();

    return () => {
      supabaseUmara.removeChannel(umaraChannel);
      supabaseJne.removeChannel(jneChannel);
    };
  }, []);

  return data;
}
