import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { Vaccine } from '../types';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import './VaccineCalendar.css';

const SUS_CALENDAR = [
  {
    age: 'Ao nascer',
    vaccines: [
      { name: 'BCG', dose: 'Dose única', desc: 'Previne formas graves de tuberculose' },
      { name: 'Hepatite B', dose: 'Dose ao nascer', desc: 'Previne a hepatite B' }
    ]
  },
  {
    age: '2 meses',
    vaccines: [
      { name: 'Pentavalente', dose: '1ª dose', desc: 'Previne difteria, tétano, coqueluche, hepatite B e infecções por Haemophilus influenzae B' },
      { name: 'VIP (Poliomielite)', dose: '1ª dose', desc: 'Previne poliomielite (paralisia infantil)' },
      { name: 'Pneumocócica 10', dose: '1ª dose', desc: 'Previne pneumonia, otite, meningite e outras doenças causadas pelo Pneumococo' },
      { name: 'Rotavírus', dose: '1ª dose', desc: 'Previne diarreia por rotavírus' }
    ]
  },
  {
    age: '3 meses',
    vaccines: [
      { name: 'Meningocócica C', dose: '1ª dose', desc: 'Previne doença meningocócica C' }
    ]
  },
  {
    age: '4 meses',
    vaccines: [
      { name: 'Pentavalente', dose: '2ª dose', desc: 'Difteria, tétano, coqueluche, hepatite B e Haemophilus B' },
      { name: 'VIP (Poliomielite)', dose: '2ª dose', desc: 'Previne poliomielite' },
      { name: 'Pneumocócica 10', dose: '2ª dose', desc: 'Pneumonia, otite, meningite' },
      { name: 'Rotavírus', dose: '2ª dose', desc: 'Previne diarreia por rotavírus' }
    ]
  },
  {
    age: '5 meses',
    vaccines: [
      { name: 'Meningocócica C', dose: '2ª dose', desc: 'Previne doença meningocócica C' }
    ]
  },
  {
    age: '6 meses',
    vaccines: [
      { name: 'Pentavalente', dose: '3ª dose', desc: 'Difteria, tétano, coqueluche, hepatite B e Haemophilus B' },
      { name: 'VIP (Poliomielite)', dose: '3ª dose', desc: 'Previne poliomielite' },
      { name: 'Covid-19', dose: '1ª dose', desc: 'Previne formas graves da Covid-19' }
    ]
  },
  {
    age: '9 meses',
    vaccines: [
      { name: 'Febre Amarela', dose: 'Dose inicial', desc: 'Previne a febre amarela' }
    ]
  },
  {
    age: '12 meses (1 ano)',
    vaccines: [
      { name: 'Tríplice Viral', dose: '1ª dose', desc: 'Previne sarampo, caxumba e rubéola' },
      { name: 'Pneumocócica 10', dose: 'Reforço', desc: 'Pneumonia, otite, meningite' },
      { name: 'Meningocócica C', dose: 'Reforço', desc: 'Previne doença meningocócica C' }
    ]
  },
  {
    age: '15 meses (1 ano e 3 meses)',
    vaccines: [
      { name: 'DTP', dose: '1º Reforço', desc: 'Previne difteria, tétano e coqueluche' },
      { name: 'VOP (Poliomielite oral)', dose: '1º Reforço', desc: 'Previne poliomielite' },
      { name: 'Hepatite A', dose: 'Dose única', desc: 'Previne hepatite A' },
      { name: 'Tetraviral', dose: 'Dose única', desc: 'Previne sarampo, caxumba, rubéola e varicela' }
    ]
  }
];

