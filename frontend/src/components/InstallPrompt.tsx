import { useState, useEffect } from 'react';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    
    // Check if dismissed recently
    const dismissed = localStorage.getItem('soraia-install-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return; // Dismissed within 7 days
    }

    if (isStandalone) return;

    // iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIOS(true);
      setShowPrompt(true);
      return;
    }

    // Android / Chrome / Edge PWA prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('soraia-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt-card animate-fade-in">
        <button className="install-prompt-close" onClick={handleDismiss}>✕</button>
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-content">
          <h4>Instale o SORAIA</h4>
          {isIOS ? (
            <p>
              Para uma melhor experiência, instale o aplicativo. Toque em <img src="https://developer.apple.com/design/human-interface-guidelines/images/icons/Share_2x.png" alt="Share" style={{ width: 14, verticalAlign: 'middle', filter: 'invert(0.5)' }} /> e depois <strong>"Adicionar à Tela de Início"</strong>.
            </p>
          ) : (
            <p>Adicione nosso aplicativo à sua tela inicial para acesso rápido e offline!</p>
          )}
        </div>
        {!isIOS && (
          <button className="btn btn-primary btn-sm" onClick={handleInstallClick} style={{ alignSelf: 'center', marginLeft: 'auto' }}>
            Instalar
          </button>
        )}
      </div>
    </div>
  );
}
