import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Baby, Activity, Database, Syringe, Clock, Stethoscope, FileText, Moon, LayoutDashboard } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  const recordItems = [
    { icon: <Baby size={20} className="text-primary" />, label: 'Amamentações', count: stats.records.feedings, bg: 'bg-primary/20' },
    { icon: <Baby size={20} className="text-orange-500" />, label: 'Fraldas', count: stats.records.diapers, bg: 'bg-orange-500/20' },
    { icon: <Moon size={20} className="text-blue-500" />, label: 'Sonos', count: stats.records.sleeps, bg: 'bg-blue-500/20' },
    { icon: <Activity size={20} className="text-cyan-500" />, label: 'Banhos', count: stats.records.baths, bg: 'bg-cyan-500/20' },
    { icon: <FileText size={20} className="text-rose-500" />, label: 'Medicamentos', count: stats.records.medications, bg: 'bg-rose-500/20' },
    { icon: <Syringe size={20} className="text-emerald-500" />, label: 'Vacinas', count: stats.records.vaccines, bg: 'bg-emerald-500/20' },
    { icon: <Stethoscope size={20} className="text-indigo-500" />, label: 'Consultas', count: stats.records.appointments, bg: 'bg-indigo-500/20' },
    { icon: <FileText size={20} className="text-yellow-500" />, label: 'Notas', count: stats.records.notes, bg: 'bg-yellow-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral e métricas da plataforma Nuna.</p>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crianças Cadastradas</CardTitle>
            <Baby size={16} className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalChildren}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Usuários (7d)</CardTitle>
            <Users size={16} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.newUsersLast7Days}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registros Hoje</CardTitle>
            <Database size={16} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.recordsToday}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Database size={20} className="text-primary" /> Total de Registros
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {recordItems.map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground leading-none">{item.count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity size={20} className="text-primary" /> Crescimento
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-card border-border shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Novos Usuários (30 dias)</CardTitle>
                <Clock size={16} className="text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.newUsersLast30Days}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média Filhos por Usuário</CardTitle>
                <LayoutDashboard size={16} className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalChildren > 0 ? (stats.totalChildren / stats.totalUsers).toFixed(1) : '0'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

