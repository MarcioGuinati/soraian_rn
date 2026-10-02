import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, LineChart, Baby, ShieldCheck, ChevronRight, Moon, CalendarDays, 
  Syringe, Clock, Star, Play, Lock, Smartphone, Menu, Pill, CheckCircle2,
  X
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1024] text-white font-sans overflow-x-hidden selection:bg-[#7C3AED]/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0F1024]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] flex items-center justify-between">
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
            <Button className="font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white h-9 px-5 transition-colors" onClick={() => navigate('/register')}>
              Criar Conta
            </Button>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#151630] border-b border-white/5 p-4 flex flex-col gap-4 md:hidden shadow-xl">
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
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative min-h-[520px] md:min-h-[580px] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            <div className="flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge variant="outline" className="mb-6 py-1 px-3 rounded-full text-xs font-semibold border-[#7C3AED]/30 text-[#8B5CF6] bg-[#7C3AED]/10">
                ✨ Feito por pais, para pais
              </Badge>
              
              <h1 className="text-[40px] md:text-[48px] lg:text-[56px] font-bold tracking-tight leading-[1.15] mb-5">
                A rotina do seu bebê na <span className="text-[#8B5CF6]">palma da mão.</span>
              </h1>
              
              <p className="text-base md:text-[17px] text-[#A7A8C2] mb-8 max-w-[480px] leading-relaxed font-medium">
                Diga adeus às anotações de papel. O NUNA ajuda você a registrar mamadas, sono, fraldas e o crescimento do bebê de forma simples, rápida e segura.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button className="h-12 px-6 rounded-full text-base font-bold bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all shadow-lg shadow-[#7C3AED]/20" onClick={() => navigate('/register')}>
                  Acessar Web App <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-full text-base font-semibold border-white/10 text-white hover:bg-white/5 hover:text-white transition-all flex items-center bg-transparent" onClick={() => window.open('https://play.google.com/store', '_blank')}>
                  <Play className="w-4 h-4 mr-2 fill-current text-[#A7A8C2]" />
                  Disponível no Google Play
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F1024] bg-[#151630] overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-[#F59E0B] gap-0.5">
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                  </div>
                  <span className="text-[12px] font-medium text-[#A7A8C2] mt-0.5">Mais de 2.000 famílias acompanhando a rotina</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150 flex justify-center md:justify-end">
              <div className="absolute inset-0 bg-[#7C3AED]/10 blur-[80px] rounded-full pointer-events-none" />
              <img src="/ilustracao-bebe-ursinho-soraia.png" alt="Bebê com ursinho" className="relative z-10 w-full max-w-[380px] md:max-w-[420px] object-contain drop-shadow-2xl" />
            </div>
            
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="recursos" className="py-16 md:py-24 bg-[#151630]/50 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-4">Tudo o que você precisa em um só lugar</h2>
            <p className="text-[17px] text-[#A7A8C2] font-medium">Você foca no que realmente importa: cuidar. O NUNA ajuda a organizar os detalhes da rotina do bebê.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <Baby size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Mamadas</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Horário e duração</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Quantidade (fórmula)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Lado (amamentação)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <Moon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Sono</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Início e fim</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Tempo total de sono</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Padrões da madrugada</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <Baby size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Fraldas</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Registro de xixi e cocô</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Controle de consistência</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Horários das trocas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <LineChart size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Crescimento</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Curvas da OMS</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Evolução de peso</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Altura e perímetro cefálico</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <Syringe size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Saúde</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Medicamentos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Caderneta de vacinas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Agendamento de consultas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#151630] border-white/5 shadow-none rounded-[24px]">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center mb-5">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Relatórios</h3>
                <ul className="space-y-2 text-sm text-[#A7A8C2]">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Histórico completo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Evolução diária</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#7C3AED]" /> Entendimento de padrões</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-4">Simples para registrar. Útil para acompanhar.</h2>
          </div>

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
        </div>
      </section>

      {/* Demonstração Interativa */}
      <section id="demo" className="py-16 md:py-24 bg-[#151630]/50 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-6">Veja o NUNA em ação</h2>
              <p className="text-[17px] text-[#A7A8C2] mb-10 leading-relaxed font-medium">
                Uma interface desenhada para ser rápida, afinal, você provavelmente está com o bebê no colo.
              </p>

              <Tabs defaultValue="mamadas" className="w-full">
                <TabsList className="bg-[#0F1024] border border-white/5 p-1 h-auto flex flex-wrap mb-6">
                  <TabsTrigger value="mamadas" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Mamadas</TabsTrigger>
                  <TabsTrigger value="sono" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Sono</TabsTrigger>
                  <TabsTrigger value="fraldas" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Fraldas</TabsTrigger>
                  <TabsTrigger value="crescimento" className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#A7A8C2] py-2">Crescimento</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mamadas" className="mt-0">
                  <Card className="bg-[#151630] border-white/5 text-white">
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
                  <Card className="bg-[#151630] border-white/5 text-white">
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
                  <Card className="bg-[#151630] border-white/5 text-white">
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

                <TabsContent value="crescimento" className="mt-0">
                  <Card className="bg-[#151630] border-white/5 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><LineChart size={20}/></div>
                        <div>
                          <h4 className="font-bold">Novo peso registrado</h4>
                          <p className="text-sm text-[#A7A8C2]">Consulta de 2 meses</p>
                        </div>
                      </div>
                      <Separator className="bg-white/5 my-4" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#A7A8C2]">Peso: 5.2 kg</span>
                        <span className="text-emerald-400 font-medium">Hoje</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Mockup */}
            <div className="relative mx-auto w-full max-w-[320px]">
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-[60px] rounded-full" />
              <div className="relative bg-[#0F1024] border-[6px] border-[#151630] rounded-[40px] h-[640px] w-full overflow-hidden shadow-2xl flex flex-col">
                {/* Status bar fake */}
                <div className="h-6 w-full flex justify-between items-center px-6 pt-2">
                  <span className="text-[10px] font-medium">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-1">Bom dia, família 💜</h3>
                  <p className="text-sm text-[#A7A8C2] mb-6">Resumo de hoje</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-[#151630] rounded-xl p-3 text-center border border-white/5">
                      <div className="text-xl font-bold text-[#7C3AED] mb-1">6</div>
                      <div className="text-[10px] text-[#A7A8C2] uppercase font-bold tracking-wider">Mamadas</div>
                    </div>
                    <div className="bg-[#151630] rounded-xl p-3 text-center border border-white/5">
                      <div className="text-xl font-bold text-blue-400 mb-1">8h</div>
                      <div className="text-[10px] text-[#A7A8C2] uppercase font-bold tracking-wider">Sono</div>
                    </div>
                    <div className="bg-[#151630] rounded-xl p-3 text-center border border-white/5">
                      <div className="text-xl font-bold text-orange-400 mb-1">5</div>
                      <div className="text-[10px] text-[#A7A8C2] uppercase font-bold tracking-wider">Fraldas</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold mb-3">Atividades recentes</h4>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 bg-[#151630] p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#8B5CF6]"><Baby size={14}/></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">Mamadeira</div>
                        <div className="text-xs text-[#A7A8C2]">120ml • Leite materno</div>
                      </div>
                      <div className="text-xs text-[#A7A8C2]">08:32</div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#151630] p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Moon size={14}/></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">Sono</div>
                        <div className="text-xs text-[#A7A8C2]">Soneca da manhã</div>
                      </div>
                      <div className="text-xs text-[#A7A8C2]">07:15</div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#151630] p-3 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400"><Baby size={14}/></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">Fralda</div>
                        <div className="text-xs text-[#A7A8C2]">Xixi e Cocô</div>
                      </div>
                      <div className="text-xs text-[#A7A8C2]">06:40</div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex justify-center">
                    <div className="w-12 h-12 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
                      <ChevronRight size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Rotina Real */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-4">Feito para a rotina real.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-white/5 rounded-2xl bg-[#151630]/50">
              <h4 className="text-[#8B5CF6] text-xs font-bold tracking-wider uppercase mb-2">No meio da madrugada</h4>
              <p className="text-sm text-white font-medium">Registre uma mamada rapidamente, sem a luz do celular atrapalhar o sono.</p>
            </div>
            <div className="p-6 border border-white/5 rounded-2xl bg-[#151630]/50">
              <h4 className="text-[#8B5CF6] text-xs font-bold tracking-wider uppercase mb-2">Na consulta</h4>
              <p className="text-sm text-white font-medium">Tenha o histórico organizado para consultar e mostrar os gráficos ao pediatra.</p>
            </div>
            <div className="p-6 border border-white/5 rounded-2xl bg-[#151630]/50">
              <h4 className="text-[#8B5CF6] text-xs font-bold tracking-wider uppercase mb-2">Durante o dia</h4>
              <p className="text-sm text-white font-medium">Veja rapidamente como está a rotina do bebê e o que esperar nas próximas horas.</p>
            </div>
            <div className="p-6 border border-white/5 rounded-2xl bg-[#151630]/50">
              <h4 className="text-[#8B5CF6] text-xs font-bold tracking-wider uppercase mb-2">Com a família</h4>
              <p className="text-sm text-white font-medium">Facilite o acompanhamento conectando pais, avós ou babás na mesma conta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section id="seguranca" className="py-16 bg-[#151630]/30 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] text-center">
          <Lock size={32} className="mx-auto text-[#7C3AED] mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Os momentos do seu bebê merecem cuidado.</h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-[#A7A8C2] font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#8B5CF6]" /> Dados organizados</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#8B5CF6]" /> Conta protegida</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#8B5CF6]" /> Histórico sempre disponível</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#8B5CF6]" /> Privacidade como prioridade</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[800px]">
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight">Dúvidas Frequentes</h2>
          </div>

          <Accordion type="single" collapsible className="w-full text-[#A7A8C2]">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-[#8B5CF6] text-left">O que é o NUNA?</AccordionTrigger>
              <AccordionContent className="text-[#A7A8C2] leading-relaxed">
                O NUNA é um aplicativo feito para ajudar pais e responsáveis a organizar, registrar e acompanhar a rotina completa do bebê em um só lugar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-[#8B5CF6] text-left">O que posso registrar?</AccordionTrigger>
              <AccordionContent className="text-[#A7A8C2] leading-relaxed">
                Você pode registrar mamadas (peito e fórmula), sonecas e sono noturno, trocas de fralda, crescimento (peso e altura), saúde (vacinas e remédios) e muito mais.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-[#8B5CF6] text-left">Posso compartilhar com outro responsável?</AccordionTrigger>
              <AccordionContent className="text-[#A7A8C2] leading-relaxed">
                Sim! Você pode fazer login em múltiplos dispositivos para que toda a rede de apoio (pais, avós, babás) acompanhe a mesma linha do tempo em tempo real.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-[#8B5CF6] text-left">O NUNA substitui orientação médica?</AccordionTrigger>
              <AccordionContent className="text-[#A7A8C2] leading-relaxed">
                Não. O NUNA é uma ferramenta de acompanhamento e organização do dia a dia, e nunca substitui a orientação, diagnóstico ou tratamento de pediatras e profissionais de saúde.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-[#151630]/50 border-t border-white/5">
        <div className="absolute inset-0 bg-[#7C3AED]/5 blur-[100px] -z-10" />
        <div className="container mx-auto max-w-[800px] text-center">
          <Heart size={40} className="mx-auto mb-6 text-[#7C3AED] animate-pulse" fill="currentColor" />
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight mb-4 leading-tight">
            Menos preocupação em lembrar.<br className="hidden md:block" /> Mais tempo para cuidar.
          </h2>
          <p className="text-[17px] text-[#A7A8C2] mb-10 font-medium">
            Organize a rotina do seu bebê em um só lugar de forma profissional.
          </p>
          <Button className="h-14 px-8 rounded-full text-base font-bold bg-[#7C3AED] hover:bg-[#8B5CF6] text-white shadow-lg shadow-[#7C3AED]/25 transition-all" onClick={() => navigate('/register')}>
            Começar agora <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0F1024] py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Nuna" className="w-6 h-6 grayscale opacity-80 rounded" />
                <span className="font-bold text-white">NUNA</span>
              </div>
              <p className="text-sm text-[#A7A8C2] font-medium">Cuidados do Bebê</p>
              <p className="text-sm text-[#A7A8C2] italic mt-1">"Cuidar também é acompanhar."</p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">PRODUTO</h4>
              <div className="flex flex-col gap-3 text-sm text-[#A7A8C2]">
                <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
                <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
                <a href="#seguranca" className="hover:text-white transition-colors">Segurança</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm">LEGAL</h4>
              <div className="flex flex-col gap-3 text-sm text-[#A7A8C2]">
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
        </div>
      </footer>
    </div>
  );
}
