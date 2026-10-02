import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { DashboardData } from '../types';
import { formatDuration, formatTimeAgo } from '../utils/helpers';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ChevronRight, Calendar, Baby, Moon, Droplets, Ruler, Bath, Pill } from 'lucide-react';

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
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

      const res = await api.get(`/children/${selectedChild.id}/dashboard`, {
        params: { todayStart, todayEnd }
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChild && childrenList.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[70vh] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Baby size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo ao NUNA!</h2>
        <p className="text-muted-foreground mb-8 max-w-[280px]">Cadastre sua primeira criança para começar a acompanhar a rotina.</p>
        <Button size="lg" className="w-full rounded-full h-14 text-base shadow-lg shadow-primary/25" onClick={() => navigate('/children/new')}>
          <Plus className="mr-2" /> Adicionar Criança
        </Button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  const { today } = data;

  const activities = [
    { key: 'sleep', title: 'Sono', subtitle: today.sleep.activeSleep ? 'Dormindo agora' : (today.sleep.totalMinutes === 0 ? 'Hoje: 0min' : `Hoje: ${formatDuration(today.sleep.totalMinutes)}`), icon: <Moon className="text-[#8B5CF6]" size={24} />, bg: 'bg-[#DCCBFF]', link: '/add?type=sleep' },
    { key: 'feeding', title: 'Mamadas', subtitle: today.feeding.count > 0 ? `${today.feeding.count} vez(es)` : 'Nenhuma', icon: <Baby className="text-[#D946EF]" size={24} />, bg: 'bg-[#F9C2D9]', link: '/add?type=feeding' },
    { key: 'diaper', title: 'Fraldas', subtitle: (today.diaper.peeCount || today.diaper.poopCount) ? `${today.diaper.peeCount} xixi, ${today.diaper.poopCount} cocô` : 'Nenhuma', icon: <Droplets className="text-[#0D9488]" size={24} />, bg: 'bg-[#BEEFE5]', link: '/add?type=diaper' },
    { key: 'growth', title: 'Peso e Medidas', subtitle: 'Acompanhar', icon: <Ruler className="text-[#D97706]" size={24} />, bg: 'bg-[#FFE3A3]', link: '/add?type=growth' },
  ];

  return (
    <div className="flex flex-col gap-6 px-6 pt-8 pb-4 animate-in fade-in duration-500">
      
      {/* Greeting Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">
            Olá, <br/>
            <span className="text-primary">{selectedChild?.name || user?.name?.split(' ')[0] || 'Responsável'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium flex items-center gap-1.5">
            <span>👋</span> Acompanhe a rotina da sua pequena 💜
          </p>
        </div>
        <img src="/logo.png" alt="Baby Illustration" className="w-20 h-20 object-contain drop-shadow-sm opacity-90 app-logo-image" />
      </div>

      {/* Resumo do Dia Card */}
      <Card className="border-0 shadow-xl shadow-primary/20 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white rounded-[28px] overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Calendar size={20} className="opacity-90" />
              Resumo de Hoje
            </div>
            <button onClick={() => navigate('/timeline')} className="text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 flex items-center transition-opacity">
              Ver mais <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
          
          <div className="flex justify-between items-end px-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Baby size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">Mamadas</span>
              <span className="text-2xl font-black">{today.feeding.count < 10 ? `0${today.feeding.count}` : today.feeding.count}</span>
            </div>
            
            <div className="w-px h-16 bg-white/20 mb-2" />

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Moon size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">Sono</span>
              <span className="text-2xl font-black">{today.sleep.totalMinutes === 0 ? '0m' : formatDuration(today.sleep.totalMinutes).replace('h', 'h ').replace('min', 'm')}</span>
            </div>

            <div className="w-px h-16 bg-white/20 mb-2" />

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Droplets size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">Fraldas</span>
              <span className="text-2xl font-black">
                {(today.diaper.peeCount + today.diaper.poopCount) < 10 
                  ? `0${today.diaper.peeCount + today.diaper.poopCount}` 
                  : (today.diaper.peeCount + today.diaper.poopCount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas / Atividades */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Atividades</h2>
          <button onClick={() => navigate('/more')} className="text-xs font-bold text-primary uppercase tracking-wider">Ver Todas</button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {activities.map(act => (
            <Card key={act.key} onClick={() => navigate(act.link)} className="border-border/50 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer rounded-2xl overflow-hidden bg-card">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.bg}`}>
                    {act.icon}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Plus size={16} strokeWidth={3} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{act.title}</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5 line-clamp-1">{act.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
