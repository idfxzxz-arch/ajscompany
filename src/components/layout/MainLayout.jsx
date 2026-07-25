import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Truck, Star, BarChart3, Trophy, FileText, Bell, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import './MainLayout.css';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Monitoring UMARATAX', href: '/monitoring/umaratax', icon: Building2, color: 'text-umr' },
    { name: 'Monitoring JNE', href: '/monitoring/jne', icon: Truck, color: 'text-jne' },
    { name: 'Point Karyawan', href: '/point', icon: Star },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Penilaian Akhir Tahun', href: '/penilaian', icon: Trophy },
    { name: 'Laporan', href: '/laporan', icon: FileText },
    { name: 'Notifikasi', href: '/notifikasi', icon: Bell },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon bg-umr">U</div>
            <div className="logo-icon bg-jne">J</div>
            <h1 className="logo-text">Monitoring</h1>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`nav-icon ${item.color || ''}`} size={20} />
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <Link to="/login" className="nav-item text-danger">
            <LogOut className="nav-icon" size={20} />
            <span className="nav-text">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h2 className="page-title">
              {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Monitoring'}
            </h2>
          </div>
          <div className="topbar-right">
            <div className="user-profile">
              <div className="avatar">A</div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
