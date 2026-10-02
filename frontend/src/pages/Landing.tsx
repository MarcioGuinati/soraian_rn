import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, LineChart, Baby, ShieldCheck, ChevronRight, Moon } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Nuna" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-xl tracking-tight text-primary">NUNA</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="font-bold" onClick={() => navigate('/login')}>Entrar</Button>
            <Button className="font-bold rounded-full shadow-lg shadow-primary/20" onClick={() => navigate('/register')}>Criar Conta</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24">
        <div className="container mx-auto flex flex-col items-center text-center max-w-3xl animate-in slide-in-from-bottom-8 duration-700">
          <Badge variant="secondary" className="mb-6 py-1.5 px-4 rounded-full text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20">
            ✨ O aplicativo mais amado pelos pais
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            A rotina do seu bebê na <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#D946EF]">palma da sua mão</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-medium">
            Acompanhe o sono, mamadas, trocas de fralda e a saúde do seu pequeno em um aplicativo inteligente, premium e feito para pais modernos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold shadow-xl shadow-primary/25" onClick={() => navigate('/register')}>
              Começar Agora <ChevronRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-bold border-2" onClick={() => navigate('/login')}>
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Tudo o que você precisa</h2>
            <p className="text-lg text-muted-foreground">O Nuna foi desenhado do zero para simplificar as suas noites e dias com uma experiência premium.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg shadow-black/5 bg-background rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#DCCBFF] text-[#6D28D9] rounded-2xl flex items-center justify-center mb-6">
                  <Moon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Rotina de Sono</h3>
                <p className="text-muted-foreground leading-relaxed">Acompanhe as sonecas e receba relatórios detalhados para melhorar a qualidade do sono do bebê.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-black/5 bg-background rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#F9C2D9] text-[#D946EF] rounded-2xl flex items-center justify-center mb-6">
                  <Baby size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Alimentação</h3>
                <p className="text-muted-foreground leading-relaxed">Controle amamentação, fórmulas e introdução alimentar de forma rápida e intuitiva.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-black/5 bg-background rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#BEEFE5] text-[#0D9488] rounded-2xl flex items-center justify-center mb-6">
                  <LineChart size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Evolução Clara</h3>
                <p className="text-muted-foreground leading-relaxed">Gráficos de crescimento e relatórios precisos perfeitos para mostrar ao pediatra.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-black/5 bg-background rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#FFE3A3] text-[#D97706] rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Compartilhado</h3>
                <p className="text-muted-foreground leading-relaxed">Toda a rede de apoio sincronizada. Pais, avós e babás na mesma página.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-[40px] p-10 md:p-16 text-center text-white shadow-2xl shadow-primary/30">
          <Heart size={48} className="mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Pronto para transformar sua rotina?</h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">Junte-se a diversas famílias que confiam no Nuna todos os dias.</p>
          <Button size="lg" className="h-16 px-10 rounded-full text-lg font-black bg-white text-primary hover:bg-gray-100 shadow-xl" onClick={() => navigate('/register')}>
            Criar conta gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Nuna" className="w-6 h-6 grayscale opacity-50" />
            <span>© 2026 Nuna Baby.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
