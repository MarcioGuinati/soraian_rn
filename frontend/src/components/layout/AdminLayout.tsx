import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, LogOut, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0F1024] text-white flex flex-col md:flex-row font-sans selection:bg-[#7C3AED]/30">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#151630] border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Nuna" className="w-8 h-8 rounded-lg shadow-sm" />
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xl tracking-tight text-white">NUNA</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#8B5CF6] uppercase tracking-wider">Admin</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-[#A7A8C2] hover:text-white" onClick={handleLogout}>
          <LogOut size={20} />
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#151630] border-r border-white/5 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#D946EF] p-0.5 shadow-lg shadow-[#7C3AED]/20">
            <div className="w-full h-full bg-[#151630] rounded-[10px] flex items-center justify-center">
              <ShieldAlert size={20} className="text-[#8B5CF6]" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-xl text-white">NUNA</h1>
            <p className="text-[10px] text-[#A7A8C2] font-bold uppercase tracking-widest">Painel Admin</p>
          </div>
        </div>

        <Separator className="bg-white/5" />

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-bold text-[#A7A8C2] mb-3 px-3 uppercase tracking-wider">Principal</div>
          
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20' 
                  : 'text-[#A7A8C2] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20' 
                  : 'text-[#A7A8C2] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Users size={18} />
            Usuários
          </NavLink>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#0F1024] border border-white/5 rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 text-[#8B5CF6] flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-[#A7A8C2]">Administrador</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#A7A8C2] hover:text-white hover:bg-white/5" 
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" /> Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-12 bg-[#0F1024]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#151630] border-t border-white/5 flex items-center justify-around p-3 z-50 safe-area-bottom">
        <NavLink 
          to="/admin" 
          end 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-[#8B5CF6]' : 'text-[#A7A8C2]'}`
          }
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-[#8B5CF6]' : 'text-[#A7A8C2]'}`
          }
        >
          <Users size={24} />
          <span className="text-[10px] font-medium">Usuários</span>
        </NavLink>
      </nav>

    </div>
  );
}

