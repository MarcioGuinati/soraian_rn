import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getEventLabel, getEventEmoji } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CalendarPage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
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
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight">Calendário</h1>
      </div>

      <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-border" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft size={20} />
            </Button>
            <h2 className="text-lg font-bold capitalize text-foreground tracking-tight">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-border" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 w-10" />
            ))}
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const count = dailyCounts[dateStr];
              const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
              const isSelected = dateStr === selectedDate;
              return (
                <button 
                  key={dateStr} 
                  className={`
                    relative h-10 w-full sm:w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all mx-auto
                    ${isSelected ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 
                      isToday ? 'bg-muted text-primary' : 'text-foreground hover:bg-muted/50'}
                  `} 
                  onClick={() => loadDayEvents(dateStr)}
                >
                  {day.getDate()}
                  {count > 0 && !isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D946EF]" />
                  )}
                  {count > 0 && isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-4 px-2">
            <CalendarDays size={18} className="text-primary" />
            <h3 className="font-bold text-lg text-foreground">
              Eventos de {selectedDate.split('-').reverse().join('/')}
            </h3>
          </div>
          
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 bg-muted/30 rounded-3xl border border-border/50">
              <CalendarDays size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium">Nenhum evento registrado neste dia</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-3">
                {dayEvents.map((e: any) => (
                  <Card key={`${e.eventType}-${e.id}`} className="border-border/50 shadow-sm rounded-2xl bg-card">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-xl shrink-0">
                        {getEventEmoji(e.eventType)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-base leading-tight">{getEventLabel(e.eventType)}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
                          <Clock size={12} /> {format(new Date(e.eventDate), 'HH:mm')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}
