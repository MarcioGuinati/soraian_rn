import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { TimelineEvent } from '../types';
import { formatDate, formatTime, getEventEmoji, getEventLabel, getEventColor } from '../utils/helpers';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pen, Trash2, CalendarDays, ClipboardList, ArrowRight } from 'lucide-react';

export default function TimelinePage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    if (selectedChild) loadTimeline();
  }, [selectedChild, filter, selectedDate]);

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
        if (event.breastSide) desc += event.breastSide === 'esquerdo' ? ' (Esq.)' : event.breastSide === 'direito' ? ' (Dir.)' : ' (Ambos)';
        if (event.amountMl) desc += ` — ${event.amountMl} ml`;
        if (event.durationMinutes) desc += ` — ${event.durationMinutes} min`;
        return desc;
      }
      case 'food': return `${event.food}${event.amount ? ` — ${event.amount} ${event.unit || ''}` : ''}`;
      case 'diaper': return event.type === 'xixi' ? 'Xixi' : `Cocô${event.consistency ? ` — ${event.consistency}` : ''}`;
      case 'sleep': return event.durationMinutes ? `${Math.floor(event.durationMinutes / 60)}h ${event.durationMinutes % 60}min` : (event.isActive ? 'Dormindo...' : 'Sono');
      case 'bath': return event.durationMinutes ? `${event.durationMinutes} min` : 'Banho';
      case 'temperature': return `${event.temperature?.toFixed(1)}°C`;
      case 'weight': return `${event.weight} kg`;
      case 'medication': return `${event.medicationName} — ${event.dosage} ${event.unit || ''}`;
      case 'note': return event.content?.substring(0, 60) || 'Observação';
      default: return '';
    }
  };

  const grouped: Record<string, TimelineEvent[]> = {};
  events.forEach(e => {
    const date = formatDate(e.eventDate);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(e);
  });

  const filters = ['', 'feeding', 'food', 'diaper', 'sleep', 'bath', 'temperature', 'weight', 'medication', 'note'];

  return (
    <div className="flex flex-col min-h-full bg-background px-6 py-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Timeline</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full font-bold h-10 px-4 shadow-sm border-border bg-background hover:bg-muted/50 transition-colors">
              <CalendarDays size={18} className="mr-2 text-primary shrink-0" />
              {selectedDate.split('-').reverse().join('/')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="end">
            <Calendar
              mode="single"
              selected={parseISO(selectedDate)}
              onSelect={(date) => {
                if (date) setSelectedDate(format(date, 'yyyy-MM-dd'));
              }}
              locale={ptBR}
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-end mb-2 -mt-2 pr-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 flex items-center gap-1">
          Deslize <ArrowRight size={10} />
        </span>
      </div>

      <ScrollArea className="w-[calc(100%+48px)] -ml-6 whitespace-nowrap mb-6 pb-4">
        <div className="flex w-max space-x-2 px-6">
          {filters.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'secondary'}
              size="sm"
              className={`rounded-full px-4 h-9 font-bold transition-all shadow-sm ${filter === f ? 'shadow-primary/20' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f ? <span className="mr-1.5">{getEventEmoji(f)}</span> : null}
              {f ? getEventLabel(f) : 'Todos'}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-12 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <ClipboardList size={32} className="text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Nenhum evento</h2>
          <p className="text-muted-foreground">Os registros deste dia aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date} className="relative">
              <div className="sticky top-16 z-20 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-background border border-border text-xs font-bold text-muted-foreground shadow-sm mb-4 left-1/2 -translate-x-1/2">
                {date}
              </div>
              <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-border -z-10" />

              <div className="space-y-4">
                {dayEvents.map(event => {
                  const color = getEventColor(event.eventType);
                  return (
                    <div key={`${event.eventType}-${event.id}`} className="flex gap-4 relative group">
                      <div className="flex flex-col items-center shrink-0 w-12 pt-1">
                        <div className="text-xs font-bold text-muted-foreground mb-1">{formatTime(event.eventDate)}</div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-background z-10" style={{ backgroundColor: `${color}20` }}>
                          <span className="text-lg">{getEventEmoji(event.eventType)}</span>
                        </div>
                      </div>

                      <Card className="flex-1 border-border/50 shadow-sm rounded-2xl overflow-hidden active:scale-[0.99] transition-transform">
                        <CardContent className="p-4 flex gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground leading-tight">{getEventLabel(event.eventType)}</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-0.5">{getEventDescription(event)}</p>
                            {event.notes && (
                              <p className="text-sm text-foreground/80 mt-2 bg-muted/50 p-2 rounded-lg">{event.notes}</p>
                            )}
                          </div>
                          <div className="flex flex-col justify-start gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full" onClick={() => navigate(`/add?type=${event.eventType === 'diaper' ? (event.type === 'xixi' ? 'diaper-pee' : 'diaper-poop') : event.eventType}`, { state: { event } })}>
                              <Pen size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive rounded-full" onClick={() => setEventToDelete(event)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <DialogContent className="rounded-[24px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Excluir Registro</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Tem certeza que deseja excluir este registro de <strong>{eventToDelete && getEventLabel(eventToDelete.eventType)}</strong>? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end mt-2">
            <Button variant="ghost" className="flex-1 rounded-full font-bold h-12" onClick={() => setEventToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1 rounded-full font-bold h-12" onClick={confirmDelete}>
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
