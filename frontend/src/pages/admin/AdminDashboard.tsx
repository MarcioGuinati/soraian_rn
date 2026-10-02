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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  if (!stats) return null;

  const recordItems = [
    { icon: <Baby size={20} className="text-[#8B5CF6]" />, label: 'Amamentações', count: stats.records.feedings, bg: 'bg-[#7C3AED]/20' },
    { icon: <Baby size={20} className="text-orange-400" />, label: 'Fraldas', count: stats.records.diapers, bg: 'bg-orange-500/20' },
    { icon: <Moon size={20} className="text-blue-400" />, label: 'Sonos', count: stats.records.sleeps, bg: 'bg-blue-500/20' },
    { icon: <Activity size={20} className="text-cyan-400" />, label: 'Banhos', count: stats.records.baths, bg: 'bg-cyan-500/20' },
    { icon: <FileText size={20} className="text-rose-400" />, label: 'Medicamentos', count: stats.records.medications, bg: 'bg-rose-500/20' },
    { icon: <Syringe size={20} className="text-emerald-400" />, label: 'Vacinas', count: stats.records.vaccines, bg: 'bg-emerald-500/20' },
    { icon: <Stethoscope size={20} className="text-indigo-400" />, label: 'Consultas', count: stats.records.appointments, bg: 'bg-indigo-500/20' },
    { icon: <FileText size={20} className="text-yellow-400" />, label: 'Notas', count: stats.records.notes, bg: 'bg-yellow-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
        <p className="text-[#A7A8C2]">Visão geral e métricas da plataforma Nuna.</p>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#151630] border-white/5 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A7A8C2]">Total de Usuários</CardTitle>
            <Users size={16} className="text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#151630] border-white/5 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A7A8C2]">Crianças Cadastradas</CardTitle>
            <Baby size={16} className="text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalChildren}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#151630] border-white/5 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A7A8C2]">Novos Usuários (7d)</CardTitle>
            <Users size={16} className="text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.newUsersLast7Days}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#151630] border-white/5 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#A7A8C2]">Registros Hoje</CardTitle>
            <Database size={16} className="text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.recordsToday}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database size={20} className="text-[#8B5CF6]" /> Total de Registros
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {recordItems.map((item) => (
              <div key={item.label} className="bg-[#151630] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xl font-bold text-white leading-none">{item.count}</div>
                  <div className="text-xs text-[#A7A8C2] mt-1">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-[#8B5CF6]" /> Crescimento
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-[#151630] border-white/5 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#A7A8C2]">Novos Usuários (30 dias)</CardTitle>
                <Clock size={16} className="text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.newUsersLast30Days}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#151630] border-white/5 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#A7A8C2]">Média Filhos por Usuário</CardTitle>
                <LayoutDashboard size={16} className="text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
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

