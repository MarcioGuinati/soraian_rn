import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Syringe, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const VACCINE_DATA = [
  {
    age: 'Ao nascer',
    vaccines: [
      { name: 'BCG', desc: 'Previção contra tuberculose.' },
      { name: 'Hepatite B', desc: '1ª dose. Previne infecção no fígado.' }
    ]
  },
  {
    age: '2 meses',
    vaccines: [
      { name: 'Pentavalente', desc: '1ª dose. Difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae b.' },
      { name: 'Poliomielite (VIP)', desc: '1ª dose. Vacina inativada poliomielite.' },
      { name: 'Pneumocócica 10 Valente', desc: '1ª dose. Previne pneumonia, otite, meningite.' },
      { name: 'Rotavírus Humano', desc: '1ª dose. Previne diarreia grave.' }
    ]
  },
  {
    age: '3 meses',
    vaccines: [
      { name: 'Meningocócica C', desc: '1ª dose. Previne doença meningocócica.' }
    ]
  },
  {
    age: '4 meses',
    vaccines: [
      { name: 'Pentavalente', desc: '2ª dose.' },
      { name: 'Poliomielite (VIP)', desc: '2ª dose.' },
      { name: 'Pneumocócica 10 Valente', desc: '2ª dose.' },
      { name: 'Rotavírus Humano', desc: '2ª dose.' }
    ]
  },
  {
    age: '5 meses',
    vaccines: [
      { name: 'Meningocócica C', desc: '2ª dose.' }
    ]
  },
  {
    age: '6 meses',
    vaccines: [
      { name: 'Pentavalente', desc: '3ª dose.' },
      { name: 'Poliomielite (VIP)', desc: '3ª dose.' }
    ]
  },
  {
    age: '9 meses',
    vaccines: [
      { name: 'Febre Amarela', desc: 'Dose única (depende da região do Brasil).' }
    ]
  },
  {
    age: '12 meses',
    vaccines: [
      { name: 'Tríplice Viral', desc: '1ª dose. Sarampo, caxumba e rubéola.' },
      { name: 'Pneumocócica 10 Valente', desc: 'Reforço.' },
      { name: 'Meningocócica C', desc: 'Reforço.' }
    ]
  },
  {
    age: '15 meses',
    vaccines: [
      { name: 'DTP', desc: '1º reforço. Difteria, tétano e coqueluche.' },
      { name: 'Poliomielite (VOP)', desc: '1º reforço. Vacina oral poliomielite.' },
      { name: 'Hepatite A', desc: 'Dose única.' },
      { name: 'Tetraviral', desc: 'Dose única. Sarampo, caxumba, rubéola e varicela.' }
    ]
  }
];

export default function VaccineCalendarPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight">Vacinas (SUS)</h1>
      </div>

      <Card className="border-0 shadow-md bg-[#BDEBF3]/30 rounded-2xl mb-8">
        <CardContent className="p-4 flex gap-3">
          <AlertCircle size={24} className="text-[#0284C7] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#0284C7] leading-relaxed">
            Calendário Nacional de Vacinação do SUS (Ministério da Saúde). Clínicas particulares podem oferecer vacinas adicionais.
          </p>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-3" defaultValue={['Ao nascer', '2 meses']}>
        {VACCINE_DATA.map((period, index) => (
          <AccordionItem key={index} value={period.age} className="border-0 shadow-sm rounded-2xl overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Syringe size={20} />
                </div>
                <span className="font-bold text-lg">{period.age}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0">
              <div className="space-y-4 pt-3 border-t border-border/50">
                {period.vaccines.map((vac, vIndex) => (
                  <div key={vIndex} className="pl-2 border-l-2 border-primary">
                    <h4 className="font-bold text-foreground text-sm">{vac.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">{vac.desc}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

    </div>
  );
}
