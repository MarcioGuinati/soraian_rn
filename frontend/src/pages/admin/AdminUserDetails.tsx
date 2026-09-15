import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ChildCount {
  feedingRecords: number;
  diaperRecords: number;
  sleepRecords: number;
  bathRecords: number;
  temperatureRecords: number;
  weightRecords: number;
  medicationRecords: number;
  appointments: number;
  vaccines: number;
  reminders: number;
  notes_: number;
  foodRecords: number;
}

interface ChildDetail {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  photo: string | null;
  createdAt: string;
  _count: ChildCount;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  children: ChildDetail[];
}

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      toast.error('Erro ao carregar usuário');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Usuário excluído com sucesso');
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir usuário');
    }
    setShowDeleteModal(false);
  };

  const calcAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffMs = today.getTime() - birth.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} dias`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}a ${remMonths}m` : `${years} ${years === 1 ? 'ano' : 'anos'}`;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!user) return null;

  const totalRecords = user.children.reduce((sum, child) => {
    const c = child._count;
    return sum + c.feedingRecords + c.diaperRecords + c.sleepRecords + c.bathRecords +
      c.temperatureRecords + c.weightRecords + c.medicationRecords + c.appointments +
      c.vaccines + c.reminders + c.notes_ + c.foodRecords;
  }, 0);

  return (
    <div>
      <button className="admin-detail-back" onClick={() => navigate('/admin/users')}>
        ← Voltar para Usuários
      </button>

      <div className="admin-detail-header">
        <div className="admin-detail-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="admin-detail-info">
          <h2>{user.name}</h2>
          <p>📧 {user.email}</p>
          {user.phone && <p>📱 {user.phone}</p>}
          <div className="admin-detail-badges">
            <span className={`admin-detail-badge role-${user.role}`}>
              {user.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
            </span>
            <span className="admin-detail-badge role-user">
              👶 {user.children.length} {user.children.length === 1 ? 'filho' : 'filhos'}
            </span>
            <span className="admin-detail-badge role-user">
              📋 {totalRecords} registros
            </span>
          </div>
        </div>
      </div>

      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-6)' }}>
        <div className="admin-stat-card info">
          <div className="admin-stat-icon">📅</div>
          <div className="admin-stat-value" style={{ fontSize: 'var(--font-size-lg)' }}>
            {format(new Date(user.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
          <div className="admin-stat-label">Data de Cadastro</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-icon">🔄</div>
          <div className="admin-stat-value" style={{ fontSize: 'var(--font-size-lg)' }}>
            {format(new Date(user.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
          <div className="admin-stat-label">Última Atualização</div>
        </div>
      </div>

      {user.children.length > 0 && (
        <>
          <h2 className="admin-section-title">👶 Crianças Cadastradas</h2>
          <div className="admin-children-grid">
            {user.children.map((child) => {
              const c = child._count;
              return (
                <div key={child.id} className="admin-child-card">
                  <div className="admin-child-header">
                    <div className={`admin-child-avatar ${child.gender === 'masculino' ? 'male' : 'female'}`}>
                      {child.gender === 'masculino' ? '👦' : '👧'}
                    </div>
                    <div>
                      <div className="admin-child-name">{child.name}</div>
                      <div className="admin-child-birth">
                        {format(new Date(child.birthDate), "dd/MM/yyyy", { locale: ptBR })} · {calcAge(child.birthDate)}
                      </div>
                    </div>
                  </div>
                  <div className="admin-child-stats">
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.feedingRecords}</span>
                      <span className="admin-child-stat-lbl">Mamadas</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.diaperRecords}</span>
                      <span className="admin-child-stat-lbl">Fraldas</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.sleepRecords}</span>
                      <span className="admin-child-stat-lbl">Sonos</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.bathRecords}</span>
                      <span className="admin-child-stat-lbl">Banhos</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.vaccines}</span>
                      <span className="admin-child-stat-lbl">Vacinas</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.appointments}</span>
                      <span className="admin-child-stat-lbl">Consultas</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.medicationRecords}</span>
                      <span className="admin-child-stat-lbl">Remédios</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.foodRecords}</span>
                      <span className="admin-child-stat-lbl">Refeições</span>
                    </div>
                    <div className="admin-child-stat">
                      <span className="admin-child-stat-val">{c.notes_}</span>
                      <span className="admin-child-stat-lbl">Notas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {user.children.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👶</div>
          <div className="empty-state-title">Nenhuma criança cadastrada</div>
          <div className="empty-state-text">Este usuário ainda não cadastrou nenhum filho.</div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-light)' }}>
        <button className="admin-delete-btn" onClick={() => setShowDeleteModal(true)}>
          🗑️ Excluir Usuário
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⚠️ Excluir Usuário</div>
            <div className="modal-text">
              Tem certeza que deseja excluir <strong>{user.name}</strong>? 
              Todos os dados (crianças, registros, etc.) serão permanentemente removidos. 
              Esta ação não pode ser desfeita.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
