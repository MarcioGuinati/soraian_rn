import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Token de recuperação inválido ou ausente.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast.success('Senha atualizada com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Link Inválido</h2>
          <p className="text-muted-foreground mb-6">O link de redefinição de senha está incompleto ou inválido.</p>
          <Button onClick={() => navigate('/login')}>Voltar para o Login</Button>
        </div>
      </div>
    );
  }

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
            Criar Nova Senha <Sparkles size={16} className="text-primary" />
          </p>
        </div>

        <Card className="border-white/10 dark:border-white/5 shadow-2xl shadow-primary/10 rounded-[32px] bg-card/80 backdrop-blur-3xl">
          <CardContent className="p-6 sm:p-8">
            {success ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Tudo certo!</h3>
                  <p className="text-muted-foreground">
                    Sua nova senha foi salva e você já pode acessar o Nuna novamente.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full h-14 rounded-2xl text-base font-bold mt-6"
                >
                  Entrar na Conta
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-foreground ml-1">Nova Senha</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-14 rounded-2xl bg-muted/60 border-transparent focus:bg-background focus:border-primary/50 transition-all text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-foreground ml-1">Confirme a Nova Senha</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-14 rounded-2xl bg-muted/60 border-transparent focus:bg-background focus:border-primary/50 transition-all text-base"
                  />
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/30 mt-6 hover:scale-[1.02] active:scale-[0.98] transition-transform" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
