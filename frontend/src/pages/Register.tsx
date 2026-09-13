import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined });
      toast.success('Conta criada com sucesso! 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-image-side animate-fade-in">
          <div className="auth-image-overlay">
            <h2 className="auth-image-quote">
              "Acompanhe cada momento precioso do desenvolvimento do seu bebê."
            </h2>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-container animate-scale-in">
            <div className="auth-header">
              <span className="auth-logo">🍼</span>
              <h1 className="auth-title">Criar Conta</h1>
              <p className="auth-subtitle">Junte-se ao SORAIA gratuitamente</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone (opcional)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Já tem conta? <Link to="/login">Fazer login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
