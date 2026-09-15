import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: {
    children: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Usuários</h1>
        <p className="admin-page-subtitle">
          {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
        </p>
      </div>

      <div className="admin-users-header">
        <div className="admin-search-box">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-title">
            {search ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </div>
          <div className="empty-state-text">
            {search ? 'Tente buscar com outros termos.' : 'Os usuários aparecerão aqui quando se cadastrarem.'}
          </div>
        </div>
      ) : (
        <div className="admin-users-list">
          {filteredUsers.map((user) => (
            <div key={user.id} className="admin-user-card">
              <div className="admin-user-card-left">
                <div className="admin-user-card-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="admin-user-card-info">
                  <div className="admin-user-card-name">{user.name}</div>
                  <div className="admin-user-card-email">{user.email}</div>
                </div>
              </div>

              <div className="admin-user-card-meta">
                <div className="admin-user-card-stat">
                  <span className="admin-user-card-stat-value">{user._count.children}</span>
                  <span className="admin-user-card-stat-label">
                    {user._count.children === 1 ? 'Filho' : 'Filhos'}
                  </span>
                </div>
                <div className="admin-user-card-date">
                  {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                <button
                  className="admin-view-btn"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  title="Ver detalhes"
                >
                  👁️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