export default function VaccineCalendarPage() {
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<Vaccine[]>([]);
  const [selectedVac, setSelectedVac] = useState<{name: string, dose: string} | null>(null);
  const [vaccineToDelete, setVaccineToDelete] = useState<string | null>(null);

  // Form
  const [vacDate, setVacDate] = useState(new Date().toISOString().split('T')[0]);
  const [vacLocation, setVacLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedChild) loadVaccines();
  }, [selectedChild]);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/children/${selectedChild?.id}/vaccines`);
      setRecords(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedVac || !selectedChild) return;
    try {
      setSaving(true);
      await api.post(`/children/${selectedChild.id}/vaccines`, {
        name: selectedVac.name,
        dose: selectedVac.dose,
        date: vacDate,
        location: vacLocation,
        notes: 'Adicionada pelo Calendário Nacional do SUS'
      });
      toast.success('Vacina registrada!');
      setSelectedVac(null);
      loadVaccines();
    } catch {
      toast.error('Erro ao registrar vacina');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vaccineToDelete) return;
    try {
      setLoading(true);
      await api.delete(`/vaccines/${vaccineToDelete}`);
      toast.success('Vacina desmarcada!');
      setVaccineToDelete(null);
      loadVaccines();
    } catch {
      toast.error('Erro ao desmarcar vacina');
      setLoading(false);
    }
  };

  const isVaccineGiven = (name: string, dose: string) => {
    return records.find(r => 
      r.name.toLowerCase() === name.toLowerCase() && 
      (r.dose?.toLowerCase() === dose.toLowerCase() || (!r.dose && dose === 'Dose única'))
    );
  };

  if (!selectedChild) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">👶</div>
          <h2 className="empty-state-title">Nenhuma criança</h2>
        </div>
      </div></div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="qr-form-header animate-fade-in" style={{ marginBottom: 16 }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Voltar</button>
        </div>
        
        <h1 className="rp-title" style={{ marginBottom: 4 }}>Calendário SUS</h1>
        <p className="qr-subtitle" style={{ marginBottom: 24 }}>Acompanhe as vacinas de {selectedChild.name}</p>

        {loading ? (
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
        ) : (
          <div className="animate-fade-in">
            {SUS_CALENDAR.map((group, idx) => (
              <div key={idx} className="vac-group">
                <h2 className="vac-age-title">{group.age}</h2>
                <div className="vac-list">
                  {group.vaccines.map((v, vidx) => {
                    const record = isVaccineGiven(v.name, v.dose);
                    const isGiven = !!record;
                    return (
                      <div key={vidx} className={`vac-card ${isGiven ? 'given' : ''}`}>
                        <div className="vac-info">
                          <div className="vac-header">
                            <span className="vac-name">{v.name}</span>
                            <span className="vac-dose">{v.dose}</span>
                          </div>
                          <div className="vac-desc">{v.desc}</div>
                          {isGiven && record && (
                            <div className="vac-date">✅ Aplicada em {formatDate(record.date)}</div>
                          )}
                        </div>
                        <div className="vac-action">
                          {!isGiven ? (
                            <button className="btn btn-primary btn-sm" onClick={() => setSelectedVac({name: v.name, dose: v.dose})}>Registrar</button>
                          ) : (
                            <button 
                              className="btn btn-ghost btn-sm" 
                              style={{ padding: 0, borderRadius: '50%' }} 
                              onClick={() => setVaccineToDelete(record!.id)} 
                              title="Desmarcar vacina"
                            >
                              <span className="vac-icon-check" style={{ cursor: 'pointer' }}>✓</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal/Form for registering */}
        {selectedVac && (
          <div className="vac-modal-overlay">
            <div className="vac-modal animate-fade-in">
              <h3 className="vac-modal-title">Registrar Vacina</h3>
              <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
                <strong>{selectedVac.name}</strong> ({selectedVac.dose})
              </p>
              <div className="form-group">
                <label className="form-label">Data da Aplicação</label>
                <input type="date" className="form-input" value={vacDate} onChange={e => setVacDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Local (Posto/Clínica)</label>
                <input type="text" className="form-input" placeholder="Ex: UBS Centro" value={vacLocation} onChange={e => setVacLocation(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <button className="btn btn-secondary btn-block" onClick={() => setSelectedVac(null)} disabled={saving}>Cancelar</button>
                <button className="btn btn-primary btn-block" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Confirmar'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Deleting */}
        {vaccineToDelete && (
          <div className="vac-modal-overlay">
            <div className="vac-modal animate-fade-in">
              <h3 className="vac-modal-title" style={{ color: 'var(--color-danger)' }}>Atenção</h3>
              <p style={{ marginBottom: 24, color: 'var(--color-text)' }}>
                Tem certeza que deseja desmarcar essa vacina?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-block" onClick={() => setVaccineToDelete(null)} disabled={saving}>Cancelar</button>
                <button className="btn btn-danger btn-block" onClick={handleDelete} disabled={saving}>Desmarcar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
