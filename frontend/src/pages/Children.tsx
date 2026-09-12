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
  const [childToShare, setChildToShare] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [revokeConfirm, setRevokeConfirm] = useState<{childId: string, accessId: string} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/children/${deleteConfirm}`);
      toast.success('Criança removida');
      await refreshChildren();
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao remover');
    }
  };

  const handleShareClick = (id: string) => {
    setChildToShare(id);
    setShareEmail('');
  };

  const confirmShare = async () => {
    if (!shareEmail || !childToShare) return;
    try {
      await api.post(`/children/${childToShare}/share`, { email: shareEmail });
      toast.success('Acesso compartilhado com sucesso!');
      await refreshChildren();
      setShareEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao compartilhar');
    }
  };

  const handleRevokeAccessClick = (childId: string, accessId: string) => {
    setRevokeConfirm({ childId, accessId });
  };

  const confirmRevokeAccess = async () => {
    if (!revokeConfirm) return;
    try {
      await api.delete(`/children/${revokeConfirm.childId}/access/${revokeConfirm.accessId}`);
      toast.success('Acesso removido com sucesso!');
      await refreshChildren();
      setRevokeConfirm(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao remover acesso');
    }
  };

  const selectedChildForShare = children.find(c => c.id === childToShare);

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
            <div key={child.id} className="ch-card" onClick={() => { selectChild(child); navigate('/'); }}>
              <div className="ch-card-avatar">{child.name.charAt(0)}</div>
              <div className="ch-card-info">
                <div className="ch-card-name">{child.name}</div>
                <div className="ch-card-age">{getChildAge(child.birthDate)} • {formatDate(child.birthDate)}</div>
                {child.sharedAccess && child.sharedAccess.length > 0 && (
                  <div style={{fontSize: 12, color: 'var(--color-primary-light)', marginTop: 4}}>
                    🤝 Compartilhado com: {child.sharedAccess.map((a: any) => a.user?.name?.split(' ')[0] || a.user?.email).join(', ')}
                  </div>
                )}
              </div>
              <div className="ch-card-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleShareClick(child.id)} title="Compartilhar Acesso">🤝</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(child)} title="Editar">✏️</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteClick(child.id)} title="Remover">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 24 }} onClick={() => { resetForm(); setShowForm(true); }}>
        + Adicionar criança
      </button>

      {childToShare && selectedChildForShare && (
        <div className="modal-overlay" onClick={() => setChildToShare(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              🤝 Compartilhar Acesso
            </div>
            
            {/* Lista de pessoas que já têm acesso */}
            {selectedChildForShare.sharedAccess && selectedChildForShare.sharedAccess.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Pessoas com acesso:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedChildForShare.sharedAccess.map((access: any) => (
                    <div key={access.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-input)', padding: '8px 12px', borderRadius: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{access.user?.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{access.user?.email}</span>
                      </div>
                      <button 
                        onClick={() => handleRevokeAccessClick(childToShare, access.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: 18 }}
                        title="Remover acesso"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Convidar nova pessoa:</h4>
            <p className="modal-text" style={{ marginBottom: 16 }}>
              Digite o e-mail da pessoa que você deseja convidar (ela já deve ter conta no app):
            </p>
            <input 
              type="email" 
              className="form-input" 
              placeholder="email@exemplo.com"
              value={shareEmail}
              onChange={e => setShareEmail(e.target.value)}
              style={{ marginBottom: 24 }}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setChildToShare(null)}>
                Fechar
              </button>
              <button className="btn btn-primary" onClick={confirmShare}>
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}

      {revokeConfirm && (
        <div className="modal-overlay" onClick={() => setRevokeConfirm(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              🛑 Remover Acesso
            </div>
            <p className="modal-text">
              Deseja realmente remover o acesso desta pessoa à rotina da criança?
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setRevokeConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmRevokeAccess}>
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              🗑️ Excluir Criança
            </div>
            <p className="modal-text">
              Deseja realmente remover esta criança e <strong>todos os seus registros</strong>? Essa ação não pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
}
