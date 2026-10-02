import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useChild } from '../../contexts/ChildContext';
import InstallPrompt from '../InstallPrompt';
import { Home, ClipboardList, Plus, BarChart2, Menu, Settings, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { selectedChild } = useChild();
  const location = useLocation();
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

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-background min-h-screen flex flex-col font-sans pb-[80px] relative shadow-2xl ring-1 ring-border/50">
        
        {/* Mobile Top App Bar */}
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 safe-top">
          <div className="flex h-[72px] items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Nuna Logo" className="w-[52px] h-[52px] rounded-xl object-contain shadow-sm app-logo-image" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-primary">NUNA</span>
                <span className="text-[10px] font-medium text-muted-foreground leading-tight truncate max-w-[150px]">Cuidar também é acompanhar.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform shrink-0">
                {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
              </button>
              <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform shrink-0">
                <Settings size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Bottom Navigation for Mobile */}
        <nav className="fixed bottom-0 z-50 w-full max-w-md bg-card border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.04)] safe-bottom">
          <div className="flex items-center justify-around h-16 px-2">
            
            <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} end>
              <Home size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold">Início</span>
            </NavLink>
            
            <NavLink to="/timeline" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <ClipboardList size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold">Timeline</span>
            </NavLink>

            {/* Central FAB */}
            <div className="relative -top-5 flex justify-center w-16">
              <NavLink to="/add" className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/40 active:scale-90 transition-transform">
                <Plus size={28} strokeWidth={2.5} />
              </NavLink>
            </div>

            <NavLink to="/reports" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <BarChart2 size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold">Relatórios</span>
            </NavLink>

            <NavLink to="/more" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Menu size={24} strokeWidth={2} />
              <span className="text-[10px] font-semibold">Mais</span>
            </NavLink>

          </div>
        </nav>

        <InstallPrompt />
      </div>
    </div>
  );
}
