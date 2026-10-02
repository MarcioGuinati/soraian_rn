import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { ArrowLeft, User, Mail, Phone, Calendar, RefreshCw, Trash2, Baby, Activity, Moon, FileText, Syringe, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChildCount {
  feedingRecords: number;
  diaperRecords: number;
  sleepRecords: number;
  bathRecords: number;
  temperatureRecords: number;
  weightRecords: number;
  medicationRecords: number;
  appointments: number;
  vaccines: number;
  reminders: number;
  notes_: number;
  foodRecords: number;
}

interface ChildDetail {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  photo: string | null;
  createdAt: string;
  _count: ChildCount;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  children: ChildDetail[];
}

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      toast.error('Erro ao carregar usuário');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Usuário excluído com sucesso');
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir usuário');
    }
    setShowDeleteModal(false);
  };

  const calcAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffMs = today.getTime() - birth.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} dias`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}a ${remMonths}m` : `${years} ${years === 1 ? 'ano' : 'anos'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalRecords = user.children.reduce((sum, child) => {
    const c = child._count;
    return sum + c.feedingRecords + c.diaperRecords + c.sleepRecords + c.bathRecords +
      c.temperatureRecords + c.weightRecords + c.medicationRecords + c.appointments +
      c.vaccines + c.reminders + c.notes_ + c.foodRecords;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Button 
        variant="ghost" 
        className="text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
        onClick={() => navigate('/admin/users')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Usuários
      </Button>

      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl border-2 border-primary/20 shadow-lg shadow-primary/5 shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-muted-foreground">
              <div className="flex items-center gap-2"><Mail size={16} /> {user.email}</div>
              {user.phone && <div className="flex items-center gap-2"><Phone size={16} /> {user.phone}</div>}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge variant="outline" className={`px-3 py-1 bg-card ${user.role === 'admin' ? 'text-amber-500 border-amber-500/50' : 'text-emerald-500 border-emerald-500/50'}`}>
              {user.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80">
              <Baby size={14} className="mr-1.5" /> {user.children.length} {user.children.length === 1 ? 'filho' : 'filhos'}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-muted text-muted-foreground hover:bg-muted/80">
              <Activity size={14} className="mr-1.5" /> {totalRecords} registros
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
          <Button variant="destructive" className="w-full md:w-auto font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
          </Button>
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><Calendar size={18} /></div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Data de Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {format(new Date(user.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center"><RefreshCw size={18} /></div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Última Atualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {format(new Date(user.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Section */}
      <h2 className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
        <Baby size={24} className="text-primary" /> Filhos Cadastrados
      </h2>

      {user.children.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Baby size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Nenhuma criança cadastrada</h3>
          <p className="text-muted-foreground mt-2">Este usuário ainda não adicionou filhos ao perfil.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {user.children.map((child) => {
            const c = child._count;
            return (
              <div key={child.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 md:p-6 flex items-center gap-4 border-b border-border bg-muted/30">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${child.gender === 'masculino' ? 'bg-blue-500/10 text-blue-500' : 'bg-pink-500/10 text-pink-500'}`}>
                    {child.gender === 'masculino' ? '👦' : '👧'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Nasc: {format(new Date(child.birthDate), "dd/MM/yyyy", { locale: ptBR })} • <span className="font-medium text-foreground">{calcAge(child.birthDate)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.feedingRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Mamadas</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.diaperRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Fraldas</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.sleepRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Sonos</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.bathRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Banhos</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.vaccines}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Vacinas</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.appointments}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Consultas</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.medicationRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Remédios</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.foodRecords}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Refeições</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 flex flex-col items-center justify-center border border-border text-center">
                      <span className="text-lg font-bold text-foreground">{c.notes_}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Notas</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Trash2 className="text-destructive" /> Excluir Usuário
              </h3>
              <p className="text-muted-foreground mb-6">
                Tem certeza que deseja excluir a conta de <strong className="text-foreground">{user.name}</strong>? 
                Todos os dados (crianças, registros, fotos) serão <strong className="text-destructive">permanentemente removidos</strong>. 
                Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" className="text-foreground hover:bg-muted" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Sim, Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

