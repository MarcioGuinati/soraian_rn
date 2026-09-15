import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">👑</span>
            <div>
              <span className="admin-logo-text">SORAIA</span>
              <span className="admin-logo-badge">Admin</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-section-title">Principal</span>
            <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <span className="admin-nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
              <span className="admin-nav-icon">👥</span>
              <span>Usuários</span>
            </NavLink>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-role">Administrador</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Sair">
            🚪
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-brand">
          <span className="admin-logo-icon">👑</span>
          <span className="admin-logo-text">SORAIA</span>
          <span className="admin-logo-badge">Admin</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout} title="Sair">
          🚪
        </button>
      </header>

      <main className="admin-main">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav">
        <NavLink to="/admin" end className={({ isActive }) => `admin-bnav-item ${isActive ? 'active' : ''}`}>
          <span className="admin-bnav-icon">📊</span>
          <span className="admin-bnav-label">Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `admin-bnav-item ${isActive ? 'active' : ''}`}>
          <span className="admin-bnav-icon">👥</span>
          <span className="admin-bnav-label">Usuários</span>
        </NavLink>
      </nav>
    </div>
  );
}
