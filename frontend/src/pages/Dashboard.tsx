import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { DashboardData } from '../types';
import { getChildAge, formatDuration, formatTimeAgo } from '../utils/helpers';
import './Dashboard.css';

export default function DashboardPage() {
  const { selectedChild, children: childrenList } = useChild();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedChild) {
      setLoading(false);
      return;
    }
    loadDashboard();
  }, [selectedChild]);

  const loadDashboard = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      const res = await api.get(`/children/${selectedChild.id}/dashboard`);
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChild && childrenList.length === 0 && !loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">👶</div>
            <h2 className="empty-state-title">Bem-vindo ao SORAIA!</h2>
            <p className="empty-state-text">Cadastre sua primeira criança para começar a acompanhar a rotina.</p>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 24 }} onClick={() => navigate('/children/new')}>
              + Adicionar criança
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="page">
        <div className="container">
          <div className="skeleton" style={{ height: 60, marginBottom: 24 }}></div>
          <div className="skeleton" style={{ height: 160, borderRadius: 24, marginBottom: 32 }}></div>
          <div className="skeleton" style={{ height: 200, borderRadius: 24 }}></div>
        </div>
      </div>
    );
  }

  const { today } = data;

  const activities = [
    { key: 'sleep', title: 'Sono', subtitle: today.sleep.activeSleep ? 'Dormindo agora' : `Hoje: ${formatDuration(today.sleep.totalMinutes)}`, icon: '😴', bg: 'var(--color-sleep-bg)', color: 'var(--color-sleep)', link: '/add?type=sleep' },
    { key: 'feeding', title: 'Mamadas', subtitle: today.feeding.count > 0 ? `${today.feeding.count} vez(es) hoje` : 'Nenhuma mamada', icon: '🍼', bg: 'var(--color-feeding-bg)', color: 'var(--color-feeding)', link: '/add?type=feeding' },
    { key: 'diaper', title: 'Fraldas', subtitle: (today.diaper.peeCount || today.diaper.poopCount) ? `${today.diaper.peeCount} xixi, ${today.diaper.poopCount} cocô` : 'Nenhuma troca', icon: '💩', bg: 'var(--color-diaper-poop-bg)', color: 'var(--color-diaper-poop)', link: '/add?type=diaper' },
    { key: 'bath', title: 'Banho', subtitle: today.bath.count > 0 ? `${today.bath.count} banho(s)` : 'Sem banho', icon: '🛁', bg: 'var(--color-bath-bg)', color: 'var(--color-bath)', link: '/add?type=bath' },
    { key: 'temperature', title: 'Saúde', subtitle: today.temperature ? `Última: ${today.temperature.temperature.toFixed(1)}°C` : 'Nenhum registro', icon: '🌡️', bg: 'var(--color-temp-bg)', color: 'var(--color-temp)', link: '/add?type=temperature' },
  ];

  return (
    <div className="page">
      <div className="container">
        
        {/* Header */}
        <div className="dash-header animate-fade-in">
          <div>
            <h1 className="dash-greeting-text">Olá, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="dash-greeting-sub">Acompanhe a rotina de {selectedChild?.name}</p>
          </div>
          <button className="dash-notification-btn" onClick={() => navigate('/reminders')}>
            🔔
            {data.upcomingReminders.length > 0 && <span className="dash-notification-dot"></span>}
          </button>
        </div>

        {/* Overview Card */}
        <div className="dash-overview-card animate-scale-in">
          <div className="dash-overview-header">
            <div className="dash-overview-title">
              👀 Resumo de Hoje
            </div>
            <div className="dash-overview-link" onClick={() => navigate('/timeline')}>
              Ver Mais ❯
            </div>
          </div>
          
          <div className="dash-overview-stats">
            <div className="dash-stat">
              <div className="dash-stat-icon">🍼</div>
              <div className="dash-stat-label">Mamadas</div>
              <div className="dash-stat-value">{today.feeding.count < 10 ? `0${today.feeding.count}` : today.feeding.count}</div>
            </div>
            
            <div className="dash-stat">
              <div className="dash-stat-icon">😴</div>
              <div className="dash-stat-label">Sono</div>
              <div className="dash-stat-value">{formatDuration(today.sleep.totalMinutes)}</div>
            </div>

            <div className="dash-stat">
              <div className="dash-stat-icon">💩</div>
              <div className="dash-stat-label">Fraldas</div>
              <div className="dash-stat-value">
                {(today.diaper.peeCount + today.diaper.poopCount) < 10 
                  ? `0${today.diaper.peeCount + today.diaper.poopCount}` 
                  : (today.diaper.peeCount + today.diaper.poopCount)}
              </div>
            </div>
          </div>
        </div>

        <div className="dash-desktop-grid">
          <div className="dash-desktop-col">
            {/* Activities */}
            <div className="dash-section-header animate-fade-in">
              <h2 className="dash-section-title">Atividades</h2>
              <div className="dash-section-link" onClick={() => navigate('/more')}>
                VER TODAS
              </div>
            </div>

            <div className="dash-activities animate-fade-in">
              {activities.map(act => (
                <div key={act.key} className="dash-activity-item" onClick={() => navigate(act.link)}>
                  <div className="dash-activity-icon" style={{ background: act.bg }}>
                    {act.icon}
                  </div>
                  <div className="dash-activity-info">
                    <div className="dash-activity-title">{act.title}</div>
                    <div className="dash-activity-subtitle">{act.subtitle}</div>
                  </div>
                  <button className="dash-activity-btn" onClick={(e) => { e.stopPropagation(); navigate(act.link); }}>
                    ＋
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-desktop-col">
            {/* Activity History */}
            <div className="dash-section-header animate-fade-in" style={{ marginTop: 'var(--space-6)' }}>
              <h2 className="dash-section-title">Últimos Eventos</h2>
              <div className="dash-section-link" onClick={() => navigate('/timeline')}>
                VER MAIS
              </div>
            </div>
            
            <div className="dash-history-list animate-fade-in">
              {today.feeding.last && (
                <div className="dash-history-item">
                  <div className="dash-history-title">🍼 Mamada {today.feeding.last.amountMl ? `(${today.feeding.last.amountMl}ml)` : ''}</div>
                  <div className="dash-history-time">{formatTimeAgo(today.feeding.last.recordedAt)}</div>
                </div>
              )}
              {today.diaper.lastPee && (
                <div className="dash-history-item">
                  <div className="dash-history-title">💧 Troca de Fralda (Xixi)</div>
                  <div className="dash-history-time">{formatTimeAgo(today.diaper.lastPee.recordedAt)}</div>
                </div>
              )}
              {today.diaper.lastPoop && (
                <div className="dash-history-item">
                  <div className="dash-history-title">💩 Troca de Fralda (Cocô)</div>
                  <div className="dash-history-time">{formatTimeAgo(today.diaper.lastPoop.recordedAt)}</div>
                </div>
              )}
              {today.sleep.last && (
                <div className="dash-history-item">
                  <div className="dash-history-title">😴 Sono</div>
                  <div className="dash-history-time">{formatTimeAgo(today.sleep.last.startedAt)}</div>
                </div>
              )}
              {(!today.feeding.last && !today.diaper.lastPee && !today.diaper.lastPoop && !today.sleep.last) && (
                <div className="dash-history-empty">Nenhum evento registrado hoje.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
