import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Se o e-mail estiver cadastrado, você receberá um link de recuperação.');
    } catch (err: any) {
      toast.error('Ocorreu um erro ao tentar recuperar a senha.');
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
            Recuperar Senha <Sparkles size={16} className="text-primary" />
          </p>
        </div>

        <Card className="border-white/10 dark:border-white/5 shadow-2xl shadow-primary/10 rounded-[32px] bg-card/80 backdrop-blur-3xl">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Send size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">E-mail enviado!</h3>
                  <p className="text-muted-foreground">
                    Verifique sua caixa de entrada (e a pasta de spam) para encontrar o link de redefinição de senha.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-base font-bold mt-6"
                >
                  Voltar para o Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-foreground ml-1">E-mail cadastrado</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-14 rounded-2xl bg-muted/60 border-transparent focus:bg-background focus:border-primary/50 transition-all text-base"
                  />
                  <p className="text-xs text-muted-foreground ml-1 mt-1">
                    Enviaremos um link seguro para você criar uma nova senha.
                  </p>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/30 mt-6 hover:scale-[1.02] active:scale-[0.98] transition-transform" disabled={loading}>
                  {loading ? 'Enviando...' : (
                    <>
                      Enviar link de recuperação
                      <Send size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-10">
          <Link to="/login" className="text-muted-foreground hover:text-primary font-bold inline-flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
}
