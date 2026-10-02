import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Bell, Palette, User, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('Nuna-theme') || 'auto');

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      updateUser(res.data.data);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar perfil.');
    } finally { setSavingProfile(false); }
  };

  const handleChangePassword = async () => {
    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Senha alterada com segurança!');
      setCurrentPassword(''); setNewPassword('');
    } catch (err: any) {
      toast.error('A senha atual está incorreta.');
    } finally { setSavingPassword(false); }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('Nuna-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight">Configurações</h1>
      </div>

      <div className="space-y-6">
        
        {/* Aparência */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">Aparência</h2>
          </div>
          <Card className="border-border/50 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base font-medium">
                  <SelectValue placeholder="Tema do App" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (Sistema)</SelectItem>
                  <SelectItem value="light">☀️ Modo Claro</SelectItem>
                  <SelectItem value="dark">🌙 Modo Escuro</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </section>

        {/* Notificações */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bell size={20} className="text-[#D97706]" />
            <h2 className="text-lg font-bold text-foreground">Notificações</h2>
          </div>
          <Card className="border-border/50 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex flex-col gap-3 text-center">
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Ative as notificações para receber alertas de rotina, remédios e vacinas.
              </p>
              <Button 
                variant="secondary" 
                className="w-full h-12 rounded-xl font-bold bg-[#FFE3A3]/50 text-[#D97706] hover:bg-[#FFE3A3]"
                onClick={async () => {
                  try {
                    const { subscribeToPushNotifications } = await import('../services/pushApi');
                    await subscribeToPushNotifications();
                    toast.success('Notificações ativadas! 🔔');
                  } catch (err: any) {
                    toast.error('Erro ao ativar notificações. Verifique as permissões do navegador.');
                  }
                }}
              >
                Permitir Notificações
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Perfil */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <User size={20} className="text-[#0D9488]" />
            <h2 className="text-lg font-bold text-foreground">Meus Dados</h2>
          </div>
          <Card className="border-border/50 shadow-sm rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Nome Completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">WhatsApp / Telefone</Label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <Button className="w-full h-12 rounded-xl font-bold shadow-sm" onClick={handleUpdateProfile} disabled={savingProfile}>
                {savingProfile ? 'Salvando...' : 'Salvar Dados'}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Senha */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Segurança</h2>
          </div>
          <Card className="border-border/50 shadow-sm rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Senha Atual</Label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Nova Senha</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2" onClick={handleChangePassword} disabled={savingPassword || !currentPassword || newPassword.length < 6}>
                {savingPassword ? 'Atualizando...' : 'Alterar Senha'}
              </Button>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
