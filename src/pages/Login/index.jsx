export default function Login() {
  return (
    <div className="flex items-center justify-center" style={{ height: '100vh', backgroundColor: 'var(--bg-body)' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login Monitoring</h2>
        <div className="flex gap-2 justify-center mb-6">
          <span className="badge badge-umr">UMARATAX</span>
          <span className="badge badge-jne">JNE</span>
        </div>
        <form>
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Email / Username</label>
            <input type="text" className="w-full" style={{ padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
          </div>
          <div className="mb-6">
            <label className="text-sm font-semibold mb-2 block">Password</label>
            <input type="password" style={{ padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
          </div>
          <button type="button" className="bg-umr" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.location.href = '/'}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
