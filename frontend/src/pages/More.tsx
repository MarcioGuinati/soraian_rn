import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronRight, Baby, Calendar, HeartPulse, Syringe, Bell, Moon, Settings } from 'lucide-react';

export default function MorePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Até logo! 👋');
    navigate('/login');
  };

  const menuItems = [
    { icon: <Baby size={22} className="text-[#D946EF]" />, label: 'Crianças', desc: 'Gerenciar perfis e dados', path: '/children', bg: 'bg-[#F9C2D9]/30' },
    { icon: <Calendar size={22} className="text-[#0D9488]" />, label: 'Calendário', desc: 'Histórico de eventos', path: '/calendar', bg: 'bg-[#BEEFE5]/50' },
    { icon: <HeartPulse size={22} className="text-[#E11D48]" />, label: 'Saúde', desc: 'Consultas e medidas', path: '/health', bg: 'bg-[#FFE4E6]' },
    { icon: <Syringe size={22} className="text-[#0284C7]" />, label: 'Vacinas (SUS)', desc: 'Calendário de vacinação', path: '/vaccines-sus', bg: 'bg-[#BDEBF3]/50' },
    { icon: <Bell size={22} className="text-[#D97706]" />, label: 'Lembretes', desc: 'Alarmes e notificações', path: '/reminders', bg: 'bg-[#FFE3A3]/50' },
    { icon: <Moon size={22} className="text-[#6D28D9]" />, label: 'Dicas de Sono', desc: 'Saltos e orientações', path: '/sleep-tips', bg: 'bg-[#DCCBFF]/40' },
    { icon: <Settings size={22} className="text-muted-foreground" />, label: 'Configurações', desc: 'Sua conta e preferências', path: '/settings', bg: 'bg-muted' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Menu</h1>
      </div>

      <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-[24px] border border-border/50">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-md">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-bold text-foreground truncate">{user?.name || 'Responsável'}</h2>
          <p className="text-sm text-muted-foreground truncate">Administrador</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {menuItems.map((item) => (
          <Card key={item.path} onClick={() => navigate(item.path)} className="border-0 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer rounded-2xl bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base">{item.label}</h3>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground/50 shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="destructive" size="lg" className="w-full rounded-full font-bold h-14 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-none" onClick={handleLogout}>
        <LogOut size={20} className="mr-2" />
        Sair da conta
      </Button>

    </div>
  );
}
