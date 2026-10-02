import { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { nowISO, utcToLocalString, localToUTC } from '../utils/helpers';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Baby, Moon, Droplets, Ruler, Bath, Pill, Apple, PenLine, ChevronLeft, Calendar } from 'lucide-react';

const RECORD_TYPES = [
  { key: 'feeding', icon: <Baby size={32} />, label: 'Mamada', bg: 'bg-[#F9C2D9]/20 text-[#D946EF]' },
  { key: 'sleep', icon: <Moon size={32} />, label: 'Sono', bg: 'bg-[#DCCBFF]/30 text-[#8B5CF6]' },
  { key: 'diaper-pee', icon: <Droplets size={32} />, label: 'Xixi', bg: 'bg-[#BEEFE5]/50 text-[#0D9488]' },
  { key: 'diaper-poop', icon: <Droplets size={32} />, label: 'Cocô', bg: 'bg-[#FFE4E6] text-[#E11D48]' },
  { key: 'food', icon: <Apple size={32} />, label: 'Alimentação', bg: 'bg-[#D1FAE5] text-[#059669]' },
  { key: 'bath', icon: <Bath size={32} />, label: 'Banho', bg: 'bg-[#BDEBF3]/50 text-[#0284C7]' },
  { key: 'weight', icon: <Ruler size={32} />, label: 'Medidas', bg: 'bg-[#FFE3A3]/50 text-[#D97706]' },
  { key: 'medication', icon: <Pill size={32} />, label: 'Medicamento', bg: 'bg-[#FFD0D0]/50 text-[#DC2626]' },
  { key: 'note', icon: <PenLine size={32} />, label: 'Anotação', bg: 'bg-muted text-muted-foreground' },
];

