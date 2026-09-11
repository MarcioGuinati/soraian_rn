import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      updateUser(res.data.data);
      toast.success('Perfil atualizado!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Senha alterada!');
      setCurrentPassword(''); setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao alterar senha');
    } finally { setSaving(false); }
  };

  const [theme, setTheme] = useState(localStorage.getItem('soraia-theme') || 'auto');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('soraia-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="page"><div className="container">
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 24 }}>⚙️ Configurações</h1>

      <div className="qr-form" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 16 }}>Aparência</h2>
        <div className="form-group">
          <select className="form-input" value={theme} onChange={e => handleThemeChange(e.target.value)}>
            <option value="auto">Automático (Sistema)</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
      </div>

      <div className="qr-form" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 16 }}>Notificações</h2>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Ative as notificações para receber avisos sobre lembretes no seu celular.
        </p>
        <button 
          className="btn btn-secondary btn-block" 
          onClick={async () => {
            try {
              const { subscribeToPushNotifications } = await import('../services/pushApi');
              await subscribeToPushNotifications();
              toast.success('Notificações ativadas com sucesso!');
            } catch (err: any) {
              toast.error(err.message || 'Erro ao ativar notificações');
            }
          }}
        >
          🔔 Ativar Notificações Push
        </button>
      </div>

      <div className="qr-form" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 16 }}>Perfil</h2>
        <div className="form-group"><label className="form-label">Nome</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Telefone</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <button className="btn btn-primary btn-block" onClick={handleUpdateProfile} disabled={saving}>Salvar perfil</button>
      </div>

      <div className="qr-form">
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 16 }}>Alterar senha</h2>
        <div className="form-group"><label className="form-label">Senha atual</label><input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Nova senha</label><input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} /></div>
        <button className="btn btn-primary btn-block" onClick={handleChangePassword} disabled={saving}>Alterar senha</button>
      </div>
    </div></div>
  );
}
