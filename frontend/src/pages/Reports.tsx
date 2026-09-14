import { useState, useEffect } from 'react';
import { useChild } from '../contexts/ChildContext';
import api from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import './Reports.css';

const COLORS = ['#7C8CF8', '#F8A4C8', '#A78BFA', '#34D399', '#60C5E8', '#FB923C', '#F87171'];

type Period = 'today' | 'yesterday' | '7d' | '30d';

export default function ReportsPage() {
  const { selectedChild } = useChild();
  const [period, setPeriod] = useState<Period>('7d');
  const [reportType, setReportType] = useState('feeding');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedChild) loadReport();
  }, [selectedChild, period, reportType]);

  const getDateRange = () => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
    let startOfDay: string;

    const getStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
    const getEnd = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

    switch (period) {
      case 'today':
        startOfDay = getStart(now);
        break;
      case 'yesterday':
        const yesterday = subDays(now, 1);
        return { startDate: getStart(yesterday), endDate: getEnd(yesterday) };
      case '7d':
        startOfDay = getStart(subDays(now, 7));
        break;
      case '30d':
        startOfDay = getStart(subDays(now, 30));
        break;
      default:
        startOfDay = getStart(subDays(now, 7));
    }
    return { startDate: startOfDay, endDate: endOfDay };
  };

  const loadReport = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const res = await api.get(`/children/${selectedChild.id}/reports`, {
        params: { type: reportType, startDate, endDate }
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  const renderFeedingReport = () => {
    if (!data) return null;
    const typeData = Object.entries(data.byType || {}).map(([name, value]) => ({
      name: name === 'peito' ? 'Peito' : name === 'formula' ? 'Fórmula' : name,
      value: value as number,
    }));

    return (
      <>
        <div className="rp-summary">
          <div className="rp-stat"><div className="rp-stat-value">{data.total}</div><div className="rp-stat-label">Mamadas</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.totalMl} ml</div><div className="rp-stat-label">Total</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.avgMl} ml</div><div className="rp-stat-label">Média</div></div>
        </div>
        {data.daily?.length > 0 && (
          <div className="rp-chart-card">
            <h3 className="rp-chart-title">Evolução diária (ml)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="totalMl" fill="var(--color-feeding)" radius={[6, 6, 0, 0]} name="ml" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {typeData.length > 0 && (
          <div className="rp-chart-card">
            <h3 className="rp-chart-title">Peito × Fórmula</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </>
    );
  };

  const renderSleepReport = () => {
    if (!data) return null;
    const totalHours = Math.floor(data.totalMinutes / 60);
    const totalMins = data.totalMinutes % 60;

    return (
      <>
        <div className="rp-summary">
          <div className="rp-stat"><div className="rp-stat-value">{totalHours}h {totalMins}m</div><div className="rp-stat-label">Total</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.total}</div><div className="rp-stat-label">Períodos</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.avgDuration}min</div><div className="rp-stat-label">Média</div></div>
        </div>
        {data.daily?.length > 0 && (
          <div className="rp-chart-card">
            <h3 className="rp-chart-title">Sono diário (min)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="totalMinutes" fill="var(--color-sleep)" radius={[6, 6, 0, 0]} name="min" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="rp-chart-card">
          <h3 className="rp-chart-title">Diurno × Noturno</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{ name: 'Diurno', value: data.dayMinutes }, { name: 'Noturno', value: data.nightMinutes }]} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                <Cell fill="#FBBF24" />
                <Cell fill="#7C8CF8" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderDiaperReport = () => {
    if (!data) return null;
    return (
      <>
        <div className="rp-summary">
          <div className="rp-stat"><div className="rp-stat-value">{data.total}</div><div className="rp-stat-label">Total</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.peeCount}</div><div className="rp-stat-label">💧 Xixi</div></div>
          <div className="rp-stat"><div className="rp-stat-value">{data.poopCount}</div><div className="rp-stat-label">💩 Cocô</div></div>
        </div>
        {data.daily?.length > 0 && (
          <div className="rp-chart-card">
            <h3 className="rp-chart-title">Fraldas por dia</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="pee" fill="var(--color-diaper-pee)" radius={[6, 6, 0, 0]} name="Xixi" stackId="a" />
                <Bar dataKey="poop" fill="var(--color-diaper-poop)" radius={[6, 6, 0, 0]} name="Cocô" stackId="a" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </>
    );
  };

  const renderWeightReport = () => {
    if (!data?.records?.length) return <div className="empty-state"><div className="empty-state-icon">⚖️</div><h2 className="empty-state-title">Sem dados de peso</h2></div>;
    return (
      <div className="rp-chart-card">
        <h3 className="rp-chart-title">Evolução do peso (kg)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.records}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={3} dot={{ fill: 'var(--color-weight)', r: 5 }} name="Peso (kg)" />
            {data.records[0]?.height && <Line type="monotone" dataKey="height" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} name="Altura (cm)" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderReport = () => {
    switch (reportType) {
      case 'feeding': return renderFeedingReport();
      case 'sleep': return renderSleepReport();
      case 'diaper': return renderDiaperReport();
      case 'weight': return renderWeightReport();
      default: return <div className="empty-state"><div className="empty-state-icon">📊</div><h2 className="empty-state-title">Relatório em construção</h2></div>;
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="rp-title">Relatórios</h1>

        <div className="rp-type-selector">
          {[['feeding', '🍼 Alimentação'], ['sleep', '😴 Sono'], ['diaper', '🧷 Fraldas'], ['weight', '⚖️ Peso']].map(([key, label]) => (
            <button key={key} className={`qr-option ${reportType === key ? 'active' : ''}`} onClick={() => setReportType(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="rp-period-selector">
          {[['today', 'Hoje'], ['yesterday', 'Ontem'], ['7d', '7 dias'], ['30d', '30 dias']].map(([key, label]) => (
            <button key={key} className={`rp-period-btn ${period === key ? 'active' : ''}`} onClick={() => setPeriod(key as Period)}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, marginBottom: 12, borderRadius: 16 }} />)}</div>
        ) : (
          <div className="animate-fade-in">{renderReport()}</div>
        )}
      </div>
    </div>
  );
}
