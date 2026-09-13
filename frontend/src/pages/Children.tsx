import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate, getChildAge } from '../utils/helpers';
import './Children.css';

export default function ChildrenPage() {
  const { children, selectChild, refreshChildren } = useChild();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [birthHeight, setBirthHeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [parentNames, setParentNames] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setName(''); setBirthDate(''); setGender(''); setBirthWeight('');
    setBirthHeight(''); setBloodType(''); setParentNames(''); setNotes('');
    setEditId(null);
  };

  const handleEdit = (child: any) => {
    setEditId(child.id);
    setName(child.name);
    setBirthDate(child.birthDate?.split('T')[0] || '');
    setGender(child.gender);
    setBirthWeight(child.birthWeight?.toString() || '');
    setBirthHeight(child.birthHeight?.toString() || '');
    setBloodType(child.bloodType || '');
    setParentNames(child.parentNames || '');
    setNotes(child.notes || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name,
        birthDate: birthDate.includes('T') ? birthDate : `${birthDate}T12:00:00Z`,
        gender,
        birthWeight: birthWeight ? parseFloat(birthWeight) : undefined,
        birthHeight: birthHeight ? parseFloat(birthHeight) : undefined,
        bloodType: bloodType || undefined,
        parentNames: parentNames || undefined,
        notes: notes || undefined,
      };

      if (editId) {
        await api.put(`/children/${editId}`, data);
        toast.success('Criança atualizada!');
      } else {
        await api.post('/children', data);
        toast.success('Criança cadastrada! 🎉');
      }

      await refreshChildren();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta criança e todos os seus registros?')) return;
    try {
      await api.delete(`/children/${id}`);
      toast.success('Criança removida');
      await refreshChildren();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao remover');
    }
  };

  const handleShare = async (id: string) => {
    const email = window.prompt("Digite o e-mail da pessoa que você deseja convidar (ela já deve ter conta no app):");
    if (!email) return;
    try {
      await api.post(`/children/${id}/share`, { email });
      toast.success('Acesso compartilhado com sucesso!');
      await refreshChildren();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao compartilhar');
    }
  };

  if (showForm) {
    return (
      <div className="page"><div className="container">
        <div className="ch-form-header">
          <button className="btn btn-ghost" onClick={() => { setShowForm(false); resetForm(); }}>← Voltar</button>
          <h1>{editId ? 'Editar criança' : 'Nova criança'}</h1>
        </div>
        <div className="qr-form">
          <div className="form-group"><label className="form-label">Nome</label><input type="text" className="form-input" placeholder="Nome da criança" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Data de nascimento</label><input type="date" className="form-input" value={birthDate} onChange={e => setBirthDate(e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Sexo</label>
              <select className="form-input" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Selecione</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Peso ao nascer (kg)</label><input type="number" step="0.001" className="form-input" placeholder="3.250" value={birthWeight} onChange={e => setBirthWeight(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Altura ao nascer (cm)</label><input type="number" step="0.1" className="form-input" placeholder="49" value={birthHeight} onChange={e => setBirthHeight(e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Tipo sanguíneo</label><input type="text" className="form-input" placeholder="O+" value={bloodType} onChange={e => setBloodType(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Responsáveis</label><input type="text" className="form-input" placeholder="Nomes" value={parentNames} onChange={e => setParentNames(e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Observações</label><textarea className="form-input" value={notes} onChange={e => setNotes(e.target.value)} rows={3} /></div>
          <button className="btn btn-primary btn-lg btn-block" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : '✓ Salvar'}</button>
        </div>
      </div></div>
    );
  }

  return (
    <div className="page"><div className="container">
      <h1 className="ch-title">Crianças</h1>
      {children.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👶</div>
          <h2 className="empty-state-title">Nenhuma criança cadastrada</h2>
          <p className="empty-state-text">Adicione sua primeira criança</p>
        </div>
      ) : (
        <div className="ch-list">
          {children.map(child => (
            <div key={child.id} className="ch-card" onClick={() => { selectChild(child); navigate('/dashboard'); }}>
              <div className="ch-card-avatar">{child.name.charAt(0)}</div>
              <div className="ch-card-info">
                <div className="ch-card-name">{child.name}</div>
                <div className="ch-card-age">{getChildAge(child.birthDate)} • {formatDate(child.birthDate)}</div>
                {child.sharedAccess && child.sharedAccess.length > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--color-primary-light)', marginTop: 4 }}>
                    🤝 Compartilhado com: {child.sharedAccess.map((a: any) => a.user?.name?.split(' ')[0] || a.user?.email).join(', ')}
                  </div>
                )}
              </div>
              <div className="ch-card-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleShare(child.id)} title="Compartilhar Acesso">🤝</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(child)} title="Editar">✏️</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(child.id)} title="Remover">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 24 }} onClick={() => { resetForm(); setShowForm(true); }}>
        + Adicionar criança
      </button>
    </div></div>
  );
}
