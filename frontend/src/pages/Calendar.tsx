import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getEventLabel, getEventEmoji } from '../utils/helpers';
import './Calendar.css';

export default function CalendarPage() {
  const { selectedChild } = useChild();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailyCounts, setDailyCounts] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayEvents, setDayEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedChild) loadCalendar();
  }, [selectedChild, currentMonth]);

  const loadCalendar = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const res = await api.get(`/children/${selectedChild.id}/calendar`, { params: { year, month } });
      setDailyCounts(res.data.data.dailyCounts || {});
    } catch (err) {
      console.error('Failed to load calendar', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDayEvents = async (dateStr: string) => {
    if (!selectedChild) return;
    setSelectedDate(dateStr);
    try {
      const res = await api.get(`/children/${selectedChild.id}/timeline`, {
        params: { startDate: `${dateStr}T00:00:00`, endDate: `${dateStr}T23:59:59`, limit: 100 }
      });
      setDayEvents(res.data.data.events);
    } catch (err) {
      console.error('Failed to load day events', err);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="page"><div className="container">
      <div className="cal-header">
        <button className="btn btn-ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>‹</button>
        <h2 className="cal-month">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h2>
        <button className="btn btn-ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>›</button>
      </div>

      <div className="cal-grid">
        {weekDays.map(d => <div key={d} className="cal-weekday">{d}</div>)}
        {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="cal-day empty" />)}
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = dailyCounts[dateStr];
          const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
          const isSelected = dateStr === selectedDate;
          return (
            <button key={dateStr} className={`cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${count ? 'has-events' : ''}`} onClick={() => loadDayEvents(dateStr)}>
              <span className="cal-day-num">{day.getDate()}</span>
              {count && <span className="cal-day-dot"></span>}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="cal-day-detail animate-fade-in">
          <h3 className="cal-day-title">📅 {selectedDate.split('-').reverse().join('/')}</h3>
          {dayEvents.length === 0 ? (
            <p className="cal-no-events">Nenhum evento neste dia</p>
          ) : (
            <div className="cal-events">
              {dayEvents.map((e: any) => (
                <div key={`${e.eventType}-${e.id}`} className="tl-event">
                  <div className="tl-event-time">{format(new Date(e.eventDate), 'HH:mm')}</div>
                  <div className="tl-event-content">
                    <span className="tl-event-emoji">{getEventEmoji(e.eventType)}</span>
                    <span className="tl-event-label" style={{ marginLeft: 8 }}>{getEventLabel(e.eventType)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div></div>
  );
}