export default function QuickRegisterPage() {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string | null>(searchParams.get('type'));
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const editEvent = location.state?.event;
  const isEdit = !!editEvent;

  // Shared
  const [recordedAt, setRecordedAt] = useState(editEvent?.eventDate ? utcToLocalString(editEvent.eventDate) : nowISO());
  const [notes, setNotes] = useState(editEvent?.notes || '');

  // Feeding
  const [feedingType, setFeedingType] = useState(editEvent?.type || 'peito');
  const [amountMl, setAmountMl] = useState(editEvent?.amountMl?.toString() || '');
  const [breastSide, setBreastSide] = useState(editEvent?.breastSide || '');
  const [durationMinutes, setDurationMinutes] = useState(editEvent?.durationMinutes?.toString() || '');

  // Food
  const [mealType, setMealType] = useState(editEvent?.mealType || 'almoco');
  const [food, setFood] = useState(editEvent?.food || '');
  const [foodAmount, setFoodAmount] = useState(editEvent?.amount?.toString() || '');
  const [foodUnit, setFoodUnit] = useState(editEvent?.unit || '');

  // Diaper
  const [consistency, setConsistency] = useState(editEvent?.consistency || '');
  const [color, setColor] = useState(editEvent?.color || '');

  // Sleep
  const [sleepStartedAt, setSleepStartedAt] = useState(editEvent?.startedAt ? utcToLocalString(editEvent.startedAt) : nowISO());
  const [sleepEndedAt, setSleepEndedAt] = useState(editEvent?.endedAt ? utcToLocalString(editEvent.endedAt) : '');
  const [sleepLocation, setSleepLocation] = useState(editEvent?.location || '');

  // Bath
  const [waterTemp, setWaterTemp] = useState(editEvent?.waterTemperature?.toString() || '');
  const [bathDuration, setBathDuration] = useState(editEvent?.durationMinutes?.toString() || '');

  // Weight
  const [weight, setWeight] = useState(editEvent?.weight?.toString() || '');
  const [height, setHeight] = useState(editEvent?.height?.toString() || '');

  // Medication
  const [medName, setMedName] = useState(editEvent?.medicationName || '');
  const [dosage, setDosage] = useState(editEvent?.dosage || '');

  // Note
  const [content, setContent] = useState(editEvent?.content || '');

  if (!selectedChild) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center">
        <Baby size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Nenhuma criança selecionada</h2>
        <p className="text-muted-foreground">Cadastre uma criança primeiro.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const childId = selectedChild.id;
      let endpoint = '';
      let body: any = {};

      switch (selectedType) {
        case 'feeding':
          endpoint = `/children/${childId}/feedings`;
          body = { type: feedingType, amountMl: amountMl ? parseFloat(amountMl) : undefined, breastSide: breastSide || undefined, durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined, recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'food':
          endpoint = `/children/${childId}/foods`;
          body = { mealType, food, amount: foodAmount ? parseFloat(foodAmount) : undefined, unit: foodUnit || undefined, recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'diaper-pee':
          endpoint = `/children/${childId}/diapers`;
          body = { type: 'xixi', recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'diaper-poop':
          endpoint = `/children/${childId}/diapers`;
          body = { type: 'coco', consistency: consistency || undefined, color: color || undefined, recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'sleep':
          endpoint = `/children/${childId}/sleep`;
          body = { startedAt: localToUTC(sleepStartedAt), endedAt: sleepEndedAt ? localToUTC(sleepEndedAt) : undefined, location: sleepLocation || undefined, notes: notes || undefined };
          break;
        case 'bath':
          endpoint = `/children/${childId}/baths`;
          body = { startedAt: localToUTC(recordedAt), durationMinutes: bathDuration ? parseInt(bathDuration) : undefined, waterTemperature: waterTemp ? parseFloat(waterTemp) : undefined, notes: notes || undefined };
          break;
        case 'weight':
          endpoint = `/children/${childId}/weights`;
          body = { weight: parseFloat(weight), height: height ? parseFloat(height) : undefined, recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'medication':
          endpoint = `/children/${childId}/medications`;
          body = { medicationName: medName, dosage, recordedAt: localToUTC(recordedAt), notes: notes || undefined };
          break;
        case 'note':
          endpoint = `/children/${childId}/notes`;
          body = { content, recordedAt: localToUTC(recordedAt) };
          break;
      }

      if (isEdit) {
        endpoint = endpoint.replace(`/children/${childId}`, '');
        await api.put(`${endpoint}/${editEvent.id}`, body);
        toast.success('Atualizado com sucesso!');
      } else {
        await api.post(endpoint, body);
        toast.success('Salvo com sucesso!');
      }
      navigate(-1);
    } catch (err: any) {
      toast.error('Erro ao salvar registro');
    } finally {
      setSaving(false);
    }
  };

  const OptionSelector = ({ options, value, onChange }: { options: {value: string, label: string}[], value: string, onChange: (v: string) => void }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map(o => (
        <Button 
          key={o.value} 
          type="button" 
          variant={value === o.value ? "default" : "outline"} 
          className={`h-12 rounded-xl font-bold ${value === o.value ? 'shadow-md ring-2 ring-primary/20' : 'text-muted-foreground'}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );

  const renderForm = () => {
    switch (selectedType) {
      case 'feeding':
        return (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block font-bold text-muted-foreground">O que o bebê mamou?</Label>
              <OptionSelector 
                value={feedingType} onChange={setFeedingType}
                options={[{value: 'peito', label: 'Peito'}, {value: 'formula', label: 'Fórmula'}, {value: 'leite_ordenhado', label: 'Ordenhado'}]} 
              />
            </div>
            {feedingType === 'peito' && (
              <div>
                <Label className="mb-2 block font-bold text-muted-foreground">Qual lado?</Label>
                <OptionSelector 
                  value={breastSide} onChange={setBreastSide}
                  options={[{value: 'esquerdo', label: 'Esquerdo'}, {value: 'direito', label: 'Direito'}, {value: 'ambos', label: 'Ambos'}]} 
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Volume (ml)</Label>
                <Input type="number" placeholder="120" value={amountMl} onChange={e => setAmountMl(e.target.value)} className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Tempo (min)</Label>
                <Input type="number" placeholder="15" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
              </div>
            </div>
          </div>
        );

      case 'diaper-poop':
        return (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block font-bold text-muted-foreground">Qual a consistência?</Label>
              <OptionSelector 
                value={consistency} onChange={setConsistency}
                options={[{value: 'liquido', label: 'Líquido'}, {value: 'mole', label: 'Mole'}, {value: 'pastoso', label: 'Pastoso'}, {value: 'firme', label: 'Firme'}]} 
              />
            </div>
            <div>
              <Label className="mb-2 block font-bold text-muted-foreground">Qual a cor?</Label>
              <OptionSelector 
                value={color} onChange={setColor}
                options={[{value: 'amarelo', label: 'Amarelo'}, {value: 'mostarda', label: 'Mostarda'}, {value: 'verde', label: 'Verde'}, {value: 'marrom', label: 'Marrom'}]} 
              />
            </div>
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-5">
            {!isEdit && (
              <div className="grid grid-cols-2 gap-3 pb-4">
                <Button variant="secondary" className="h-14 rounded-2xl font-bold bg-[#DCCBFF] text-[#6D28D9] hover:bg-[#DCCBFF]/80" onClick={async () => {
                  setSaving(true);
                  try {
                    await api.post(`/children/${selectedChild.id}/sleep/start`);
                    toast.success('Soneca iniciada! 💤');
                    navigate('/');
                  } catch(e) { toast.error('Erro'); setSaving(false); }
                }}>
                  Dormiu Agora
                </Button>
                <Button variant="secondary" className="h-14 rounded-2xl font-bold bg-[#FFE3A3] text-[#D97706] hover:bg-[#FFE3A3]/80" onClick={async () => {
                  setSaving(true);
                  try {
                    await api.post(`/children/${selectedChild.id}/sleep/stop`);
                    toast.success('Acordou! ☀️');
                    navigate('/');
                  } catch(e) { toast.error('Sem sono ativo'); setSaving(false); }
                }}>
                  Acordou
                </Button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Dormiu às</Label>
                <Input type="datetime-local" value={sleepStartedAt} onChange={e => setSleepStartedAt(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Acordou às</Label>
                <Input type="datetime-local" value={sleepEndedAt} onChange={e => setSleepEndedAt(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
            </div>
            <div>
              <Label className="mb-2 block font-bold text-muted-foreground">Local</Label>
              <OptionSelector 
                value={sleepLocation} onChange={setSleepLocation}
                options={[{value: 'berco', label: 'Berço'}, {value: 'colo', label: 'Colo'}, {value: 'cama', label: 'Cama'}, {value: 'carrinho', label: 'Carrinho'}]} 
              />
            </div>
          </div>
        );
        
      case 'weight':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Peso (kg)</Label>
              <Input type="number" step="0.01" placeholder="4.5" value={weight} onChange={e => setWeight(e.target.value)} className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Altura (cm)</Label>
              <Input type="number" step="0.1" placeholder="55" value={height} onChange={e => setHeight(e.target.value)} className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
            </div>
          </div>
        );

      case 'medication':
      case 'food':
      case 'bath':
      case 'note':
        // Simplified generic form for remaining
        return (
          <div className="space-y-5">
            {(selectedType === 'medication' || selectedType === 'food') && (
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">{selectedType === 'medication' ? 'Qual remédio?' : 'O que comeu?'}</Label>
                <Input type="text" value={selectedType === 'medication' ? medName : food} onChange={e => selectedType === 'medication' ? setMedName(e.target.value) : setFood(e.target.value)} className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">{selectedType === 'note' ? 'Anotação' : 'Observações (opcional)'}</Label>
              <Textarea placeholder="..." value={selectedType === 'note' ? content : notes} onChange={e => selectedType === 'note' ? setContent(e.target.value) : setNotes(e.target.value)} className="rounded-xl min-h-[100px] text-lg bg-muted/50 border-transparent focus:bg-background" />
            </div>
          </div>
        );

      default: return null;
    }
  };

  if (!selectedType) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4 animate-in fade-in duration-500">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full mr-2">
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground leading-tight tracking-tight">O que aconteceu?</h1>
            <p className="text-muted-foreground text-sm font-medium">Selecione o que deseja registrar</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RECORD_TYPES.map((rt) => (
            <Card key={rt.key} onClick={() => { setSelectedType(rt.key); setRecordedAt(nowISO()); }} className="border-0 shadow-sm active:scale-95 transition-all cursor-pointer rounded-[24px] bg-card hover:shadow-md">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${rt.bg}`}>
                  {rt.icon}
                </div>
                <span className="font-bold text-foreground">{rt.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const typeInfo = RECORD_TYPES.find(t => t.key === selectedType);

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in slide-in-from-right-4 duration-300">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/40 p-4 pb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full mr-3 bg-muted/50">
            <ChevronLeft size={22} />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo?.bg}`}>
              {typeInfo?.icon && <div className="scale-75">{typeInfo.icon}</div>}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground leading-tight">{isEdit ? 'Editar' : 'Registrar'} {typeInfo?.label}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-32">
        <Card className="border-0 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-5 space-y-6">
            {renderForm()}

            {selectedType !== 'sleep' && selectedType !== 'note' && (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label className="font-bold text-muted-foreground flex items-center gap-1.5"><Calendar size={16}/> Data e Hora</Label>
                <Input type="datetime-local" value={recordedAt} onChange={e => setRecordedAt(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
            )}
            
            {selectedType === 'diaper-pee' && (
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label className="font-bold text-muted-foreground">Observações (opcional)</Label>
                <Textarea placeholder="..." value={notes} onChange={e => setNotes(e.target.value)} className="rounded-xl min-h-[100px] text-lg bg-muted/50 border-transparent focus:bg-background" />
              </div>
            )}
          </CardContent>
        </Card>

        <Button size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : (isEdit ? 'Salvar Alterações' : 'Salvar Registro')}
        </Button>
      </div>
    </div>
  );
}
