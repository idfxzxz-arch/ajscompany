import { useState, useEffect, useCallback } from 'react';
import { supabaseUmara, supabaseJne } from '../services/supabase';

export function useNotifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const addNotification = useCallback((type, msg) => {
    const now = new Date();
    setNotifikasi(prev => [{
      id: `${type}-${Date.now()}`,
      type,
      msg,
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now
    }, ...prev].slice(0, 50)); // Keep max 50 notifications
  }, []);

  useEffect(() => {
    // Fetch recent activity as initial notifications
    const fetchInitial = async () => {
      try {
        const notifs = [];

        // Recent Umara tasks completed
        const { data: recentTasks } = await supabaseUmara
          .from('tasks')
          .select('title, pic, status, updated_at')
          .eq('status', 'done')
          .order('updated_at', { ascending: false })
          .limit(5);

        (recentTasks || []).forEach(t => {
          const timeAgo = getTimeAgo(t.updated_at);
          notifs.push({
            id: `umara-task-${t.title}`,
            type: 'UMARATAX',
            msg: `Tugas "${t.title}" selesai oleh ${t.pic || 'Staff'}.`,
            time: timeAgo,
            timestamp: new Date(t.updated_at)
          });
        });

        // Recent JNE deliveries
        const { data: recentPengantaran } = await supabaseJne
          .from('pengantaran_gudang')
          .select('resi, gudang, status, tanggal, jam')
          .order('tanggal', { ascending: false })
          .limit(5);

        (recentPengantaran || []).forEach(p => {
          const time = getTimeAgo(`${p.tanggal}T${p.jam}`);
          const statusMsg = p.status === 'Selesai'
            ? `Pengantaran ${p.resi} ke ${p.gudang} selesai.`
            : `Pengantaran ${p.resi} ke ${p.gudang} — ${p.status}.`;
          notifs.push({
            id: `jne-pengantaran-${p.resi}`,
            type: 'JNE',
            msg: statusMsg,
            time,
            timestamp: new Date(`${p.tanggal}T${p.jam}`)
          });
        });

        // Recent Umara attendance
        const today = new Date().toISOString().split('T')[0];
        const { data: recentAttendance } = await supabaseUmara
          .from('attendance')
          .select('staff, status, check_in, date')
          .eq('date', today)
          .order('check_in', { ascending: false })
          .limit(3);

        (recentAttendance || []).forEach(a => {
          notifs.push({
            id: `umara-att-${a.staff}-${a.date}`,
            type: 'UMARATAX',
            msg: `${a.staff} hadir (${a.status}) hari ini.`,
            time: a.check_in ? `${a.check_in.slice(0, 5)}` : 'Hari ini',
            timestamp: new Date(`${a.date}T${a.check_in || '00:00'}`)
          });
        });

        // Sort by timestamp descending
        notifs.sort((a, b) => b.timestamp - a.timestamp);
        setNotifikasi(notifs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      }
    };

    fetchInitial();

    // Realtime: listen for new events
    const umaraTasksChannel = supabaseUmara.channel('notif-umara-tasks')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.new.status === 'done') {
          addNotification('UMARATAX', `Tugas "${payload.new.title}" selesai oleh ${payload.new.pic || 'Staff'}.`);
        }
      })
      .subscribe();

    const umaraAttChannel = supabaseUmara.channel('notif-umara-attendance')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance' }, (payload) => {
        addNotification('UMARATAX', `${payload.new.staff} melakukan check-in (${payload.new.status}).`);
      })
      .subscribe();

    const jnePengantaranChannel = supabaseJne.channel('notif-jne-pengantaran')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengantaran_gudang' }, (payload) => {
        const p = payload.new;
        if (payload.eventType === 'INSERT') {
          addNotification('JNE', `Pengantaran baru: ${p.resi} ke ${p.gudang}.`);
        } else if (payload.eventType === 'UPDATE' && p.status === 'Selesai') {
          addNotification('JNE', `Pengantaran ${p.resi} selesai.`);
        }
      })
      .subscribe();

    const jneAbsensiChannel = supabaseJne.channel('notif-jne-absensi')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'absensi' }, (payload) => {
        addNotification('JNE', `Karyawan ID ${payload.new.karyawan_id} absen (${payload.new.status}).`);
      })
      .subscribe();

    return () => {
      supabaseUmara.removeChannel(umaraTasksChannel);
      supabaseUmara.removeChannel(umaraAttChannel);
      supabaseJne.removeChannel(jnePengantaranChannel);
      supabaseJne.removeChannel(jneAbsensiChannel);
    };
  }, [addNotification]);

  return { notifikasi, loading };
}

function getTimeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return `${diffDay} hari lalu`;
}
