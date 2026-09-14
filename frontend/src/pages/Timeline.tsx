import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { TimelineEvent } from '../types';
import { formatDate, formatTime, getEventEmoji, getEventLabel, getEventColor, getEventBg } from '../utils/helpers';
import toast from 'react-hot-toast';
import './Timeline.css';

export default function TimelinePage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Data inicial (hoje) no formato YYYY-MM-DD local
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    if (selectedChild) loadTimeline();
  }, [selectedChild, filter, selectedDate]);

  const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);

  const loadTimeline = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      
      const [year, month, day] = selectedDate.split('-').map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      const params: any = { 
        limit: 100,
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString()
      };
      if (filter) params.type = filter;
      const res = await api.get(`/children/${selectedChild.id}/timeline`, { params });
      
      const sortedEvents = res.data.data.events.sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
      setEvents(sortedEvents);
    } catch (err) {
      console.error('Failed to load timeline', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (event: TimelineEvent) => {
    setEventToDelete(event);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const endpoints: Record<string, string> = {
        feeding: `/feedings/${eventToDelete.id}`,
        food: `/foods/${eventToDelete.id}`,
        diaper: `/diapers/${eventToDelete.id}`,
        sleep: `/sleep/${eventToDelete.id}`,
        bath: `/baths/${eventToDelete.id}`,
        temperature: `/temperatures/${eventToDelete.id}`,
        weight: `/weights/${eventToDelete.id}`,
        medication: `/medications/${eventToDelete.id}`,
        note: `/notes/${eventToDelete.id}`,
      };
      await api.delete(endpoints[eventToDelete.eventType]);
      toast.success('Registro removido com sucesso!');
      setEventToDelete(null);
      loadTimeline();
    } catch {
      toast.error('Erro ao remover o registro.');
    }
  };

  const getEventDescription = (event: TimelineEvent): string => {
    switch (event.eventType) {
      case 'feeding': {
        let desc = event.type === 'peito' ? 'Peito' : event.type === 'formula' ? 'Fórmula' : event.type === 'leite_ordenhado' ? 'Leite ordenhado' : event.type;
        if (event.breastSide) {
          desc += event.breastSide === 'esquerdo' ? ' (Esq.)' : event.breastSide === 'direito' ? ' (Dir.)' : ' (Ambos)';
        }
        if (event.amountMl) {
          desc += ` — ${event.amountMl} ml`;
        }
        if (event.durationMinutes) {
          desc += ` — ${event.durationMinutes} min`;
        }
        return desc;
      }
      case 'food':
        return `${event.food}${event.amount ? ` — ${event.amount} ${event.unit || ''}` : ''}`;
      case 'diaper':
        return event.type === 'xixi' ? 'Xixi' : `Cocô${event.consistency ? ` — ${event.consistency}` : ''}`;
      case 'sleep':
        return event.durationMinutes ? `${Math.floor(event.durationMinutes / 60)}h ${event.durationMinutes % 60}min` : (event.isActive ? 'Dormindo...' : 'Sono');
      case 'bath':
        return event.durationMinutes ? `${event.durationMinutes} min` : 'Banho';
      case 'temperature':
        return `${event.temperature?.toFixed(1)}°C`;
      case 'weight':
        return `${event.weight} kg`;
      case 'medication':
        return `${event.medicationName} — ${event.dosage} ${event.unit || ''}`;
      case 'note':
        return event.content?.substring(0, 60) || 'Observação';
      default:
        return '';
    }
  };

  // Group events by date
  const grouped: Record<string, TimelineEvent[]> = {};
  events.forEach(e => {
    const date = formatDate(e.eventDate);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(e);
  });

  const filters = ['', 'feeding', 'food', 'diaper', 'sleep', 'bath', 'temperature', 'weight', 'medication', 'note'];

  return (
    <div className="page">
      <div className="container">
        <h1 className="tl-title">Linha do tempo</h1>

        <div className="tl-controls-header">
          <div className="tl-date-picker-wrapper">
            <label className="tl-date-label">Data</label>
            <input 
              type="date" 
              className="tl-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="tl-filters">
            {filters.map(f => (
              <button key={f} className={`qr-option ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f ? `${getEventEmoji(f)} ${getEventLabel(f)}` : 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="tl-loading">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 8, borderRadius: 12 }} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">Nenhum evento</h2>
            <p className="empty-state-text">Os registros aparecerão aqui</p>
          </div>
        ) : (
          <div className="tl-list animate-fade-in">
            {Object.entries(grouped).map(([date, dayEvents]) => (
              <div key={date} className="tl-day">
                <div className="tl-day-header">{date}</div>
                <div className="tl-day-events">
                  {dayEvents.map(event => (
                    <div key={`${event.eventType}-${event.id}`} className="tl-event">
                      <div className="tl-event-time">{formatTime(event.eventDate)}</div>
                      <div className="tl-event-dot" style={{ backgroundColor: getEventColor(event.eventType) }}></div>
                      <div className="tl-event-content">
                        <div className="tl-event-row">
                          <span className="tl-event-emoji">{getEventEmoji(event.eventType)}</span>
                          <span className="tl-event-label">{getEventLabel(event.eventType)}</span>
                          <span className="tl-event-desc">{getEventDescription(event)}</span>
                        </div>
                        {event.notes && <div className="tl-event-notes">{event.notes}</div>}
                      </div>
                      <div className="tl-event-actions">
                        <button className="tl-event-action" onClick={() => navigate(`/add?type=${event.eventType === 'diaper' ? (event.type === 'xixi' ? 'diaper-pee' : 'diaper-poop') : event.eventType}`, { state: { event } })} title="Editar">✏️</button>
                        <button className="tl-event-action delete" onClick={() => handleDelete(event)} title="Remover">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {eventToDelete && (
        <div className="modal-overlay" onClick={() => setEventToDelete(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              🗑️ Excluir Registro
            </div>
            <p className="modal-text">
              Tem certeza que deseja excluir este registro de <strong>{getEventLabel(eventToDelete.eventType)}</strong>? Essa ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEventToDelete(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
