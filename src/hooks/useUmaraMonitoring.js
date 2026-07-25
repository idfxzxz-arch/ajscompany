import { useState, useEffect } from 'react';
import { supabaseUmara } from '../services/supabase';
import { readTable, getValue } from '../services/databaseAdapter';

export function useUmaraMonitoring() {
  const [data, setData] = useState({ karyawan: [], loading: true, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        const usersResponse = await readTable(supabaseUmara, ['users', 'karyawan', 'employees'], { limit: 200 });
        const users = usersResponse.data || [];

        const attendanceResponse = await readTable(supabaseUmara, ['attendance', 'attendances', 'kehadiran'], { limit: 200 });
        const attendance = attendanceResponse.data || [];

        const tasksResponse = await readTable(supabaseUmara, ['tasks', 'tugas', 'job_tasks'], { limit: 200 });
        const tasks = tasksResponse.data || [];

        const karyawan = (users || []).map(user => {
          const userName = getValue(user, ['name', 'full_name', 'nama', 'employee_name']);
          const userRole = getValue(user, ['role', 'position', 'jabatan']);
          const userStatus = getValue(user, ['status', 'employee_status']);
          const userPoints = Number(getValue(user, ['points', 'poin', 'score'], 0));
          const attendanceRate = Number(getValue(user, ['attendance_rate', 'attendanceRate', 'kehadiran_rate'], 0));

          const att = (attendance || []).find(entry => {
            const candidateKeys = [
              getValue(entry, ['staff', 'name', 'nama', 'employee_name']),
              getValue(entry, ['user_name', 'user', 'karyawan'])
            ];
            return candidateKeys.includes(userName);
          });

          const attStatus = getValue(att, ['status', 'state', 'kehadiran'], 'Belum Hadir');
          const attDate = getValue(att, ['date', 'tanggal', 'created_at'], '');
          const currentDayStatus = attDate === today ? attStatus : attStatus;

          const userTasks = (tasks || []).filter(task => {
            const taskPic = getValue(task, ['pic', 'assigned_to', 'owner', 'person_in_charge']);
            return taskPic === userName || taskPic === user?.id || taskPic === user?.name;
          });

          const doneTasks = userTasks.filter(task => {
            const statusValue = String(getValue(task, ['status', 'state'], '')).toLowerCase();
            return statusValue === 'done' || statusValue === 'selesai' || statusValue === 'completed';
          }).length;

          const totalTasks = userTasks.length;
          const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
          const prod = totalTasks > 0 ? `${taskProgress}%` : `${attendanceRate || 0}%`;

          return {
            id: user.id,
            name: userName || `Karyawan ${user.id}`,
            role: userRole || 'Staff',
            status: currentDayStatus || 'Belum Hadir',
            taskProgress,
            totalTasks,
            doneTasks,
            prod,
            points: userPoints || 0,
            rawStatus: userStatus
          };
        });

        setData({ karyawan, loading: false, error: null });
      } catch (err) {
        console.error('Error fetching Umara monitoring data:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();

    const usersChannel = supabaseUmara.channel('umara-monitoring-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchData)
      .subscribe();

    const attendanceChannel = supabaseUmara.channel('umara-monitoring-attendance')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, fetchData)
      .subscribe();

    const tasksChannel = supabaseUmara.channel('umara-monitoring-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData)
      .subscribe();

    return () => {
      supabaseUmara.removeChannel(usersChannel);
      supabaseUmara.removeChannel(attendanceChannel);
      supabaseUmara.removeChannel(tasksChannel);
    };
  }, []);

  return data;
}
