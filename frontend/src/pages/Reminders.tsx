import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Reminder } from '../types';
import { formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function RemindersPage() {
  const { selectedChild } = useChild();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  useEffect(() => { if (selectedChild) loadReminders(); }, [selectedChild]);

  const loadReminders = async () => {
    if (!selectedChild) return;
    try { setLoading(true); const res = await api.get(`/children/${selectedChild.id}/reminders`); setReminders(res.data.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleToggle = async (id: string) => {
    try { await api.patch(`/reminders/${id}/toggle`); loadReminders(); } catch { toast.error('Erro'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover lembrete?')) return;
    try { await api.delete(`/reminders/${id}`); toast.success('Removido'); loadReminders(); } catch { toast.error('Erro'); }
  };

  const handleSave = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/reminders`, { title, description, dateTime, recurrence });
      toast.success('Lembrete criado!');
      setShowForm(false); setTitle(''); setDescription(''); setDateTime(''); setRecurrence('none');
      loadReminders();
    } catch { toast.error('Erro ao salvar'); }
  };

  return (
    <div className="page"><div className="container">
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 16 }}>🔔 Lembretes</h1>

      {showForm ? (
        <div className="qr-form animate-fade-in">
          <div className="form-group"><label className="form-label">Título</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Descrição</label><textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={2} /></div>
          <div className="form-group"><label className="form-label">Data/Hora</label><input type="datetime-local" className="form-input" value={dateTime} onChange={e => setDateTime(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Recorrência</label>
            <select className="form-input" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
              <option value="none">Sem recorrência</option><option value="daily">Diário</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option>
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-secondary btn-block" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary btn-block" onClick={handleSave}>Salvar</button>
          </div>
        </div>
      ) : (
        <>
          {loading ? <div className="skeleton" style={{height:200,borderRadius:16}} /> : reminders.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🔔</div><h2 className="empty-state-title">Sem lembretes</h2></div>
          ) : (
            <div className="health-list animate-fade-in">{reminders.map(r => (
              <div key={r.id} className="health-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => handleToggle(r.id)} style={{ fontSize: 24, opacity: r.enabled ? 1 : 0.4, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {r.enabled ? '🔔' : '🔕'}
                </button>
                <div style={{ flex: 1, opacity: r.enabled ? 1 : 0.5 }}>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  {r.description && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{r.description}</div>}
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                    {formatDateTime(r.dateTime)}{r.recurrence !== 'none' ? ` · ${r.recurrence}` : ''}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(r.id)}>🗑️</button>
              </div>
            ))}</div>
          )}
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>+ Novo lembrete</button>
        </>
      )}
    </div></div>
  );
}
