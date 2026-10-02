import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Reminder } from '../types';
import { formatDateTime } from '../utils/helpers';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Bell, Trash2, Plus, BellRing, BellOff } from 'lucide-react';

export default function RemindersPage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  useEffect(() => { if (selectedChild) loadReminders(); }, [selectedChild]);

  const loadReminders = async () => {
    if (!selectedChild) return;
    try { const res = await api.get(`/children/${selectedChild.id}/reminders`); setReminders(res.data.data); } catch (err) {}
  };

  const handleToggle = async (id: string) => {
    try { await api.patch(`/reminders/${id}/toggle`); loadReminders(); } catch { toast.error('Erro'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover lembrete?')) return;
    try { await api.delete(`/reminders/${id}`); toast.success('Removido'); loadReminders(); } catch { toast.error('Erro'); }
  };

  const handleSave = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/reminders`, { title, description, dateTime, recurrence });
      toast.success('Lembrete ativado! 🔔');
      setShowForm(false); setTitle(''); setDescription(''); setDateTime(''); setRecurrence('none');
      loadReminders();
    } catch { toast.error('Erro ao salvar'); }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 animate-in slide-in-from-bottom-4 duration-300 pb-24">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full mr-2 bg-muted/50">
            <ChevronLeft size={22} />
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight">Novo Lembrete</h1>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Título</Label>
              <Input placeholder="Ex: Dar vitamina D" value={title} onChange={e => setTitle(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Data e Hora</Label>
              <Input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Recorrência</Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uma vez</SelectItem>
                  <SelectItem value="daily">Todos os dias</SelectItem>
                  <SelectItem value="weekly">Toda semana</SelectItem>
                  <SelectItem value="monthly">Todo mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Detalhes (Opcional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl min-h-[80px] bg-muted/50 border-transparent focus:bg-background" />
            </div>
            <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSave}>Ativar Alarme</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight">Lembretes</h1>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-lg">Sem alarmes</p>
          </div>
        ) : (
          reminders.map(r => (
            <Card key={r.id} className={`border-border/50 shadow-sm rounded-2xl transition-opacity ${r.enabled ? 'opacity-100' : 'opacity-60 grayscale'}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" className={`rounded-full shrink-0 w-12 h-12 ${r.enabled ? 'bg-[#FFE3A3]/50 text-[#D97706]' : 'bg-muted text-muted-foreground'}`} onClick={() => handleToggle(r.id)}>
                  {r.enabled ? <BellRing size={24} /> : <BellOff size={24} />}
                </Button>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{r.title}</h3>
                  <p className="text-xs font-bold text-primary mt-1">{formatDateTime(r.dateTime)} {r.recurrence !== 'none' && ` • ${r.recurrence}`}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full" onClick={() => handleDelete(r.id)}>
                  <Trash2 size={18} />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-8" onClick={() => setShowForm(true)}>
        <Plus size={20} className="mr-2"/> Novo Lembrete
      </Button>
    </div>
  );
}
