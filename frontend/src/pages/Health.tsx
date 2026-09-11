import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Appointment, Vaccine } from '../types';
import { formatDate } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import './Health.css';

export default function HealthPage() {
  const { selectedChild } = useChild();
  const [tab, setTab] = useState<'appointments' | 'vaccines' | 'growth'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showForm, setShowForm] = useState(false);
  const [apptProfessional, setApptProfessional] = useState('');
  const [apptSpecialty, setApptSpecialty] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptLocation, setApptLocation] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  const [vacName, setVacName] = useState('');
  const [vacDose, setVacDose] = useState('');
  const [vacDate, setVacDate] = useState('');
  const [vacLocation, setVacLocation] = useState('');
  const [vacNotes, setVacNotes] = useState('');

  useEffect(() => { if (selectedChild) loadData(); }, [selectedChild, tab]);

  const loadData = async () => {
    if (!selectedChild) return;
    setLoading(true);
    try {
      if (tab === 'appointments') {
        const res = await api.get(`/children/${selectedChild.id}/appointments`);
        setAppointments(res.data.data);
      } else if (tab === 'vaccines') {
        const res = await api.get(`/children/${selectedChild.id}/vaccines`);
        setVaccines(res.data.data);
      } else {
        const res = await api.get(`/children/${selectedChild.id}/weights`);
        setWeights(res.data.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSaveAppointment = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/appointments`, {
        professional: apptProfessional, specialty: apptSpecialty, date: apptDate,
        time: apptTime, location: apptLocation, reason: apptReason, notes: apptNotes
      });
      toast.success('Consulta salva!');
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const handleSaveVaccine = async () => {
    try {
      await api.post(`/children/${selectedChild!.id}/vaccines`, {
        name: vacName, dose: vacDose, date: vacDate, location: vacLocation, notes: vacNotes
      });
      toast.success('Vacina salva!');
      setShowForm(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  return (
    <div className="page"><div className="container">
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 16 }}>❤️ Saúde</h1>
      <div className="rp-type-selector">
        {[['appointments', '🩺 Consultas'], ['vaccines', '💉 Vacinas'], ['growth', '📈 Crescimento']].map(([k, l]) => (
          <button key={k} className={`qr-option ${tab === k ? 'active' : ''}`} onClick={() => { setTab(k as any); setShowForm(false); }}>{l}</button>
        ))}
      </div>

      {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 16 }} /> : (
        <div className="animate-fade-in">
          {tab === 'appointments' && !showForm && (
            <>
              {appointments.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">🩺</div><h2 className="empty-state-title">Sem consultas</h2></div>
              ) : (
                <div className="health-list">{appointments.map(a => (
                  <div key={a.id} className="health-card">
                    <div className="health-card-header"><strong>{a.professional}</strong>{a.specialty && <span> · {a.specialty}</span>}</div>
                    <div className="health-card-detail">📅 {formatDate(a.date)}{a.time ? ` às ${a.time}` : ''}</div>
                    {a.location && <div className="health-card-detail">📍 {a.location}</div>}
                    {a.reason && <div className="health-card-detail">💬 {a.reason}</div>}
                  </div>
                ))}</div>
              )}
              <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>+ Nova consulta</button>
            </>
          )}

          {tab === 'appointments' && showForm && (
            <div className="qr-form">
              <div className="form-group"><label className="form-label">Profissional</label><input className="form-input" value={apptProfessional} onChange={e => setApptProfessional(e.target.value)} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Especialidade</label><input className="form-input" value={apptSpecialty} onChange={e => setApptSpecialty(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Data</label><input type="date" className="form-input" value={apptDate} onChange={e => setApptDate(e.target.value)} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Horário</label><input type="time" className="form-input" value={apptTime} onChange={e => setApptTime(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Local</label><input className="form-input" value={apptLocation} onChange={e => setApptLocation(e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Motivo</label><input className="form-input" value={apptReason} onChange={e => setApptReason(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Observações</label><textarea className="form-input" value={apptNotes} onChange={e => setApptNotes(e.target.value)} rows={2} /></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-secondary btn-block" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary btn-block" onClick={handleSaveAppointment}>Salvar</button>
              </div>
            </div>
          )}

          {tab === 'vaccines' && !showForm && (
            <>
              {vaccines.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">💉</div><h2 className="empty-state-title">Sem vacinas</h2></div>
              ) : (
                <div className="health-list">{vaccines.map(v => (
                  <div key={v.id} className="health-card">
                    <div className="health-card-header"><strong>{v.name}</strong>{v.dose && <span> · {v.dose}</span>}</div>
                    <div className="health-card-detail">📅 {formatDate(v.date)}</div>
                    {v.location && <div className="health-card-detail">📍 {v.location}</div>}
                  </div>
                ))}</div>
              )}
              <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>+ Nova vacina</button>
            </>
          )}

          {tab === 'vaccines' && showForm && (
            <div className="qr-form">
              <div className="form-group"><label className="form-label">Vacina</label><input className="form-input" value={vacName} onChange={e => setVacName(e.target.value)} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Dose</label><input className="form-input" value={vacDose} onChange={e => setVacDose(e.target.value)} placeholder="1ª dose" /></div>
                <div className="form-group"><label className="form-label">Data</label><input type="date" className="form-input" value={vacDate} onChange={e => setVacDate(e.target.value)} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Local</label><input className="form-input" value={vacLocation} onChange={e => setVacLocation(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Observações</label><textarea className="form-input" value={vacNotes} onChange={e => setVacNotes(e.target.value)} rows={2} /></div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-secondary btn-block" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary btn-block" onClick={handleSaveVaccine}>Salvar</button>
              </div>
            </div>
          )}

          {tab === 'growth' && (
            <>
              {weights.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">📈</div><h2 className="empty-state-title">Sem dados</h2><p className="empty-state-text">Registre peso e altura para ver o crescimento</p></div>
              ) : (
                <div className="rp-chart-card">
                  <h3 className="rp-chart-title">Evolução do peso</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weights.slice().reverse().map((w: any) => ({ date: w.recordedAt?.split('T')[0], weight: w.weight, height: w.height }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5)} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={3} dot={{ fill: 'var(--color-weight)', r: 5 }} name="Peso (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div></div>
  );
}
