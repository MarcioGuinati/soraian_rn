import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, LogOut, Moon, Sun } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('Nuna-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary/30">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Nuna" className="w-8 h-8 rounded-lg shadow-sm" />
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xl tracking-tight text-foreground">NUNA</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo.png" alt="Nuna Admin" className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 object-contain" />
          <div>
            <h1 className="font-extrabold tracking-tight text-xl text-foreground">NUNA</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Painel Admin</p>
          </div>
        </div>

        <Separator className="bg-border" />

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-bold text-muted-foreground mb-3 px-3 uppercase tracking-wider">Principal</div>
          
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <Users size={18} />
            Usuários
          </NavLink>
        </nav>

        <div className="p-4 mt-auto">
          <Button 
            variant="ghost" 
            className="w-full mb-4 justify-start text-muted-foreground hover:text-foreground hover:bg-accent" 
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </Button>

          <div className="bg-background border border-border rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent" 
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" /> Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-12 bg-background">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card border-t border-border flex items-center justify-around p-3 z-50 safe-area-bottom">
        <NavLink 
          to="/admin" 
          end 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Users size={24} />
          <span className="text-[10px] font-medium">Usuários</span>
        </NavLink>
      </nav>

    </div>
  );
}

