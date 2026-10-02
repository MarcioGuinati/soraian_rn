import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Appointment, Vaccine } from '../types';
import { formatDate } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Stethoscope, Syringe, LineChart as LineChartIcon, Plus, MapPin, Clock, CalendarIcon, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function HealthPage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'appointments' | 'vaccines' | 'growth'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'appointment' | 'vaccine' } | null>(null);

  // Appt state
  const [apptProfessional, setApptProfessional] = useState('');
  const [apptSpecialty, setApptSpecialty] = useState('');
  const [apptDate, setApptDate] = useState<Date | undefined>(undefined);
  const [apptTime, setApptTime] = useState('');
  const [apptLocation, setApptLocation] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  // Vac state
  const [vacName, setVacName] = useState('');
  const [vacDose, setVacDose] = useState('');
  const [vacDate, setVacDate] = useState<Date | undefined>(undefined);
  const [vacLocation, setVacLocation] = useState('');
  const [vacNotes, setVacNotes] = useState('');

  useEffect(() => { if (selectedChild) loadData(); }, [selectedChild, tab]);

  const loadData = async () => {
    if (!selectedChild) return;
    setLoading(true);
    try {
      if (tab === 'appointments') {
        const res = await api.get(`/children/${selectedChild.id}/appointments`);
        setAppointments(res.data.data);
      } else if (tab === 'vaccines') {
        const res = await api.get(`/children/${selectedChild.id}/vaccines`);
        setVaccines(res.data.data);
      } else {
        const res = await api.get(`/children/${selectedChild.id}/weights`);
        setWeights(res.data.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setApptProfessional(''); setApptSpecialty(''); setApptDate(undefined); setApptTime(''); setApptLocation(''); setApptReason(''); setApptNotes('');
    setVacName(''); setVacDose(''); setVacDate(undefined); setVacLocation(''); setVacNotes('');
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditAppt = (a: Appointment) => {
    setEditingId(a.id);
    setApptProfessional(a.professional);
    setApptSpecialty(a.specialty || '');
    setApptDate(new Date(a.date));
    setApptTime(a.time || '');
    setApptLocation(a.location || '');
    setApptReason(a.reason || '');
    setApptNotes(a.notes || '');
    setShowForm(true);
  };

  const openEditVac = (v: Vaccine) => {
    setEditingId(v.id);
    setVacName(v.name);
    setVacDose(v.dose || '');
    setVacDate(new Date(v.date));
    setVacLocation(v.location || '');
    setVacNotes(v.notes || '');
    setShowForm(true);
  };

  const handleSaveAppointment = async () => {
    if (!apptProfessional || !apptDate) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    const payload = {
      professional: apptProfessional, specialty: apptSpecialty, date: apptDate.toISOString(),
      time: apptTime, location: apptLocation, reason: apptReason, notes: apptNotes
    };
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, payload);
        toast.success('Consulta atualizada!');
      } else {
        await api.post(`/children/${selectedChild!.id}/appointments`, payload);
        toast.success('Consulta agendada!');
      }
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const handleSaveVaccine = async () => {
    if (!vacName || !vacDate) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    const payload = {
      name: vacName, dose: vacDose, date: vacDate.toISOString(), location: vacLocation, notes: vacNotes
    };
    try {
      if (editingId) {
        await api.put(`/vaccines/${editingId}`, payload);
        toast.success('Vacina atualizada!');
      } else {
        await api.post(`/children/${selectedChild!.id}/vaccines`, payload);
        toast.success('Vacina registrada!');
      }
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'appointment') {
        await api.delete(`/appointments/${deleteTarget.id}`);
        toast.success('Consulta excluída');
      } else {
        await api.delete(`/vaccines/${deleteTarget.id}`);
        toast.success('Vacina excluída');
      }
      loadData();
      setDeleteTarget(null);
    } catch { toast.error('Erro ao excluir'); }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 animate-in slide-in-from-bottom-4 duration-300 pb-24">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full mr-2 bg-muted/50">
            <ChevronLeft size={22} />
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {tab === 'appointments' ? (editingId ? 'Editar Consulta' : 'Nova Consulta') : (editingId ? 'Editar Vacina' : 'Nova Vacina')}
          </h1>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-5 space-y-4">
            {tab === 'appointments' ? (
              <>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Médico/Profissional *</Label>
                  <Input value={apptProfessional} onChange={e => setApptProfessional(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Especialidade (Opcional)</Label>
                  <Input value={apptSpecialty} onChange={e => setApptSpecialty(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="font-bold text-muted-foreground">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-14 rounded-xl bg-muted/50 border-transparent justify-start text-left font-normal focus:bg-background",
                            !apptDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {apptDate ? format(apptDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={apptDate}
                          onSelect={setApptDate as any}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="font-bold text-muted-foreground">Horário</Label>
                    <div className="flex gap-2 items-center">
                      <Select 
                        value={apptTime.split(':')[0] || ''} 
                        onValueChange={(v) => setApptTime(`${v}:${apptTime.split(':')[1] || '00'}`)}
                      >
                        <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="font-bold text-muted-foreground">:</span>
                      <Select 
                        value={apptTime.split(':')[1] || ''} 
                        onValueChange={(v) => setApptTime(`${apptTime.split(':')[0] || '12'}:${v}`)}
                      >
                        <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Local</Label>
                  <Input value={apptLocation} onChange={e => setApptLocation(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Motivo</Label>
                  <Input value={apptReason} onChange={e => setApptReason(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSaveAppointment}>
                  {editingId ? 'Salvar Alterações' : 'Salvar Consulta'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Nome da Vacina *</Label>
                  <Input value={vacName} onChange={e => setVacName(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-muted-foreground">Dose</Label>
                    <Input placeholder="Ex: 1ª dose" value={vacDose} onChange={e => setVacDose(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="font-bold text-muted-foreground">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-14 rounded-xl bg-muted/50 border-transparent justify-start text-left font-normal focus:bg-background",
                            !vacDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {vacDate ? format(vacDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={vacDate}
                          onSelect={setVacDate as any}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Local/Posto</Label>
                  <Input value={vacLocation} onChange={e => setVacLocation(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Observações Reações</Label>
                  <Textarea value={vacNotes} onChange={e => setVacNotes(e.target.value)} className="rounded-xl min-h-[100px] bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSaveVaccine}>
                  {editingId ? 'Salvar Alterações' : 'Salvar Vacina'}
                </Button>
              </>
            )}
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
        <h1 className="text-2xl font-extrabold tracking-tight">Saúde</h1>
      </div>

      <Tabs defaultValue="appointments" value={tab} onValueChange={(v) => setTab(v as any)} className="w-full mb-6">
        <TabsList className="w-full h-12 bg-muted/50 rounded-2xl p-1">
          <TabsTrigger value="appointments" className="rounded-xl text-sm font-bold flex-1"><Stethoscope size={16} className="mr-2" /> Consultas</TabsTrigger>
          <TabsTrigger value="vaccines" className="rounded-xl text-sm font-bold flex-1"><Syringe size={16} className="mr-2" /> Vacinas</TabsTrigger>
          <TabsTrigger value="growth" className="rounded-xl text-sm font-bold flex-1"><LineChartIcon size={16} className="mr-2" /> Cresc.</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="animate-in fade-in duration-500">
        {tab === 'appointments' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Stethoscope size={48} className="mx-auto mb-4 opacity-50" /><p>Nenhuma consulta</p></div>
            ) : (
              appointments.map(a => (
                <Card key={a.id} className="border-border/50 shadow-sm rounded-2xl">
                  <CardContent className="p-4 flex flex-col gap-2 relative">
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditAppt(a)} className="font-medium cursor-pointer">
                            <Pencil size={14} className="mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteTarget({ id: a.id, type: 'appointment' })} className="font-medium text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 size={14} className="mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex justify-between items-start pr-8">
                      <h3 className="font-bold text-foreground text-lg">{a.professional}</h3>
                    </div>
                    {a.specialty && <span className="bg-primary/10 w-max text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{a.specialty}</span>}
                    <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(a.date)} {a.time && `às ${a.time}`}</div>
                      {a.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {a.location}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={openAddForm}><Plus size={20} className="mr-2"/> Agendar Consulta</Button>
          </div>
        )}

        {tab === 'vaccines' && (
          <div className="space-y-4">
            {vaccines.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Syringe size={48} className="mx-auto mb-4 opacity-50" /><p>Nenhuma vacina</p></div>
            ) : (
              vaccines.map(v => (
                <Card key={v.id} className="border-border/50 shadow-sm rounded-2xl">
                  <CardContent className="p-4 relative">
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditVac(v)} className="font-medium cursor-pointer">
                            <Pencil size={14} className="mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteTarget({ id: v.id, type: 'vaccine' })} className="font-medium text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 size={14} className="mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-col mb-1 pr-8">
                      <h3 className="font-bold text-foreground text-lg leading-tight">{v.name}</h3>
                      {v.dose && <span className="text-sm font-bold text-primary mt-1">{v.dose}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-2"><Clock size={14}/> {formatDate(v.date)}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={openAddForm}><Plus size={20} className="mr-2"/> Registrar Vacina</Button>
          </div>
        )}

        {tab === 'growth' && (
          weights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><LineChartIcon size={48} className="mx-auto mb-4 opacity-50" /><p>Nenhum dado</p></div>
          ) : (
            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-4 pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weights.slice().reverse().map((w: any) => ({ date: w.recordedAt?.split('T')[0], weight: w.weight }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5)} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="weight" stroke="#D97706" strokeWidth={3} dot={{ fill: '#D97706', r: 4, strokeWidth: 0 }} name="Peso (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="rounded-[24px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Excluir Registro</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Tem certeza que deseja excluir esta <strong>{deleteTarget?.type === 'appointment' ? 'Consulta' : 'Vacina'}</strong>? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end mt-2">
            <Button variant="ghost" className="flex-1 rounded-full font-bold h-12" onClick={() => setDeleteTarget(null)}>
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
