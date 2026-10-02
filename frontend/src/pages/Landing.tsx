import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, LineChart, Baby, ShieldCheck, ChevronRight, Moon, CalendarDays, 
  Syringe, Clock, Star, Play, Lock, Smartphone, Menu, Pill, CheckCircle2,
  X, Radar
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1024] text-white font-sans overflow-x-hidden selection:bg-[#7C3AED]/30">
      {/* Navbar */}
      <header className="sticky border-b-[1px] border-white/10 top-0 z-40 w-full bg-[#0F1024]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0F1024]/60">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Nuna" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-extrabold text-xl tracking-tight text-white">NUNA</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A7A8C2]">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#demo" className="hover:text-white transition-colors">App</a>
            <a href="#seguranca" className="hover:text-white transition-colors">Segurança</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="font-semibold text-white hover:text-white hover:bg-white/10 h-9 px-4" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button className="font-semibold rounded-md bg-[#7C3AED] hover:bg-[#8B5CF6] text-white h-9 px-5 transition-colors" onClick={() => navigate('/register')}>
              Criar Conta
            </Button>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 w-full bg-[#151630] border-b border-white/5 p-4 flex flex-col gap-4 md:hidden shadow-xl">
            <a href="#recursos" onClick={() => setIsMenuOpen(false)} className="text-[#A7A8C2] font-medium p-2">Recursos</a>
            <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-[#A7A8C2] font-medium p-2">Como funciona</a>
            <a href="#seguranca" onClick={() => setIsMenuOpen(false)} className="text-[#A7A8C2] font-medium p-2">Segurança</a>
            <Separator className="bg-white/10" />
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5" onClick={() => navigate('/login')}>Entrar</Button>
            <Button className="w-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white" onClick={() => navigate('/register')}>Criar Conta</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <Badge variant="outline" className="mb-6 py-1 px-3 rounded-full text-xs font-semibold border-[#7C3AED]/30 text-[#8B5CF6] bg-[#7C3AED]/10">
            ✨ Feito por pais, para pais
          </Badge>
          
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              A rotina do seu bebê na{" "}
              <span className="inline bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
                palma da mão
              </span>
            </h1>{" "}
          </main>

          <p className="text-xl text-[#A7A8C2] md:w-10/12 mx-auto lg:mx-0">
            Diga adeus às anotações de papel. O NUNA ajuda você a registrar mamadas, sono, fraldas e o crescimento do bebê de forma simples, rápida e segura.
          </p>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-4">
            <Button className="w-full md:w-auto px-8 h-12 text-base font-bold bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all shadow-lg shadow-[#7C3AED]/20" onClick={() => navigate('/register')}>
              Criar Conta Gratuita
            </Button>

            <Button variant="outline" className="w-full md:w-auto px-8 h-12 text-base font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white transition-all flex items-center bg-transparent" onClick={() => window.open('https://github.com/MarcioGuinati/soraian_rn', '_blank')}>
              Ver Funcionalidades
            </Button>
          </div>
          
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F1024] bg-[#151630] overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex text-[#F59E0B] gap-0.5">
                <Star size={12} fill="currentColor" strokeWidth={0} />
                <Star size={12} fill="currentColor" strokeWidth={0} />
                <Star size={12} fill="currentColor" strokeWidth={0} />
                <Star size={12} fill="currentColor" strokeWidth={0} />
                <Star size={12} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-[12px] font-medium text-[#A7A8C2] mt-0.5">Mais de 2.000 famílias confiam</span>
            </div>
          </div>
        </div>

        {/* Hero Cards (SaaS Look) */}
        <div className="z-10 relative mt-10 lg:mt-0 w-full hidden md:block">
          <div className="absolute inset-0 bg-[#7C3AED]/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative w-full h-[450px]">
            {/* Card 1: Resumo */}
            <Card className="absolute top-4 right-4 w-[320px] bg-[#151630] border-white/10 shadow-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#8B5CF6]"><LineChart size={16}/></div>
                  <div>
                    <CardTitle className="text-white text-base">Resumo de Hoje</CardTitle>
                    <p className="text-xs text-[#A7A8C2]">Atualizado agora</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#0F1024] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-[#7C3AED]">6</div>
                    <div className="text-[10px] text-[#A7A8C2] font-medium">Mamadas</div>
                  </div>
                  <div className="bg-[#0F1024] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-blue-400">8h</div>
                    <div className="text-[10px] text-[#A7A8C2] font-medium">Sono</div>
                  </div>
                  <div className="bg-[#0F1024] rounded-lg p-2 text-center border border-white/5">
                    <div className="text-lg font-bold text-orange-400">5</div>
                    <div className="text-[10px] text-[#A7A8C2] font-medium">Fraldas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Alerta/Atividade */}
            <Card className="absolute bottom-12 left-0 w-[280px] bg-[#151630] border-white/10 shadow-2xl z-20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Próxima Soneca
                  <Badge variant="secondary" className="bg-[#7C3AED]/20 text-[#8B5CF6] hover:bg-[#7C3AED]/30">Em 30 min</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Moon size={24} className="text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Janela de Sono</p>
                    <p className="text-xs text-[#A7A8C2]">Baseado no padrão dos últimos 3 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Gráfico/Crescimento */}
            <Card className="absolute top-1/3 left-12 w-[260px] bg-[#151630] border-white/10 shadow-2xl z-10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-20 flex items-end gap-2">
                  <div className="w-1/4 bg-[#7C3AED]/20 rounded-t-sm h-1/2"></div>
                  <div className="w-1/4 bg-[#7C3AED]/40 rounded-t-sm h-2/3"></div>
                  <div className="w-1/4 bg-[#7C3AED]/60 rounded-t-sm h-3/4"></div>
                  <div className="w-1/4 bg-[#7C3AED] rounded-t-sm h-full relative">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white">5.2kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] pt-12 pb-24 sm:pb-32">
        <h2 className="text-center text-sm lg:text-base font-bold mb-8 text-[#A7A8C2] uppercase tracking-wider">
          Ferramenta recomendada por
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-[#A7A8C2]/60">
            <Heart size={24} />
            <h3 className="text-lg font-bold">Pais & Mães</h3>
          </div>
          <div className="flex items-center gap-2 text-[#A7A8C2]/60">
            <ShieldCheck size={24} />
            <h3 className="text-lg font-bold">Pediatras</h3>
          </div>
          <div className="flex items-center gap-2 text-[#A7A8C2]/60">
            <Baby size={24} />
            <h3 className="text-lg font-bold">Especialistas em Sono</h3>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="recursos" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] py-24 sm:py-32 space-y-8">
        <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
          Tudo o que você precisa em{" "}
          <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">
            um só lugar
          </span>
        </h2>
        
        <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-[#A7A8C2] md:text-center">
          Você foca no que realmente importa: cuidar. O NUNA ajuda a organizar os detalhes da rotina do bebê.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <Baby size={24} />
              </div>
              <CardTitle className="text-white">Mamadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Horário e duração</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Quantidade (fórmula)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Lado (amamentação)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <Moon size={24} />
              </div>
              <CardTitle className="text-white">Sono</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Início e fim</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Tempo total de sono</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Padrões da madrugada</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <Baby size={24} />
              </div>
              <CardTitle className="text-white">Fraldas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Registro de xixi e cocô</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Controle de consistência</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Horários das trocas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <LineChart size={24} />
              </div>
              <CardTitle className="text-white">Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Curvas da OMS</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Evolução de peso</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Altura e perímetro cefálico</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <Syringe size={24} />
              </div>
              <CardTitle className="text-white">Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Medicamentos</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Caderneta de vacinas</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Agendamento de consultas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#151630] border-white/10 shadow-none rounded-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-2">
                <Clock size={24} />
              </div>
              <CardTitle className="text-white">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#A7A8C2]">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Histórico completo</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Evolução diária</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Entendimento de padrões</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Como Funciona / Serviços */}
      <section id="como-funciona" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] py-24 sm:py-32">
        <h2 className="text-3xl lg:text-4xl font-bold md:text-center mb-12">
          Simples para <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">registrar</span>. Útil para <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">acompanhar</span>.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-[#7C3AED]/20 mb-4">01</span>
            <h3 className="text-xl font-bold mb-2">Registre</h3>
            <p className="text-[#A7A8C2] text-sm md:text-base max-w-[280px]">Adicione uma atividade do bebê em poucos segundos, sem complicação.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-[#7C3AED]/20 mb-4">02</span>
            <h3 className="text-xl font-bold mb-2">Acompanhe</h3>
            <p className="text-[#A7A8C2] text-sm md:text-base max-w-[280px]">Veja tudo o que aconteceu ao longo do dia em uma linha do tempo clara.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-[#7C3AED]/20 mb-4">03</span>
            <h3 className="text-xl font-bold mb-2">Entenda</h3>
            <p className="text-[#A7A8C2] text-sm md:text-base max-w-[280px]">Use gráficos e históricos para entender padrões e mostrar ao pediatra.</p>
          </div>
        </div>
      </section>

      {/* About / Demo section */}
      <section id="demo" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] py-24 sm:py-32">
        <div className="bg-[#151630] border border-white/10 rounded-xl py-12 px-6 sm:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Veja o <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">NUNA</span> em ação
              </h2>
              <p className="text-xl text-[#A7A8C2] leading-relaxed">
                Uma interface desenhada para ser rápida, afinal, você provavelmente está com o bebê no colo.
              </p>

              <Tabs defaultValue="mamadas" className="w-full mt-6">
                <TabsList className="bg-[#0F1024] border border-white/5 p-1 h-auto flex flex-wrap mb-6">
                  <TabsTrigger value="mamadas" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Mamadas</TabsTrigger>
                  <TabsTrigger value="sono" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Sono</TabsTrigger>
                  <TabsTrigger value="fraldas" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Fraldas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mamadas" className="mt-0">
                  <Card className="bg-[#0F1024] border-white/5 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#8B5CF6]"><Baby size={20}/></div>
                        <div>
                          <h4 className="font-bold">Última mamada</h4>
                          <p className="text-sm text-[#A7A8C2]">Há 2 horas • Peito Direito</p>
                        </div>
                      </div>
                      <Separator className="bg-white/5 my-4" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#A7A8C2]">Duração: 15 min</span>
                        <span className="text-[#7C3AED] font-medium">10:30 AM</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sono" className="mt-0">
                  <Card className="bg-[#0F1024] border-white/5 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Moon size={20}/></div>
                        <div>
                          <h4 className="font-bold">Soneca da tarde</h4>
                          <p className="text-sm text-[#A7A8C2]">Acordou há 30 min</p>
                        </div>
                      </div>
                      <Separator className="bg-white/5 my-4" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#A7A8C2]">Duração: 1h 20m</span>
                        <span className="text-blue-400 font-medium">14:00 - 15:20</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fraldas" className="mt-0">
                  <Card className="bg-[#0F1024] border-white/5 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400"><Baby size={20}/></div>
                        <div>
                          <h4 className="font-bold">Troca de Fralda</h4>
                          <p className="text-sm text-[#A7A8C2]">Xixi e Cocô</p>
                        </div>
                      </div>
                      <Separator className="bg-white/5 my-4" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#A7A8C2]">Consistência: Normal</span>
                        <span className="text-orange-400 font-medium">09:15 AM</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Mockup (Web App Look) */}
            <div className="relative mx-auto w-full lg:col-span-2 mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-[60px] rounded-full" />
              <div className="relative bg-[#0F1024] border border-[#2a2c4e] rounded-xl w-full overflow-hidden shadow-2xl flex flex-col hidden md:flex h-[500px]">
                {/* Browser fake header */}
                <div className="h-10 w-full flex items-center px-4 bg-[#151630] border-b border-[#2a2c4e] gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="ml-4 px-3 py-1 bg-[#0F1024] rounded-md text-xs text-[#A7A8C2] border border-white/5 w-[200px]">
                    app.nuna.care
                  </div>
                </div>
                
                {/* Dashboard layout */}
                <div className="flex-1 flex">
                  {/* Sidebar */}
                  <div className="w-[200px] border-r border-[#2a2c4e] bg-[#151630]/50 p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center"><Baby size={14} className="text-white"/></div>
                      <span className="font-bold text-sm">Dashboard</span>
                    </div>
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-[#7C3AED]/20 text-[#8B5CF6] rounded-md text-xs font-bold flex items-center gap-2">
                        <LineChart size={14}/> Visão Geral
                      </div>
                      <div className="px-3 py-2 text-[#A7A8C2] hover:bg-white/5 rounded-md text-xs font-medium flex items-center gap-2">
                        <Baby size={14}/> Mamadas
                      </div>
                      <div className="px-3 py-2 text-[#A7A8C2] hover:bg-white/5 rounded-md text-xs font-medium flex items-center gap-2">
                        <Moon size={14}/> Sono
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Visão Geral de Hoje</h3>
                        <p className="text-xs text-[#A7A8C2]">Atualizado há 5 min</p>
                      </div>
                      <Button size="sm" className="bg-[#7C3AED] h-8 text-xs font-bold">+ Novo Registro</Button>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-[#151630] rounded-xl p-4 border border-white/5 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Baby size={14} className="text-[#8B5CF6]"/>
                          <span className="text-xs text-[#A7A8C2] font-medium uppercase">Mamadas</span>
                        </div>
                        <div className="text-2xl font-bold">6</div>
                        <div className="text-[10px] text-green-400 mt-1">Total de 45 min</div>
                      </div>
                      <div className="bg-[#151630] rounded-xl p-4 border border-white/5 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Moon size={14} className="text-blue-400"/>
                          <span className="text-xs text-[#A7A8C2] font-medium uppercase">Sono</span>
                        </div>
                        <div className="text-2xl font-bold">8h 20m</div>
                        <div className="text-[10px] text-[#A7A8C2] mt-1">2 sonecas</div>
                      </div>
                      <div className="bg-[#151630] rounded-xl p-4 border border-white/5 shadow-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Baby size={14} className="text-orange-400"/>
                          <span className="text-xs text-[#A7A8C2] font-medium uppercase">Fraldas</span>
                        </div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-[10px] text-[#A7A8C2] mt-1">2 trocas recentes</div>
                      </div>
                      <div className="bg-[#151630] rounded-xl p-4 border border-white/5 shadow-md flex items-center justify-center">
                        <LineChart className="text-[#A7A8C2]/30 w-12 h-12" />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 bg-[#151630] rounded-xl border border-white/5 p-4 flex flex-col">
                      <h4 className="text-xs font-bold text-[#A7A8C2] mb-4 uppercase">Últimos Registros</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#8B5CF6]"><Baby size={14}/></div>
                          <div className="flex-1">
                            <div className="text-sm font-bold">Mamadeira (120ml)</div>
                            <div className="text-xs text-[#A7A8C2]">Leite materno</div>
                          </div>
                          <div className="text-xs text-[#A7A8C2]">08:32</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Moon size={14}/></div>
                          <div className="flex-1">
                            <div className="text-sm font-bold">Acordou da soneca</div>
                            <div className="text-xs text-[#A7A8C2]">Duração: 45m</div>
                          </div>
                          <div className="text-xs text-[#A7A8C2]">07:15</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[800px] py-24 sm:py-32">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Dúvidas <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">Frequentes</span>
        </h2>
        <p className="text-xl text-[#A7A8C2] mb-8">
          Tudo o que você precisa saber sobre o NUNA.
        </p>

        <Accordion type="single" collapsible className="w-full AccordionRoot">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-lg">O que é o NUNA?</AccordionTrigger>
            <AccordionContent className="text-[#A7A8C2] text-base">
              O NUNA é um aplicativo feito para ajudar pais e responsáveis a organizar, registrar e acompanhar a rotina completa do bebê em um só lugar.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-lg">O que posso registrar?</AccordionTrigger>
            <AccordionContent className="text-[#A7A8C2] text-base">
              Você pode registrar mamadas (peito e fórmula), sonecas e sono noturno, trocas de fralda, crescimento (peso e altura), saúde (vacinas e remédios) e muito mais.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-lg">Posso compartilhar com outro responsável?</AccordionTrigger>
            <AccordionContent className="text-[#A7A8C2] text-base">
              Sim! Você pode fazer login em múltiplos dispositivos para que toda a rede de apoio (pais, avós, babás) acompanhe a mesma linha do tempo em tempo real.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-lg">O NUNA substitui orientação médica?</AccordionTrigger>
            <AccordionContent className="text-[#A7A8C2] text-base">
              Não. O NUNA é uma ferramenta de acompanhamento e organização do dia a dia, e nunca substitui a orientação, diagnóstico ou tratamento de pediatras e profissionais de saúde.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section */}
      <section id="cta" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] py-24 sm:py-32">
        <div className="bg-[#151630] border border-white/10 rounded-xl py-12 px-6 sm:px-12 text-center place-items-center">
          <Heart size={40} className="mx-auto mb-6 text-[#7C3AED] animate-pulse" fill="currentColor" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Menos preocupação em lembrar. <span className="bg-gradient-to-b from-[#8B5CF6]/60 to-[#8B5CF6] text-transparent bg-clip-text">Mais tempo para cuidar.</span>
          </h2>
          <p className="text-xl text-[#A7A8C2] mb-8 md:w-3/4 mx-auto">
            Organize a rotina do seu bebê em um só lugar de forma profissional.
          </p>
          <Button className="w-full md:w-auto h-12 px-8 text-base font-bold bg-[#7C3AED] hover:bg-[#8B5CF6] text-white" onClick={() => navigate('/register')}>
            Começar agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] py-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Nuna" className="w-6 h-6 grayscale opacity-80 rounded" />
              <span className="font-bold text-white text-lg">NUNA</span>
            </div>
            <p className="text-[#A7A8C2]">Cuidados do Bebê</p>
            <p className="text-[#A7A8C2] italic">"Cuidar também é acompanhar."</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Produto</h4>
            <div className="flex flex-col gap-2 text-[#A7A8C2]">
              <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
              <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
              <a href="#seguranca" className="hover:text-white transition-colors">Segurança</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Legal</h4>
            <div className="flex flex-col gap-2 text-[#A7A8C2]">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
        
        <Separator className="bg-white/5 mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#A7A8C2]">
          <span>© {new Date().getFullYear()} Nuna Tech. Todos os direitos reservados.</span>
          <span>Feito com 💜 para famílias.</span>
        </div>
      </footer>
    </div>
  );
}
