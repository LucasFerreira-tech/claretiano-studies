import { DISC } from '../utils'

const DAYS = ['Seg','Ter','Qua','Qui','Sex','Sáb']

// Blocos Pomodoro
// Pesada: 08:00–09:20 (25+5+25+5+20 = 80min relógio, 70min ativo)
// Leve:   17:00–17:50 (25+5+20 = 50min relógio, 45min ativo)

const SCHEDULE = [
  {
    time: '06:00',
    label: 'Academia (40min)',
    slots: ['Acad.', 'Acad.', 'Acad.', 'Acad.', 'Acad.', 'Acad.'],
  },
  {
    time: '08:00',
    label: 'Pesada · Pomodoro\n25+5+25+5+20',
    slots: ['SO', 'DPE', 'SO', 'DPE', 'SO', 'Revisão'],
  },
  {
    time: '09:20',
    label: 'Fim pesada',
    slots: [null, null, null, null, null, 'Revisão'],
  },
  {
    time: '11:00',
    label: 'Bíblico',
    slots: ['Bíblia', 'Bíblia', 'Bíblia', 'Bíblia', 'Bíblia', 'Portfólio'],
  },
  {
    time: '12:00',
    label: 'Programação (2h30)',
    slots: ['Prog.', 'Prog.', 'Prog.', 'Prog.', 'Prog.', null],
  },
  {
    time: '17:00',
    label: 'Leve · Pomodoro\n25+5+20',
    slots: ['ANT', 'AMT', 'ANT', 'AMT', null, null],
  },
  {
    time: '17:50',
    label: 'Fim leve',
    slots: [null, null, null, null, null, null],
  },
]

const SAB_REVISAO = [
  { disc: 'SO',  label: 'Sistemas Operacionais',       tempo: '30min' },
  { disc: 'DPE', label: 'Desenvolvimento Profissional', tempo: '30min' },
  { disc: 'ANT', label: 'Antropologia',                 tempo: '15min' },
  { disc: 'AMT', label: 'Aprendizagem Mediada',         tempo: '15min' },
]

