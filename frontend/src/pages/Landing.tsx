import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">🍼 SORAIA</div>
        <div className="nav-links">
          <a href="#features">Recursos</a>
          <a href="#pricing">Planos</a>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Criar Conta</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">Novo • Inteligência Artificial 🚀</div>
          <h1 className="hero-title">
            A rotina do seu bebê na <span className="text-gradient">palma da sua mão</span>.
          </h1>
          <p className="hero-subtitle">
            Acompanhe o sono, mamadas, trocas de fralda e a saúde do seu pequeno em um aplicativo inteligente, feito para pais modernos.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Experimentar Grátis</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>Já tenho conta</button>
          </div>
        </div>
        <div className="hero-visual animate-scale-in">
          <div className="mockup">
            <div className="mockup-header">Olá, Mamãe 👋</div>
            <div className="mockup-body">
              <div className="mockup-card" style={{ borderLeft: '4px solid var(--color-feeding)' }}>
                🍼 Última Mamada: 10 min atrás
              </div>
              <div className="mockup-card" style={{ borderLeft: '4px solid var(--color-sleep)' }}>
                😴 Sono: Dormindo agora
              </div>
              <div className="mockup-alert">
                ⚠️ Aviso de Atraso na Rotina Ideal
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="features">
        <div className="section-header">
          <h2 className="section-title">Tudo o que você precisa em um só lugar</h2>
          <p className="section-subtitle">O Soraia foi desenhado para simplificar as suas noites e dias.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-sleep-bg)', color: 'var(--color-sleep)' }}>⏰</div>
            <h3>Rotina Ideal</h3>
            <p>Configure os horários ideais e receba alertas no celular caso a rotina do seu bebê saia dos trilhos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>📊</div>
            <h3>Relatórios Precisos</h3>
            <p>Veja gráficos detalhados do sono e desenvolvimento para alinhar com o seu pediatra.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-feeding-bg)', color: 'var(--color-feeding)' }}>🤝</div>
            <h3>Acesso Compartilhado</h3>
            <p>Compartilhe o acesso em tempo real com o parceiro, babás e sua rede de apoio.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>🔔</div>
            <h3>Lembretes</h3>
            <p>Nunca mais esqueça do horário do remédio ou da próxima vacina importante.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2 className="section-title">Planos acessíveis e transparentes</h2>
          <p className="section-subtitle">Escolha o melhor plano para a sua família.</p>
        </div>
        <div className="pricing-grid">
          {/* Monthly */}
          <div className="pricing-card">
            <h3>Mensal</h3>
            <div className="price">R$ 19,90<span>/mês</span></div>
            <ul className="pricing-features">
              <li>✓ Acesso a todos os registros</li>
              <li>✓ Rotina Ideal com Alertas</li>
              <li>✓ Compartilhamento ilimitado</li>
              <li>✓ Relatórios e Gráficos</li>
              <li>✓ Suporte PWA Premium</li>
            </ul>
            <button className="btn btn-secondary btn-block" onClick={() => navigate('/register')}>Assinar Mensal</button>
          </div>
          
          {/* Yearly */}
          <div className="pricing-card popular">
            <div className="popular-badge">Mais Vantajoso</div>
            <h3>Anual</h3>
            <div className="price">R$ 200,00<span>/ano</span></div>
            <p className="price-saving">Economize 16% ao ano!</p>
            <ul className="pricing-features">
              <li>✓ Acesso a todos os registros</li>
              <li>✓ Rotina Ideal com Alertas</li>
              <li>✓ Compartilhamento ilimitado</li>
              <li>✓ Relatórios e Gráficos</li>
              <li>✓ Suporte PWA Premium</li>
            </ul>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/register')}>Assinar Anual</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-content">
          <h2>Pronto para transformar sua rotina?</h2>
          <p>Junte-se a diversas famílias que confiam no Soraia.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Criar conta gratuita</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">🍼 SORAIA</div>
          <div className="footer-links">
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Soraia Baby. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
