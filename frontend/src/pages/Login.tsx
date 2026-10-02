import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bem-vindo(a) de volta! 👋');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D946EF]/15 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-[400px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
            <img src="/logo.png" alt="Nuna" className="relative w-24 h-24 rounded-[1.5rem] shadow-2xl app-logo-image" />
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent pb-1">Nuna</h1>
          <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
            Acompanhe a rotina do seu bebê <Sparkles size={16} className="text-primary" />
          </p>
        </div>

        <Card className="border-white/10 dark:border-white/5 shadow-2xl shadow-primary/10 rounded-[32px] bg-card/80 backdrop-blur-3xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="font-bold text-foreground ml-1">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-14 rounded-2xl bg-muted/60 border-transparent focus:bg-background focus:border-primary/50 transition-all text-base"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label className="font-bold text-foreground">Senha</Label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Esqueceu?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-14 rounded-2xl bg-muted/60 border-transparent focus:bg-background focus:border-primary/50 transition-all text-base"
                />
              </div>

              <Button type="submit" className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/30 mt-6 hover:scale-[1.02] active:scale-[0.98] transition-transform" disabled={loading}>
                {loading ? 'Entrando...' : (
                  <>
                    Entrar na Conta
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-10 text-muted-foreground font-medium">
          Ainda não tem conta? <br/>
          <Link to="/register" className="text-primary font-bold hover:underline inline-flex items-center gap-1 mt-1">
            Criar conta gratuita agora <ArrowRight size={14} />
          </Link>
        </p>

      </div>
    </div>
  );
}
