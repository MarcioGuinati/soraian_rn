import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Conta criada com sucesso! 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500 py-12">
      <div className="w-full max-w-[400px]">
        
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/logo.png" alt="Nuna" className="w-16 h-16 rounded-2xl mb-4 shadow-sm" />
          <h1 className="text-3xl font-extrabold tracking-tight">Criar Conta</h1>
          <p className="text-muted-foreground mt-2 font-medium">Junte-se ao Nuna gratuitamente</p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Como você se chama?</Label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base"
                />
              </div>

              <div className="space-y-1.5 pb-2">
                <Label className="font-bold text-muted-foreground">Confirmar Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base"
                />
              </div>

              <Button type="submit" className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Criando...' : 'Criar minha conta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-muted-foreground font-medium">
          Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Fazer login</Link>
        </p>

      </div>
    </div>
  );
}
