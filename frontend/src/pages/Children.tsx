import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { toast } from 'sonner';
import { formatDate, getChildAge } from '../utils/helpers';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Baby, Edit2, Trash2, Share2, Plus, ChevronLeft } from 'lucide-react';

export default function ChildrenPage() {
  const { children, selectChild, refreshChildren } = useChild();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [birthHeight, setBirthHeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [parentNames, setParentNames] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setName(''); setBirthDate(''); setGender(''); setBirthWeight('');
    setBirthHeight(''); setBloodType(''); setParentNames(''); setNotes('');
    setEditId(null);
  };

  const handleEdit = (child: any) => {
    setEditId(child.id);
    setName(child.name);
    setBirthDate(child.birthDate?.split('T')[0] || '');
    setGender(child.gender);
    setBirthWeight(child.birthWeight?.toString() || '');
    setBirthHeight(child.birthHeight?.toString() || '');
    setBloodType(child.bloodType || '');
    setParentNames(child.parentNames || '');
    setNotes(child.notes || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name,
        birthDate: birthDate.includes('T') ? birthDate : `${birthDate}T12:00:00Z`,
        gender,
        birthWeight: birthWeight ? parseFloat(birthWeight) : undefined,
        birthHeight: birthHeight ? parseFloat(birthHeight) : undefined,
        bloodType: bloodType || undefined,
        parentNames: parentNames || undefined,
        notes: notes || undefined,
      };

      if (editId) {
        await api.put(`/children/${editId}`, data);
        toast.success('Perfil atualizado com sucesso!');
      } else {
        await api.post('/children', data);
        toast.success('Bebê cadastrado com sucesso! 🎉');
      }

      await refreshChildren();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      toast.error('Erro ao salvar os dados.');
    } finally {
      setSaving(false);
    }
  };

  const [shareChildId, setShareChildId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [deleteChildId, setDeleteChildId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deleteChildId) return;
    try {
      await api.delete(`/children/${deleteChildId}`);
      toast.success('Perfil removido');
      await refreshChildren();
      setDeleteChildId(null);
    } catch (err: any) {
      toast.error('Erro ao remover o perfil');
    }
  };

  const confirmShare = async () => {
    if (!shareChildId || !shareEmail) return;
    try {
      await api.post(`/children/${shareChildId}/share`, { email: shareEmail });
      toast.success('Convite enviado com sucesso! 🤝');
      await refreshChildren();
      setShareChildId(null);
      setShareEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao compartilhar o acesso');
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 animate-in slide-in-from-right-4 duration-300 pb-24">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); resetForm(); }} className="rounded-full mr-2 bg-muted/50">
            <ChevronLeft size={22} />
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight">{editId ? 'Editar Perfil' : 'Novo Bebê'}</h1>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5 rounded-[24px]">
          <CardContent className="p-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Nome do Bebê</Label>
              <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required className="h-14 rounded-xl text-lg bg-muted/50 border-transparent focus:bg-background" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Nascimento</Label>
                <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Sexo</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background text-base">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feminino">Feminina</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Peso (kg)</Label>
                <Input type="number" step="0.001" placeholder="3.250" value={birthWeight} onChange={e => setBirthWeight(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-muted-foreground">Altura (cm)</Label>
                <Input type="number" step="0.1" placeholder="49" value={birthHeight} onChange={e => setBirthHeight(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Tipo Sanguíneo</Label>
              <Input placeholder="Ex: O+" value={bloodType} onChange={e => setBloodType(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Responsáveis</Label>
              <Input placeholder="Nomes dos pais" value={parentNames} onChange={e => setParentNames(e.target.value)} className="h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-muted-foreground">Observações de Saúde</Label>
              <Textarea placeholder="Alergias, condições, etc..." value={notes} onChange={e => setNotes(e.target.value)} className="rounded-xl min-h-[100px] bg-muted/50 border-transparent focus:bg-background text-base" />
            </div>

            <Button size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20 mt-4" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/more')} className="rounded-full mr-2 -ml-2">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-2xl font-extrabold tracking-tight">Meus Bebês</h1>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Baby size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhuma criança</h2>
          <p className="text-muted-foreground mb-8">Adicione seu bebê para começar a acompanhar a rotina.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <Card key={child.id} className="border-0 shadow-md shadow-black/5 bg-card rounded-3xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer" onClick={() => { selectChild(child); navigate('/dashboard'); }}>
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#D946EF] text-white flex items-center justify-center text-3xl font-black shadow-inner">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold leading-tight">{child.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{getChildAge(child.birthDate)} • {formatDate(child.birthDate)}</p>
                    
                    {child.sharedAccess && child.sharedAccess.length > 0 && (
                      <p className="text-[11px] font-bold text-primary mt-1.5 flex items-center gap-1 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                        <Share2 size={10} /> Compartilhado: {child.sharedAccess.length} pessoa(s)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border/40" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10 rounded-full h-9 px-4" onClick={() => setShareChildId(child.id)}>
                    <Share2 size={16} className="mr-1.5" /> Convidar
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-9 w-9" onClick={() => handleEdit(child)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9" onClick={() => setDeleteChildId(child.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button size="lg" className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20 mt-8" onClick={() => { resetForm(); setShowForm(true); }}>
        <Plus className="mr-2" size={20} /> Cadastrar Novo Bebê
      </Button>

      {/* Share Dialog */}
      <Dialog open={!!shareChildId} onOpenChange={(open) => { if(!open) { setShareChildId(null); setShareEmail(''); } }}>
        <DialogContent className="rounded-[24px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Convidar parceiro(a)</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Compartilhe o perfil do bebê com outra pessoa (precisa ter conta no Nuna).
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label className="font-bold text-muted-foreground mb-2 block">E-mail do usuário</Label>
            <Input 
              type="email" 
              placeholder="contato@exemplo.com" 
              value={shareEmail} 
              onChange={e => setShareEmail(e.target.value)} 
              className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background"
            />
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-end mt-2">
            <Button variant="ghost" className="flex-1 rounded-full font-bold h-12" onClick={() => { setShareChildId(null); setShareEmail(''); }}>
              Cancelar
            </Button>
            <Button className="flex-1 rounded-full font-bold h-12 shadow-sm" onClick={confirmShare} disabled={!shareEmail}>
              Convidar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteChildId} onOpenChange={(open) => !open && setDeleteChildId(null)}>
        <DialogContent className="rounded-[24px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Remover Bebê</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Tem certeza que deseja excluir esta criança e todos os registros associados? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end mt-2">
            <Button variant="ghost" className="flex-1 rounded-full font-bold h-12" onClick={() => setDeleteChildId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1 rounded-full font-bold h-12" onClick={confirmDelete}>
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
