import { NavLink, useLocation } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import InstallPrompt from '../InstallPrompt';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { selectedChild, children: childrenList, selectChild } = useChild();
  const location = useLocation();

  const showChildSelector = childrenList.length > 1;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-logo">🍼</span>
            <span className="header-title">SORAIA</span>
          </div>

          {showChildSelector && selectedChild && (
            <div className="child-selector">
              <select
                value={selectedChild.id}
                onChange={(e) => {
                  const child = childrenList.find(c => c.id === e.target.value);
                  if (child) selectChild(child);
                }}
                className="child-selector-select"
              >
                {childrenList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedChild && !showChildSelector && (
            <div className="header-child-name">
              {selectedChild.name}
            </div>
          )}
        </div>
      </header>

      <div className="layout-body">
        <aside className="sidebar">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} end>
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-label">Início</span>
          </NavLink>
          <NavLink to="/timeline" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">📋</span>
            <span className="sidebar-label">Timeline</span>
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-label">Relatórios</span>
          </NavLink>
          <NavLink to="/more" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">☰</span>
            <span className="sidebar-label">Mais</span>
          </NavLink>

          <NavLink to="/add" className="sidebar-item sidebar-fab">
            <span className="sidebar-fab-icon">＋</span>
            <span className="sidebar-label">Novo Registro</span>
          </NavLink>
        </aside>

        <main className="main-content">
        {children}
      </main>

      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Início</span>
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">Timeline</span>
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `nav-item nav-item-fab ${isActive ? 'active' : ''}`}>
          <span className="nav-fab-icon">＋</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Relatórios</span>
        </NavLink>
        <NavLink to="/more" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">☰</span>
          <span className="nav-label">Mais</span>
        </NavLink>
      </nav>
      </div>
      <InstallPrompt />
    </div>
  );
}
