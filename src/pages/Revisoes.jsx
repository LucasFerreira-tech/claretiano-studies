import { useState } from 'react'
import { useStore } from '../store/store'
import { TOPICS, CYCLES } from '../data/academicData'
import { DISC, fmtFull, addDays } from '../utils'

const DISC_NAMES = { SO:'Sistemas Operacionais', DPE:'Desenv. Profissional', AMT:'Aprendizagem Mediada', ANT:'Antropologia' }

// Dias de aula por matéria (0=Dom,1=Seg,2=Ter,3=Qua,4=Qui,5=Sex,6=Sáb)
const DISC_DAYS = {
  SO:  [1, 2, 4, 5],   // Seg, Ter, Qui, Sex
  DPE: [1, 3, 4, 5],   // Seg, Qua, Qui, Sex
  AMT: [3],             // Qua
  ANT: [2],             // Ter
}

// Dado uma data de estudo e uma matéria, retorna a Nth próxima aula dessa matéria
function nextClassDay(fromDate, discId, nthDay = 1) {
  const days = DISC_DAYS[discId] || [1,2,3,4,5]
  let d = new Date(fromDate)
  let count = 0
  for (let i = 1; i <= 60; i++) {
    d.setDate(d.getDate() + 1)
    if (days.includes(d.getDay())) {
      count++
      if (count === nthDay) return d.toISOString().split('T')[0]
    }
  }
  return addDays(fromDate, nthDay * 7)
}

// Retorna a próxima sexta ou sábado a partir de uma data
function nextWeekend(fromDate) {
  let d = new Date(fromDate)
  for (let i = 1; i <= 10; i++) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() === 5 || d.getDay() === 6) return d.toISOString().split('T')[0]
  }
  return addDays(fromDate, 5)
}

// Calcula as 3 datas de revisão: próxima aula (D+1 aula), 3ª aula, 30 dias corridos
function calcReviewDates(studyDate, discId) {
  return {
    d1:  nextClassDay(studyDate, discId, 1),
    d3:  nextClassDay(studyDate, discId, 3),
    d30: addDays(studyDate, 30),
  }
}

function getTopicLabel(key, activities) {
  // Atividades: "ativ-<id>-d1"
  if (key.startsWith('ativ-')) {
    const parts = key.split('-')
    const suffix = parts[parts.length - 1]
    const actId = parts.slice(1, parts.length - 1).join('-')
    const act = activities?.find(a => a.id === actId)
    const disc = act?.subject || 'ATI'
    return { cycleId: act?.cycle || 'Atividade', discId: disc, suffix, topic: act?.title || 'Revisão de atividade' }
  }
  // Tópicos: "C2-SO-3-d1"
  const parts = key.split('-')
  const suffix  = parts[parts.length - 1]
  const idx     = parseInt(parts[parts.length - 2])
  const discId  = parts[parts.length - 3]
  const cycleId = parts.slice(0, parts.length - 3).join('-')
  const topic   = TOPICS[cycleId]?.[discId]?.[idx] || key
  return { cycleId, discId, idx, suffix, topic }
}

const REVIEW_LABEL = {
  d1:  'Revisão 1 (próx. aula)',
  d3:  'Revisão 2 (3ª aula)',
  d30: 'Revisão 3 (30 dias)',
}

// Revisões de ciclo com estado editável
const CYCLE_REVIEWS_DEFAULT = [
  { id:'cr1',  label:'Revisão C1',                   date:'2026-03-09', done:true  },
  { id:'cr2',  label:'Revisão C1 + C2',              date:'2026-04-06', done:false },
  { id:'cr3',  label:'Revisão C1 + C2 + C3',         date:'2026-05-04', done:false },
  { id:'cr4',  label:'Revisão C1 + C2 + C3 + C4',   date:'2026-06-01', done:false },
  { id:'cr5',  label:'Revisão completa C1 → C5',     date:'2026-06-07', done:false },
]

