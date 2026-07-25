import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const data = [
    { name: 'Jan', umaratax: 4000, jne: 2400 },
    { name: 'Feb', umaratax: 3000, jne: 1398 },
    { name: 'Mar', umaratax: 2000, jne: 9800 },
    { name: 'Apr', umaratax: 2780, jne: 3908 },
    { name: 'May', umaratax: 1890, jne: 4800 },
    { name: 'Jun', umaratax: 2390, jne: 3800 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      <div className="card" style={{ height: '400px' }}>
        <h3 className="text-lg font-bold mb-4">Produktivitas (UMARATAX vs JNE)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="umaratax" fill="var(--umr-primary)" name="UMARATAX" />
            <Bar dataKey="jne" fill="var(--jne-primary)" name="JNE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
