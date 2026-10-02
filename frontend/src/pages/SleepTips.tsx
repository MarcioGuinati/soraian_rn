import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Moon, Thermometer, CloudMoon, Shirt, Music } from 'lucide-react';

export default function SleepTipsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight">Dicas de Sono</h1>
      </div>

      <div className="space-y-6">
        
        {/* Tabelas de Referência */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Moon size={20} className="text-[#6D28D9]" />
            <h2 className="text-lg font-bold text-foreground">Tabelas de Referência</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-4 leading-relaxed">
            Média de sono recomendada por idade. Cada bebê é único, use apenas como um guia.
          </p>
          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 border-b border-border">Idade</th>
                    <th className="px-4 py-3 border-b border-border">Diurno</th>
                    <th className="px-4 py-3 border-b border-border">Noturno</th>
                    <th className="px-4 py-3 border-b border-border">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground font-bold">Recém-nascido</td>
                    <td className="px-4 py-3">8-9 h</td>
                    <td className="px-4 py-3">8-9 h</td>
                    <td className="px-4 py-3 text-primary">16-18h</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground font-bold">1-3 meses</td>
                    <td className="px-4 py-3">4-5 h</td>
                    <td className="px-4 py-3">9-10 h</td>
                    <td className="px-4 py-3 text-primary">14-15h</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground font-bold">4-6 meses</td>
                    <td className="px-4 py-3">3-4 h</td>
                    <td className="px-4 py-3">10-11 h</td>
                    <td className="px-4 py-3 text-primary">14-15h</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground font-bold">7-9 meses</td>
                    <td className="px-4 py-3">2-3 h</td>
                    <td className="px-4 py-3">11-12 h</td>
                    <td className="px-4 py-3 text-primary">14h</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground font-bold">10-12 meses</td>
                    <td className="px-4 py-3">2-3 h</td>
                    <td className="px-4 py-3">11-12 h</td>
                    <td className="px-4 py-3 text-primary">13-14h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Regressões */}
        <section>
          <div className="flex items-center gap-2 mb-3 mt-8">
            <CloudMoon size={20} className="text-[#D97706]" />
            <h2 className="text-lg font-bold text-foreground">Regressões de Sono</h2>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-4 leading-relaxed">
            Fases comuns onde o padrão de sono pode ser interrompido por saltos de desenvolvimento.
          </p>
          
          <div className="grid gap-3">
            {[
              { age: 'Aos 4 Meses', desc: 'O bebê passa a ter ciclos de sono mais parecidos com os dos adultos, acordando levemente entre eles.', tip: 'Ajude-o a aprender a adormecer sozinho, evite criar novas associações de sono.' },
              { age: 'Aos 8-10 Meses', desc: 'Pico da ansiedade de separação e marcos motores (engatinhar, ficar em pé).', tip: 'Dê muito conforto, mas mantenha a rotina. Pratique as novas habilidades durante o dia.' },
              { age: 'Aos 12 Meses', desc: 'Transição de sonecas e ansiedade. Pode parecer que ele quer largar uma soneca, mas resista por mais um tempo.', tip: 'Mantenha os horários. Se ele pular a soneca da manhã, antecipe um pouco a hora de dormir.' }
            ].map((reg, i) => (
              <Card key={i} className="border-border/50 shadow-sm rounded-2xl bg-[#FFE3A3]/20 border-l-4 border-l-[#D97706]">
                <CardContent className="p-4">
                  <h3 className="font-bold text-[#D97706] mb-1">{reg.age}</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-2">{reg.desc}</p>
                  <p className="text-xs bg-white/50 p-2 rounded-lg text-foreground font-bold">💡 Dica: <span className="font-medium text-muted-foreground">{reg.tip}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ambiente */}
        <section>
          <div className="flex items-center gap-2 mb-3 mt-8">
            <Thermometer size={20} className="text-[#0D9488]" />
            <h2 className="text-lg font-bold text-foreground">Ambiente Ideal</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-[#BEEFE5]/50 text-[#0D9488] rounded-xl flex items-center justify-center shrink-0">
                  <Thermometer size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Temperatura</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">O ideal é manter o quarto entre 20°C e 22°C. O bebê dorme melhor em um ambiente ligeiramente fresco.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-muted/80 text-foreground rounded-xl flex items-center justify-center shrink-0">
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Escuridão</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">Use cortinas blackout. Para os cochilos do dia, o quarto também deve ser escuro para estimular a melatonina.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-[#F9C2D9]/40 text-[#D946EF] rounded-xl flex items-center justify-center shrink-0">
                  <Shirt size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Roupas Adequadas</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">Vista o bebê com uma camada a mais. Evite cobertores soltos; prefira sacos de dormir (sleeping bags).</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-[#DCCBFF]/40 text-[#8B5CF6] rounded-xl flex items-center justify-center shrink-0">
                  <Music size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Ruído Branco</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">Ajuda a abafar sons da casa e reproduz o som do útero, acalmando o bebê de forma natural.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
      </div>
    </div>
  );
}