export default function Revisoes() {
  const { reviews, markReview, studied, activities } = useStore()
  const today = new Date().toISOString().split('T')[0]

  // Estado local para revisões de ciclo (permite editar datas e marcar done)
  const [cycleReviews, setCycleReviews] = useState(CYCLE_REVIEWS_DEFAULT)
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState('')

  const due = Object.entries(reviews)
    .filter(([, v]) => !v.done && v.date <= today)
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = Object.entries(reviews)
    .filter(([, v]) => !v.done && v.date > today)
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const doneCount = Object.values(reviews).filter(v => v.done).length

  function toggleCycleDone(id) {
    setCycleReviews(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r))
  }

  function startEdit(r) {
    setEditingId(r.id)
    setEditDate(r.date)
  }

  function saveEdit(id) {
    if (editDate) setCycleReviews(prev => prev.map(r => r.id === id ? { ...r, date: editDate } : r))
    setEditingId(null)
  }

  // Agenda revisão do C1 para amanhã (reagendamento manual)
  function rescheduleC1() {
    setCycleReviews(prev => prev.map(r =>
      r.id === 'cr1' ? { ...r, date: '2026-03-14', done: false } : r
    ))
  }

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Revisões</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>
        Repetição espaçada: próx. aula · 3ª aula · 30 dias — baseado na sua grade semanal
      </p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { v: due.length,      l:'Pendentes hoje',     c: due.length > 0 ? '#f87171' : '#34d399' },
          { v: upcoming.length, l:'Próximas revisões',  c:'#fbbf24' },
          { v: doneCount,       l:'Concluídas',          c:'#34d399' },
        ].map((m, i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:700, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Pendentes hoje */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>
        Pendentes hoje
        {due.length > 0 && (
          <span style={{ background:'rgba(248,113,113,0.15)', color:'#f87171', padding:'1px 6px', borderRadius:20, marginLeft:6 }}>
            {due.length}
          </span>
        )}
      </p>

      {due.length === 0 ? (
        <div style={{ background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'20px', textAlign:'center', color:'#34d399', marginBottom:16 }}>
          ✓ Nenhuma revisão pendente hoje!
        </div>
      ) : (
        <div style={{ marginBottom:20 }}>
          {due.map(({ key }) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key, activities)
            const disc = DISC[discId] || { color:'#94a3b8', bg:'rgba(148,163,184,0.12)' }
            return (
              <div key={key} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:disc?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:disc?.color, flexShrink:0 }}>
                  {discId}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{cycleId} · {REVIEW_LABEL[suffix] || suffix}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => markReview(key, true)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', fontSize:11, cursor:'pointer' }}>
                    Difícil
                  </button>
                  <button onClick={() => markReview(key, false)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(52,211,153,0.3)', background:'rgba(52,211,153,0.08)', color:'#34d399', fontSize:11, cursor:'pointer' }}>
                    Feito ✓
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Próximas revisões de tópicos */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Próximas revisões de tópicos</p>
      {upcoming.length === 0 ? (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:13, marginBottom:20 }}>
          Marque tópicos como estudados na página de Ciclos para gerar revisões automáticas
        </div>
      ) : (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px', marginBottom:20 }}>
          {upcoming.map(({ key, date }, i) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key, activities)
            const disc = DISC[discId] || { color:'#94a3b8', bg:'rgba(148,163,184,0.12)' }
            return (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i < upcoming.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc?.bg, color:disc?.color, minWidth:28, textAlign:'center', flexShrink:0 }}>{discId}</span>
                <span style={{ fontSize:12, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</span>
                <span style={{ fontSize:10, color:'var(--text3)', flexShrink:0 }}>{REVIEW_LABEL[suffix]?.split(' ')[0] + ' ' + (REVIEW_LABEL[suffix]?.split(' ')[1] || '')}</span>
                <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', flexShrink:0 }}>{fmtFull(date)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Cronograma de revisões de ciclo */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:0 }}>
          Cronograma de revisões de ciclo
        </p>
        <button
          onClick={rescheduleC1}
          style={{ fontSize:10, padding:'3px 10px', borderRadius:6, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', cursor:'pointer' }}
        >
          ↻ Reagendar C1 → 14/03
        </button>
      </div>

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
        {cycleReviews.map((r, i, arr) => (
          <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={r.done}
              onChange={() => toggleCycleDone(r.id)}
              style={{ cursor:'pointer', accentColor:'var(--accent)', flexShrink:0 }}
            />
            <span style={{ fontSize:12, flex:1, color: r.done ? 'var(--text3)' : 'var(--text)', textDecoration: r.done ? 'line-through' : 'none' }}>
              {r.label}
            </span>

            {/* Data — clicável para editar */}
            {editingId === r.id ? (
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:5, padding:'2px 6px', fontSize:11, color:'var(--text)', outline:'none' }}
                />
                <button
                  onClick={() => saveEdit(r.id)}
                  style={{ fontSize:10, padding:'2px 8px', borderRadius:5, border:'none', background:'var(--accent)', color:'#fff', cursor:'pointer' }}
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(r)}
                title="Clique para editar a data"
                style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)', padding:'2px 4px', borderRadius:4 }}
              >
                {fmtFull(r.date)} ✎
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Legenda da lógica de revisão */}
      <div style={{ marginTop:16, background:'rgba(79,142,247,0.06)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:10, padding:'12px 16px' }}>
        <div style={{ fontWeight:600, color:'#4f8ef7', marginBottom:6, fontSize:12 }}>📅 Como as revisões são calculadas</div>
        <div style={{ fontSize:11, color:'var(--text2)', lineHeight:1.9 }}>
          Quando você marca um tópico como estudado, o sistema agenda automaticamente:<br/>
          <strong style={{ color:'var(--text)' }}>Revisão 1</strong> → próximo dia de aula daquela matéria<br/>
          <strong style={{ color:'var(--text)' }}>Revisão 2</strong> → 3ª aula daquela matéria após o estudo<br/>
          <strong style={{ color:'var(--text)' }}>Revisão 3</strong> → 30 dias após o estudo (revisão de longo prazo)<br/>
          Se marcar como <strong style={{ color:'#fbbf24' }}>Difícil</strong>, a revisão é reagendada para o próximo dia.
        </div>
      </div>
    </div>
  )
}
