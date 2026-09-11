import { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { nowISO } from '../utils/helpers';
import './QuickRegister.css';

const RECORD_TYPES = [
  { key: 'feeding', emoji: '🍼', label: 'Mamou' },
  { key: 'food', emoji: '🍎', label: 'Alimentação' },
  { key: 'diaper-pee', emoji: '💧', label: 'Xixi' },
  { key: 'diaper-poop', emoji: '💩', label: 'Cocô' },
  { key: 'sleep', emoji: '😴', label: 'Sono' },
  { key: 'bath', emoji: '🛁', label: 'Banho' },
  { key: 'temperature', emoji: '🌡️', label: 'Temperatura' },
  { key: 'weight', emoji: '⚖️', label: 'Peso' },
  { key: 'medication', emoji: '💊', label: 'Medicamento' },
  { key: 'note', emoji: '📝', label: 'Observação' },
];

export default function QuickRegisterPage() {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string | null>(searchParams.get('type'));
  const { selectedChild } = useChild();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const editEvent = location.state?.event;
  const isEdit = !!editEvent;

  // Form states
  const [feedingType, setFeedingType] = useState(editEvent?.type || 'peito');
  const [amountMl, setAmountMl] = useState(editEvent?.amountMl?.toString() || '');
  const [breastSide, setBreastSide] = useState(editEvent?.breastSide || '');
  const [durationMinutes, setDurationMinutes] = useState(editEvent?.durationMinutes?.toString() || '');
  const [recordedAt, setRecordedAt] = useState(editEvent?.eventDate ? editEvent.eventDate.slice(0, 16) : nowISO());
  const [notes, setNotes] = useState(editEvent?.notes || '');

  // Food
  const [mealType, setMealType] = useState(editEvent?.mealType || 'almoco');
  const [food, setFood] = useState(editEvent?.food || '');
  const [foodAmount, setFoodAmount] = useState(editEvent?.amount?.toString() || '');
  const [foodUnit, setFoodUnit] = useState(editEvent?.unit || '');

  // Diaper
  const [consistency, setConsistency] = useState(editEvent?.consistency || '');
  const [color, setColor] = useState(editEvent?.color || '');

  // Sleep
  const [sleepStartedAt, setSleepStartedAt] = useState(editEvent?.startedAt ? editEvent.startedAt.slice(0, 16) : nowISO());
  const [sleepEndedAt, setSleepEndedAt] = useState(editEvent?.endedAt ? editEvent.endedAt.slice(0, 16) : '');
  const [sleepLocation, setSleepLocation] = useState(editEvent?.location || '');

  // Bath
  const [waterTemp, setWaterTemp] = useState(editEvent?.waterTemperature?.toString() || '');
  const [bathDuration, setBathDuration] = useState(editEvent?.durationMinutes?.toString() || '');

  // Temperature
  const [temperature, setTemperature] = useState(editEvent?.temperature?.toString() || '');
  const [measurementMethod, setMeasurementMethod] = useState(editEvent?.measurementMethod || 'axilar');

  // Weight
  const [weight, setWeight] = useState(editEvent?.weight?.toString() || '');
  const [height, setHeight] = useState(editEvent?.height?.toString() || '');
  const [headCircumference, setHeadCircumference] = useState(editEvent?.headCircumference?.toString() || '');

  // Medication
  const [medName, setMedName] = useState(editEvent?.medicationName || '');
  const [dosage, setDosage] = useState(editEvent?.dosage || '');
  const [medUnit, setMedUnit] = useState(editEvent?.unit || '');
  const [reason, setReason] = useState(editEvent?.reason || '');

  // Note
  const [category, setCategory] = useState(editEvent?.category || '');
  const [content, setContent] = useState(editEvent?.content || '');

  if (!selectedChild) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">👶</div>
          <h2 className="empty-state-title">Nenhuma criança selecionada</h2>
          <p className="empty-state-text">Cadastre uma criança primeiro para poder registrar eventos.</p>
        </div>
      </div></div>
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const childId = selectedChild.id;
      let endpoint = '';
      let body: any = {};

      switch (selectedType) {
        case 'feeding':
          endpoint = `/children/${childId}/feedings`;
          body = { type: feedingType, amountMl: amountMl ? parseFloat(amountMl) : undefined, breastSide: breastSide || undefined, durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined, recordedAt, notes: notes || undefined };
          break;
        case 'food':
          endpoint = `/children/${childId}/foods`;
          body = { mealType, food, amount: foodAmount ? parseFloat(foodAmount) : undefined, unit: foodUnit || undefined, recordedAt, notes: notes || undefined };
          break;
        case 'diaper-pee':
          endpoint = `/children/${childId}/diapers`;
          body = { type: 'xixi', recordedAt, notes: notes || undefined };
          break;
        case 'diaper-poop':
          endpoint = `/children/${childId}/diapers`;
          body = { type: 'coco', consistency: consistency || undefined, color: color || undefined, recordedAt, notes: notes || undefined };
          break;
        case 'sleep':
          endpoint = `/children/${childId}/sleep`;
          body = { startedAt: sleepStartedAt, endedAt: sleepEndedAt || undefined, location: sleepLocation || undefined, notes: notes || undefined };
          break;
        case 'bath':
          endpoint = `/children/${childId}/baths`;
          body = { startedAt: recordedAt, durationMinutes: bathDuration ? parseInt(bathDuration) : undefined, waterTemperature: waterTemp ? parseFloat(waterTemp) : undefined, notes: notes || undefined };
          break;
        case 'temperature':
          endpoint = `/children/${childId}/temperatures`;
          body = { temperature: parseFloat(temperature), measurementMethod, recordedAt, notes: notes || undefined };
          break;
        case 'weight':
          endpoint = `/children/${childId}/weights`;
          body = { weight: parseFloat(weight), height: height ? parseFloat(height) : undefined, headCircumference: headCircumference ? parseFloat(headCircumference) : undefined, recordedAt, notes: notes || undefined };
          break;
        case 'medication':
          endpoint = `/children/${childId}/medications`;
          body = { medicationName: medName, dosage, unit: medUnit || undefined, recordedAt, reason: reason || undefined, notes: notes || undefined };
          break;
        case 'note':
          endpoint = `/children/${childId}/notes`;
          body = { category: category || undefined, content, recordedAt };
          break;
      }

      if (isEdit) {
        endpoint = endpoint.replace(`/children/${childId}`, '');
        await api.put(`${endpoint}/${editEvent.id}`, body);
        toast.success('Registro atualizado! ✅');
      } else {
        await api.post(endpoint, body);
        toast.success('Registro salvo! ✅');
      }
      navigate(-1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar registro');
    } finally {
      setSaving(false);
    }
  };

  const handleStartSleep = async () => {
    setSaving(true);
    try {
      await api.post(`/children/${selectedChild.id}/sleep/start`, { location: sleepLocation || undefined });
      toast.success('Sono iniciado! 💤');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao iniciar sono');
    } finally {
      setSaving(false);
    }
  };

  const handleStopSleep = async () => {
    setSaving(true);
    try {
      await api.post(`/children/${selectedChild.id}/sleep/stop`);
      toast.success('Sono finalizado! ☀️');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Nenhum sono ativo');
    } finally {
      setSaving(false);
    }
  };

  if (!selectedType) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="qr-title">Registrar</h1>
          <p className="qr-subtitle">O que aconteceu com {selectedChild.name}?</p>
          <div className="qr-grid">
            {RECORD_TYPES.map((rt) => (
              <button key={rt.key} className="qr-type-btn" onClick={() => { setSelectedType(rt.key); setRecordedAt(nowISO()); setSleepStartedAt(nowISO()); }}>
                <span className="qr-type-emoji">{rt.emoji}</span>
                <span className="qr-type-label">{rt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderForm = () => {
    switch (selectedType) {
      case 'feeding':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <div className="qr-options">
                {['peito', 'formula', 'leite_ordenhado', 'outro'].map(t => (
                  <button key={t} className={`qr-option ${feedingType === t ? 'active' : ''}`} onClick={() => setFeedingType(t)}>
                    {t === 'peito' ? 'Peito' : t === 'formula' ? 'Fórmula' : t === 'leite_ordenhado' ? 'Ordenhado' : 'Outro'}
                  </button>
                ))}
              </div>
            </div>
            {feedingType === 'peito' && (
              <div className="form-group">
                <label className="form-label">Seio</label>
                <div className="qr-options">
                  {['esquerdo', 'direito', 'ambos'].map(s => (
                    <button key={s} className={`qr-option ${breastSide === s ? 'active' : ''}`} onClick={() => setBreastSide(s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantidade (ml)</label>
                <input type="number" className="form-input" placeholder="120" value={amountMl} onChange={e => setAmountMl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Duração (min)</label>
                <input type="number" className="form-input" placeholder="15" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} />
              </div>
            </div>
          </>
        );

      case 'food':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Refeição</label>
              <div className="qr-options">
                {[['cafe', 'Café'], ['almoco', 'Almoço'], ['lanche', 'Lanche'], ['jantar', 'Jantar'], ['outro', 'Outro']].map(([k, l]) => (
                  <button key={k} className={`qr-option ${mealType === k ? 'active' : ''}`} onClick={() => setMealType(k)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alimento</label>
              <input type="text" className="form-input" placeholder="Papinha de banana..." value={food} onChange={e => setFood(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input type="number" className="form-input" placeholder="100" value={foodAmount} onChange={e => setFoodAmount(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Unidade</label>
                <input type="text" className="form-input" placeholder="g, ml, colher" value={foodUnit} onChange={e => setFoodUnit(e.target.value)} />
              </div>
            </div>
          </>
        );

      case 'diaper-pee':
        return <p className="qr-quick-msg">Registro rápido de xixi 💧</p>;

      case 'diaper-poop':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Consistência</label>
              <div className="qr-options">
                {['líquido', 'mole', 'pastoso', 'firme'].map(c => (
                  <button key={c} className={`qr-option ${consistency === c ? 'active' : ''}`} onClick={() => setConsistency(c)}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cor</label>
              <div className="qr-options">
                {['amarelo', 'mostarda', 'verde', 'marrom', 'outro'].map(c => (
                  <button key={c} className={`qr-option ${color === c ? 'active' : ''}`} onClick={() => setColor(c)}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 'sleep':
        return (
          <>
            {!isEdit && (
              <div className="qr-sleep-actions">
                <button className="btn btn-primary btn-lg btn-block" onClick={handleStartSleep} disabled={saving} style={{marginBottom: 12}}>
                  😴 Iniciar sono
                </button>
                <button className="btn btn-secondary btn-lg btn-block" onClick={handleStopSleep} disabled={saving} style={{marginBottom: 24}}>
                  ☀️ Finalizar sono
                </button>
              </div>
            )}
            {!isEdit && <p className="qr-divider-text">ou registrar manualmente:</p>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Dormiu às</label>
                <input type="datetime-local" className="form-input" value={sleepStartedAt} onChange={e => setSleepStartedAt(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Acordou às</label>
                <input type="datetime-local" className="form-input" value={sleepEndedAt} onChange={e => setSleepEndedAt(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Local</label>
              <div className="qr-options">
                {['berço', 'colo', 'cama', 'carrinho', 'outro'].map(l => (
                  <button key={l} className={`qr-option ${sleepLocation === l ? 'active' : ''}`} onClick={() => setSleepLocation(l)}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 'bath':
        return (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duração (min)</label>
              <input type="number" className="form-input" placeholder="15" value={bathDuration} onChange={e => setBathDuration(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Temp. água (°C)</label>
              <input type="number" step="0.1" className="form-input" placeholder="37" value={waterTemp} onChange={e => setWaterTemp(e.target.value)} />
            </div>
          </div>
        );

      case 'temperature':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Temperatura (°C)</label>
              <input type="number" step="0.1" className="form-input" placeholder="36.5" value={temperature} onChange={e => setTemperature(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Método</label>
              <div className="qr-options">
                {['axilar', 'oral', 'retal', 'infravermelho'].map(m => (
                  <button key={m} className={`qr-option ${measurementMethod === m ? 'active' : ''}`} onClick={() => setMeasurementMethod(m)}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 'weight':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input type="number" step="0.01" className="form-input" placeholder="4.5" value={weight} onChange={e => setWeight(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Altura (cm)</label>
                <input type="number" step="0.1" className="form-input" placeholder="55" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Per. cefálico (cm)</label>
                <input type="number" step="0.1" className="form-input" placeholder="35" value={headCircumference} onChange={e => setHeadCircumference(e.target.value)} />
              </div>
            </div>
          </>
        );

      case 'medication':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Medicamento</label>
              <input type="text" className="form-input" placeholder="Vitamina D" value={medName} onChange={e => setMedName(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Dose</label>
                <input type="text" className="form-input" placeholder="2" value={dosage} onChange={e => setDosage(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Unidade</label>
                <input type="text" className="form-input" placeholder="gotas, ml" value={medUnit} onChange={e => setMedUnit(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Motivo</label>
              <input type="text" className="form-input" placeholder="Suplementação..." value={reason} onChange={e => setReason(e.target.value)} />
            </div>
          </>
        );

      case 'note':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input type="text" className="form-input" placeholder="Geral, Marco, Saúde..." value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Observação</label>
              <textarea className="form-input" placeholder="Escreva sua anotação..." value={content} onChange={e => setContent(e.target.value)} required rows={4} />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const typeInfo = RECORD_TYPES.find(t => t.key === selectedType);

  return (
    <div className="page">
      <div className="container">
        <div className="qr-form-header animate-fade-in">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Voltar</button>
          <h1 className="qr-form-title">{isEdit ? 'Editar' : 'Registrar'} {typeInfo?.emoji}</h1>
        </div>

        <div className="qr-form animate-fade-in">
          {renderForm()}

          {/* Shared: date/time and notes */}
          {selectedType !== 'sleep' && (
            <div className="form-group">
              <label className="form-label">Data/Hora</label>
              <input type="datetime-local" className="form-input" value={recordedAt} onChange={e => setRecordedAt(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea className="form-input" placeholder="Alguma observação..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          </div>

          {/* Save button (hide for sleep's start/stop actions) */}
          {selectedType !== 'sleep' && (
            <button className="btn btn-primary btn-lg btn-block" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : (isEdit ? '✓ Salvar alterações' : '✓ Salvar registro')}
            </button>
          )}
          {selectedType === 'sleep' && (
            <button className="btn btn-primary btn-lg btn-block" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : (isEdit ? '✓ Salvar alterações' : '✓ Salvar manualmente')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