function Block({ label }) {
  if (!label) return <div style={{ minHeight: 24 }} />
  const disc = DISC[label]
  if (disc) return (
    <div style={{ background: disc.bg, color: disc.color, borderRadius: 5, padding: '3px 7px', fontSize: 11, fontWeight: 600, width: '100%' }}>{label}</div>
  )
  const specials = {
    'Prog.':    { bg: 'rgba(52,211,153,0.1)',  color: '#34d399' },
    'Revisão':  { bg: 'rgba(192,132,252,0.1)', color: '#c084fc' },
    'Bíblia':   { bg: 'rgba(90,98,120,0.15)',  color: '#8b93a8' },
    'Portfólio':{ bg: 'rgba(192,132,252,0.1)', color: '#c084fc' },
    'Acad.':    { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c' },
  }
  const s = specials[label] || { bg: 'var(--bg3)', color: 'var(--text2)' }
  return (
    <div style={{ background: s.bg, color: s.color, borderRadius: 5, padding: '3px 7px', fontSize: 11, fontWeight: 500, width: '100%' }}>{label}</div>
  )
}

// Linhas que são apenas separadores de fim de bloco — exibir mais compactas
const DIVIDER_ROWS = ['09:20', '17:50']

export default function Semana() {
  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Semana</h1>
      <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20 }}>Grade semanal — a partir de 23/03/2026</p>

      {/* Grade principal */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6,1fr)', background: 'var(--bg3)' }}>
          <div style={{ padding: '10px 8px', fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Horário</div>
          {DAYS.map(d => (
            <div key={d} style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600, color: 'var(--text)', textAlign: 'center' }}>{d}</div>
          ))}
        </div>

        {SCHEDULE.map((row, ri) => {
          const isDivider = DIVIDER_ROWS.includes(row.time)
          return (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '90px repeat(6,1fr)', borderTop: '1px solid var(--border)', opacity: isDivider ? 0.5 : 1 }}>
              <div style={{ padding: isDivider ? '4px 8px' : '10px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{row.time}</div>
                {!isDivider && row.label.split('\n').map((l, i) => (
                  <div key={i} style={{ fontSize: 9, color: 'var(--text3)', marginTop: i === 0 ? 1 : 0 }}>{l}</div>
                ))}
              </div>
              {row.slots.map((slot, si) => (
                <div key={si} style={{ padding: isDivider ? '4px 6px' : '8px 6px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                  <Block label={slot} />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {Object.entries(DISC).map(([id, d]) => (
          <span key={id} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: d.bg, color: d.color }}>{id}</span>
        ))}
        {[
          { label: 'Programação',       c: '#34d399' },
          { label: 'Revisão acumulada', c: '#c084fc' },
          { label: 'Bíblico',           c: '#8b93a8' },
          { label: 'Academia',          c: '#fb923c' },
        ].map(x => (
          <span key={x.label} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--bg3)', color: x.c }}>{x.label}</span>
        ))}
      </div>

      {/* Pomodoro info */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontSize: 13 }}>🍅 Método Pomodoro</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>MANHÃ — matéria pesada (08:00–09:20)</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { label: '25min estudo', type: 'study' },
                { label: '5min pausa',   type: 'break' },
                { label: '25min estudo', type: 'study' },
                { label: '5min pausa',   type: 'break' },
                { label: '20min estudo', type: 'study' },
              ].map((b, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                  background: b.type === 'study' ? 'rgba(99,153,34,0.12)' : 'rgba(90,98,120,0.12)',
                  color:      b.type === 'study' ? '#639922'              : '#8b93a8',
                }}>{b.label}</span>
              ))}
              <span style={{ fontSize: 10, color: 'var(--text3)', alignSelf: 'center' }}>= 70min ativos · 80min relógio</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>TARDE — matéria leve (17:00–17:50)</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { label: '25min estudo', type: 'study' },
                { label: '5min pausa',   type: 'break' },
                { label: '20min estudo', type: 'study' },
              ].map((b, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                  background: b.type === 'study' ? 'rgba(99,153,34,0.12)' : 'rgba(90,98,120,0.12)',
                  color:      b.type === 'study' ? '#639922'              : '#8b93a8',
                }}>{b.label}</span>
              ))}
              <span style={{ fontSize: 10, color: 'var(--text3)', alignSelf: 'center' }}>= 45min ativos · 50min relógio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sábado revisão */}
      <div style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
        <div style={{ fontWeight: 600, color: '#c084fc', marginBottom: 8 }}>📚 Sábado — Revisão acumulada (08:00–09:30)</div>
        {SAB_REVISAO.map((item, i) => {
          const disc = DISC[item.disc]
          return (
            <div key={item.disc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < SAB_REVISAO.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: disc?.bg, color: disc?.color, borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{item.disc}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item.label} — revisão + exercícios</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{item.tempo}</span>
            </div>
          )
        })}
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, textAlign: 'right' }}>Total: 1h30 · tarde livre ✓</div>
      </div>

      {/* Programação */}
      <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
        <div style={{ fontWeight: 600, color: '#34d399', marginBottom: 4 }}>💻 Estudo de Programação</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
          Seg a Sex · 12:00–14:30 · <strong>2h30 por dia</strong> · 12h30/semana<br />
          Foco em carreira: lógica, JavaScript, projetos práticos
        </div>
      </div>

      {/* Projeção horas */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontSize: 13 }}>📊 Projeção de horas até 30/06</div>
        {[
          { disc: 'SO',  freq: '3×/sem · 70min ativos',  total: '~88h', meta: '90h' },
          { disc: 'DPE', freq: '3×/sem · 70min ativos',  total: '~88h', meta: '90h' },
          { disc: 'ANT', freq: '2×/sem · 45min ativos',  total: '+ C1/C2', meta: '30h' },
          { disc: 'AMT', freq: '2×/sem · 45min ativos',  total: '+ C1/C2', meta: '30h' },
        ].map((item, i, arr) => {
          const disc = DISC[item.disc]
          return (
            <div key={item.disc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: disc?.bg, color: disc?.color, borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{item.disc}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item.freq}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{item.total}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>meta: {item.meta}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
