import { useState, useEffect } from 'react';
import api from '../../services/api';

interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  recordsToday: number;
  records: {
    feedings: number;
    diapers: number;
    sleeps: number;
    baths: number;
    medications: number;
    vaccines: number;
    appointments: number;
    notes: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!stats) return null;

  const recordItems = [
    { icon: '🍼', label: 'Amamentações', count: stats.records.feedings, bg: 'var(--color-feeding-bg)' },
    { icon: '🧷', label: 'Fraldas', count: stats.records.diapers, bg: 'var(--color-diaper-pee-bg)' },
    { icon: '😴', label: 'Sonos', count: stats.records.sleeps, bg: 'var(--color-sleep-bg)' },
    { icon: '🛁', label: 'Banhos', count: stats.records.baths, bg: 'var(--color-bath-bg)' },
    { icon: '💊', label: 'Medicamentos', count: stats.records.medications, bg: 'var(--color-medicine-bg)' },
    { icon: '💉', label: 'Vacinas', count: stats.records.vaccines, bg: 'var(--color-weight-bg)' },
    { icon: '📅', label: 'Consultas', count: stats.records.appointments, bg: 'var(--color-food-bg)' },
    { icon: '📝', label: 'Notas', count: stats.records.notes, bg: 'var(--color-note-bg)' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Visão geral da plataforma SORAIA</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">Total de Usuários</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-icon">👶</div>
          <div className="admin-stat-value">{stats.totalChildren}</div>
          <div className="admin-stat-label">Crianças Cadastradas</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-icon">🆕</div>
          <div className="admin-stat-value">{stats.newUsersLast7Days}</div>
          <div className="admin-stat-label">Novos (7 dias)</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-icon">📈</div>
          <div className="admin-stat-value">{stats.recordsToday}</div>
          <div className="admin-stat-label">Registros Hoje</div>
        </div>
      </div>

      <h2 className="admin-section-title">📋 Total de Registros na Plataforma</h2>
      <div className="admin-records-grid">
        {recordItems.map((item) => (
          <div className="admin-record-card" key={item.label}>
            <div className="admin-record-icon" style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div className="admin-record-info">
              <div className="admin-record-count">{item.count}</div>
              <div className="admin-record-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="admin-section-title">📊 Crescimento</h2>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="admin-stat-card success">
          <div className="admin-stat-icon">📅</div>
          <div className="admin-stat-value">{stats.newUsersLast30Days}</div>
          <div className="admin-stat-label">Novos Usuários (30 dias)</div>
        </div>
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon">🎯</div>
          <div className="admin-stat-value">
            {stats.totalChildren > 0 ? (stats.totalChildren / stats.totalUsers).toFixed(1) : '0'}
          </div>
          <div className="admin-stat-label">Média Filhos/Usuário</div>
        </div>
      </div>
    </div>
  );
}
