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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Usuários</h1>
        <p className="text-[#A7A8C2]">
          {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'} na plataforma.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-[#A7A8C2]" />
        </div>
        <Input
          type="text"
          className="pl-10 bg-[#151630] border-white/10 text-white placeholder:text-[#A7A8C2]/50 focus-visible:ring-[#7C3AED]"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#151630] border border-white/5 rounded-xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-[#A7A8C2]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {search ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </h3>
          <p className="text-[#A7A8C2] text-sm text-center max-w-sm">
            {search ? 'Tente buscar com outros termos ou limpe o filtro.' : 'Os usuários aparecerão aqui quando se cadastrarem.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="bg-[#151630] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7C3AED]/20 text-[#8B5CF6] flex items-center justify-center font-bold text-lg border border-[#7C3AED]/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg">{user.name}</h3>
                  <p className="text-[#A7A8C2] text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center flex-wrap md:flex-nowrap gap-4 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
                <div className="flex flex-col md:items-end flex-1 md:flex-none">
                  <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                    <Baby size={16} className="text-[#8B5CF6]" />
                    {user._count.children} {user._count.children === 1 ? 'filho' : 'filhos'}
                  </div>
                </div>

                <div className="flex flex-col md:items-end flex-1 md:flex-none">
                  <div className="flex items-center gap-1.5 text-[#A7A8C2] text-xs">
                    <Calendar size={14} />
                    {format(new Date(user.createdAt), "dd/MM/yy", { locale: ptBR })}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white"
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

