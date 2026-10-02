import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Appointment, Vaccine } from '../types';
import { formatDate } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Stethoscope, Syringe, LineChart as LineChartIcon, Plus, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HealthPage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'appointments' | 'vaccines' | 'growth'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [apptProfessional, setApptProfessional] = useState('');
  const [apptSpecialty, setApptSpecialty] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptLocation, setApptLocation] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  const [vacName, setVacName] = useState('');
  const [vacDose, setVacDose] = useState('');
  const [vacDate, setVacDate] = useState('');
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

  const handleSaveAppointment = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/appointments`, {
        professional: apptProfessional, specialty: apptSpecialty, date: apptDate,
        time: apptTime, location: apptLocation, reason: apptReason, notes: apptNotes
      });
      toast.success('Consulta agendada!');
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const handleSaveVaccine = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/vaccines`, {
        name: vacName, dose: vacDose, date: vacDate, location: vacLocation, notes: vacNotes
      });
      toast.success('Vacina registrada!');
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 animate-in slide-in-from-bottom-4 duration-300 pb-24">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full mr-2 bg-muted/50">
            <ChevronLeft size={22} />
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {tab === 'appointments' ? 'Nova Consulta' : 'Nova Vacina'}
          </h1>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-5 space-y-4">
            {tab === 'appointments' ? (
              <>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Médico/Profissional</Label>
                  <Input value={apptProfessional} onChange={e => setApptProfessional(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Especialidade (Opcional)</Label>
                  <Input value={apptSpecialty} onChange={e => setApptSpecialty(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-muted-foreground">Data</Label>
                    <Input type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-muted-foreground">Horário</Label>
                    <Input type="time" value={apptTime} onChange={e => setApptTime(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
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
                <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSaveAppointment}>Salvar Consulta</Button>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label className="font-bold text-muted-foreground">Nome da Vacina</Label>
                  <Input value={vacName} onChange={e => setVacName(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-muted-foreground">Dose</Label>
                    <Input placeholder="Ex: 1ª dose" value={vacDose} onChange={e => setVacDose(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-muted-foreground">Data</Label>
                    <Input type="date" value={vacDate} onChange={e => setVacDate(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
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
                <Button size="lg" className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSaveVaccine}>Salvar Vacina</Button>
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
          <TabsTrigger value="growth" className="rounded-xl text-sm font-bold flex-1"><LineChartIcon size={16} className="mr-2" /> Crescimento</TabsTrigger>
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
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-foreground text-lg">{a.professional}</h3>
                      {a.specialty && <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{a.specialty}</span>}
                    </div>
                    <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(a.date)} {a.time && `às ${a.time}`}</div>
                      {a.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {a.location}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={() => setShowForm(true)}><Plus size={20} className="mr-2"/> Agendar Consulta</Button>
          </div>
        )}

        {tab === 'vaccines' && (
          <div className="space-y-4">
            {vaccines.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Syringe size={48} className="mx-auto mb-4 opacity-50" /><p>Nenhuma vacina</p></div>
            ) : (
              vaccines.map(v => (
                <Card key={v.id} className="border-border/50 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-foreground text-lg">{v.name}</h3>
                      {v.dose && <span className="text-sm font-bold text-muted-foreground">{v.dose}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5"><Clock size={14}/> {formatDate(v.date)}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 mt-4" onClick={() => setShowForm(true)}><Plus size={20} className="mr-2"/> Registrar Vacina</Button>
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
    </div>
  );
}
