import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { subDays } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Baby, Moon, Droplets, Ruler, BarChart2, ArrowRight } from 'lucide-react';

const COLORS = ['#7C3AED', '#F9C2D9', '#DCCBFF', '#BEEFE5', '#FFE3A3', '#BDEBF3'];

type Period = 'today' | 'yesterday' | '7d' | '30d';

export default function ReportsPage() {
  const { selectedChild } = useChild();
  const [period, setPeriod] = useState<Period>('7d');
  const [reportType, setReportType] = useState('feeding');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedChild) loadReport();
  }, [selectedChild, period, reportType]);

  const getDateRange = () => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
    let startOfDay: string;

    const getStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
    const getEnd = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

    switch (period) {
      case 'today': startOfDay = getStart(now); break;
      case 'yesterday': 
        const yesterday = subDays(now, 1);
        return { startDate: getStart(yesterday), endDate: getEnd(yesterday) };
      case '7d': startOfDay = getStart(subDays(now, 7)); break;
      case '30d': startOfDay = getStart(subDays(now, 30)); break;
      default: startOfDay = getStart(subDays(now, 7));
    }
    return { startDate: startOfDay, endDate: endOfDay };
  };

  const loadReport = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const res = await api.get(`/children/${selectedChild.id}/reports`, {
        params: { type: reportType, startDate, endDate }
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}`;
  };

  const renderFeedingReport = () => {
    if (!data) return null;
    const typeData = Object.entries(data.byType || {}).map(([name, value]) => ({
      name: name === 'peito' ? 'Peito' : name === 'formula' ? 'Fórmula' : name,
      value: value as number,
    }));

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm bg-[#F9C2D9]/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#D946EF]">{data.total}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Mamadas</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#F9C2D9]/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#D946EF]">{data.totalMl}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Total (ml)</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#F9C2D9]/20">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#D946EF]">{data.avgMl}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Média (ml)</span>
            </CardContent>
          </Card>
        </div>

        {data.daily?.length > 0 && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">Evolução diária (ml)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.daily} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatDateBR} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="totalMl" fill="#D946EF" radius={[6, 6, 0, 0]} name="Volume (ml)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {typeData.length > 0 && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">Distribuição</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderSleepReport = () => {
    if (!data) return null;
    const totalHours = Math.floor(data.totalMinutes / 60);
    const totalMins = data.totalMinutes % 60;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm bg-[#DCCBFF]/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-[#8B5CF6] leading-none mb-1">{totalHours}h {totalMins}m</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#DCCBFF]/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#8B5CF6]">{data.total}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Sonecas</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#DCCBFF]/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-[#8B5CF6] leading-none mb-1">{data.avgDuration}m</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Média</span>
            </CardContent>
          </Card>
        </div>

        {data.daily?.length > 0 && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">Tempo de Sono (min)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.daily} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatDateBR} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="totalMinutes" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Minutos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDiaperReport = () => {
    if (!data) return null;
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm bg-muted/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground">{data.total}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Total</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#BEEFE5]/40">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#0D9488]">{data.peeCount}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Xixi</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-[#FFE4E6]/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#E11D48]">{data.poopCount}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Cocô</span>
            </CardContent>
          </Card>
        </div>

        {data.daily?.length > 0 && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">Fraldas por dia</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.daily} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatDateBR} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="pee" fill="#0D9488" radius={[0, 0, 0, 0]} name="Xixi" stackId="a" />
                  <Bar dataKey="poop" fill="#E11D48" radius={[6, 6, 0, 0]} name="Cocô" stackId="a" />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} iconType="circle" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderWeightReport = () => {
    if (!data?.records?.length) {
      return (
        <div className="flex flex-col items-center justify-center p-8 mt-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Ruler size={24} className="text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Sem dados de crescimento</h2>
          <p className="text-muted-foreground text-sm">Registre o peso e altura para ver o gráfico.</p>
        </div>
      );
    }
    
    return (
      <Card className="border-border/50 shadow-sm animate-in fade-in duration-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-foreground">Evolução de Crescimento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatDateBR} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="weight" stroke="#D97706" strokeWidth={3} dot={{ fill: '#D97706', r: 4, strokeWidth: 0 }} name="Peso (kg)" />
              {data.records[0]?.height && <Line type="monotone" dataKey="height" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', r: 4, strokeWidth: 0 }} name="Altura (cm)" />}
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} iconType="circle" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-background px-6 py-6 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Relatórios</h1>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 flex items-center gap-1">
          Deslize <ArrowRight size={10} />
        </span>
      </div>

      <ScrollArea className="w-[calc(100%+48px)] -ml-6 whitespace-nowrap mb-6 pb-4">
        <div className="flex w-max space-x-2 px-6 pb-2">
          {[
            { key: 'feeding', label: 'Alimentação', icon: <Baby size={16} /> },
            { key: 'sleep', label: 'Sono', icon: <Moon size={16} /> },
            { key: 'diaper', label: 'Fraldas', icon: <Droplets size={16} /> },
            { key: 'weight', label: 'Crescimento', icon: <Ruler size={16} /> }
          ].map((item) => (
            <Button 
              key={item.key} 
              variant={reportType === item.key ? 'default' : 'secondary'}
              size="sm"
              className={`rounded-full px-4 h-10 font-bold transition-all ${reportType === item.key ? 'shadow-md shadow-primary/20' : ''}`}
              onClick={() => setReportType(item.key)}
            >
              <span className="mr-2 opacity-80">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Tabs defaultValue="7d" value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-full mb-6">
        <TabsList className="w-full grid grid-cols-4 h-11 bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="today" className="rounded-lg text-xs font-bold">Hoje</TabsTrigger>
          <TabsTrigger value="yesterday" className="rounded-lg text-xs font-bold">Ontem</TabsTrigger>
          <TabsTrigger value="7d" className="rounded-lg text-xs font-bold">7 dias</TabsTrigger>
          <TabsTrigger value="30d" className="rounded-lg text-xs font-bold">30 dias</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="h-[280px] rounded-2xl w-full" />
        </div>
      ) : (
        <div className="w-full">
          {reportType === 'feeding' && renderFeedingReport()}
          {reportType === 'sleep' && renderSleepReport()}
          {reportType === 'diaper' && renderDiaperReport()}
          {reportType === 'weight' && renderWeightReport()}
        </div>
      )}
    </div>
  );
}
