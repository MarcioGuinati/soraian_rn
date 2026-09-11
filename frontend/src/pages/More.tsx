import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import toast from 'react-hot-toast';
import './More.css';

export default function MorePage() {
  const { user, logout } = useAuth();
  const { selectedChild } = useChild();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Até logo! 👋');
    navigate('/login');
  };

  const menuItems = [
    { icon: '👶', label: 'Crianças', desc: 'Gerenciar crianças cadastradas', path: '/children' },
    { icon: '📅', label: 'Calendário', desc: 'Visualizar eventos por data', path: '/calendar' },
    { icon: '❤️', label: 'Saúde', desc: 'Consultas, vacinas e medidas', path: '/health' },
    { icon: '🔔', label: 'Lembretes', desc: 'Gerenciar lembretes', path: '/reminders' },
    { icon: '⚙️', label: 'Configurações', desc: 'Perfil e preferências', path: '/settings' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="more-profile">
          <div className="more-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="more-profile-info">
            <div className="more-profile-name">{user?.name}</div>
            <div className="more-profile-email">{user?.email}</div>
          </div>
        </div>

        <div className="more-menu">
          {menuItems.map((item) => (
            <button key={item.path} className="more-item" onClick={() => navigate(item.path)}>
              <span className="more-item-icon">{item.icon}</span>
              <div className="more-item-text">
                <div className="more-item-label">{item.label}</div>
                <div className="more-item-desc">{item.desc}</div>
              </div>
              <span className="more-item-arrow">›</span>
            </button>
          ))}
        </div>

        <button className="btn btn-danger btn-block" style={{ marginTop: 32 }} onClick={handleLogout}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
