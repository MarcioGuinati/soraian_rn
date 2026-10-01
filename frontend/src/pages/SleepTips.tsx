import React from 'react';
import './SleepTips.css';

export default function SleepTipsPage() {
  return (
    <div className="page sleep-tips-page">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--color-text)' }}>
          Dicas de Sono 🌙
        </h1>

        <div className="sleep-section">
          <h2 className="sleep-section-title">📊 Tabelas de Referência</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Média de sono recomendada por idade. Cada bebê é único, use apenas como um guia.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="sleep-table">
              <thead>
                <tr>
                  <th>Idade</th>
                  <th>Sono Diurno</th>
                  <th>Sono Noturno</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Recém-nascido</td>
                  <td>8-9 horas</td>
                  <td>8-9 horas</td>
                  <td>16-18h</td>
                </tr>
                <tr>
                  <td>1-3 meses</td>
                  <td>4-5 horas</td>
                  <td>9-10 horas</td>
                  <td>14-15h</td>
                </tr>
                <tr>
                  <td>4-6 meses</td>
                  <td>3-4 horas</td>
                  <td>10-11 horas</td>
                  <td>14-15h</td>
                </tr>
                <tr>
                  <td>7-9 meses</td>
                  <td>2-3 horas</td>
                  <td>11-12 horas</td>
                  <td>14h</td>
                </tr>
                <tr>
                  <td>10-12 meses</td>
                  <td>2-3 horas</td>
                  <td>11-12 horas</td>
                  <td>13-14h</td>
                </tr>
                <tr>
                  <td>1-2 anos</td>
                  <td>1-2 horas</td>
                  <td>11-14 horas</td>
                  <td>12-14h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="sleep-section">
          <h2 className="sleep-section-title">⚠️ Regressões de Sono</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Fases comuns onde o padrão de sono pode ser interrompido por saltos de desenvolvimento.
          </p>
          
          <div className="regression-card">
            <div className="regression-title">Aos 4 Meses</div>
            <div className="regression-desc">
              O bebê passa a ter ciclos de sono mais parecidos com os dos adultos, acordando levemente entre eles. <br/>
              <strong>Dica:</strong> Ajude-o a aprender a adormecer sozinho, evite criar novas associações de sono.
            </div>
          </div>
          
          <div className="regression-card">
            <div className="regression-title">Aos 8-10 Meses</div>
            <div className="regression-desc">
              Pico da ansiedade de separação e marcos motores (engatinhar, ficar em pé). <br/>
              <strong>Dica:</strong> Dê muito conforto, mas mantenha a rotina. Pratique as novas habilidades durante o dia.
            </div>
          </div>
          
          <div className="regression-card">
            <div className="regression-title">Aos 12 Meses</div>
            <div className="regression-desc">
              Transição de sonecas e ansiedade. Pode parecer que ele quer largar uma soneca, mas resista por mais um tempo. <br/>
              <strong>Dica:</strong> Mantenha os horários. Se ele pular a soneca da manhã, antecipe um pouco a hora de dormir.
            </div>
          </div>
        </div>

        <div className="sleep-section">
          <h2 className="sleep-section-title">🏡 Ambiente Ideal</h2>
          
          <div className="env-tip">
            <div className="env-icon">🌡️</div>
            <div className="env-content">
              <div className="env-title">Temperatura do Quarto</div>
              <div className="env-desc">O ideal é manter o quarto entre 20°C e 22°C. O bebê dorme melhor em um ambiente ligeiramente fresco.</div>
            </div>
          </div>

          <div className="env-tip">
            <div className="env-icon">🌑</div>
            <div className="env-content">
              <div className="env-title">Escuridão</div>
              <div className="env-desc">Use cortinas blackout. Para os cochilos do dia, o quarto também deve ser escuro para estimular a produção de melatonina.</div>
            </div>
          </div>

          <div className="env-tip">
            <div className="env-icon">👕</div>
            <div className="env-content">
              <div className="env-title">Roupas Adequadas</div>
              <div className="env-desc">Vista o bebê com uma camada a mais do que você usaria. Evite cobertores soltos; prefira sacos de dormir para bebês (sleeping bags).</div>
            </div>
          </div>

          <div className="env-tip">
            <div className="env-icon">🎵</div>
            <div className="env-content">
              <div className="env-title">Ruído Branco</div>
              <div className="env-desc">Um aparelho de ruído branco constante ajuda a abafar sons da casa e reproduz o som do útero, acalmando o bebê.</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
