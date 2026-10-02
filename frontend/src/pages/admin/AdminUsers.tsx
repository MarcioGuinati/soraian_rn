import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';
import { Search, User, Baby, Calendar, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: {
    children: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Usuários</h1>
        <p className="text-muted-foreground">
          {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'} na plataforma.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border rounded-xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {search ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            {search ? 'Tente buscar com outros termos ou limpe o filtro.' : 'Os usuários aparecerão aqui quando se cadastrarem.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-foreground font-bold text-base md:text-lg">{user.name}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center flex-wrap md:flex-nowrap gap-4 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
                <div className="flex flex-col md:items-end flex-1 md:flex-none">
                  <div className="flex items-center gap-1.5 text-foreground font-medium text-sm">
                    <Baby size={16} className="text-primary" />
                    {user._count.children} {user._count.children === 1 ? 'filho' : 'filhos'}
                  </div>
                </div>

                <div className="flex flex-col md:items-end flex-1 md:flex-none">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Calendar size={14} />
                    {format(new Date(user.createdAt), "dd/MM/yy", { locale: ptBR })}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

