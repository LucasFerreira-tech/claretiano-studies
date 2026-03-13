import { useStore } from '../store/store'
import { TOPICS, CYCLES } from '../data/academicData'
import { DISC, fmtFull } from '../utils'

const DISC_NAMES = { SO:'Sistemas Operacionais', DPE:'Desenv. Profissional', AMT:'Aprendizagem Mediada', ANT:'Antropologia' }
const REVIEW_LABELS = { d1:'D+1', d3:'D+3', d7:'D+7', d30:'D+30' }

function getTopicLabel(key) {
  // key format: "C2-SO-3-d7"
  const parts = key.split('-')
  const suffix = parts[parts.length - 1] // d1, d3, d7, d30
  const idx = parseInt(parts[parts.length - 2])
  const discId = parts[parts.length - 3]
  const cycleId = parts.slice(0, parts.length - 3).join('-')
  const topic = TOPICS[cycleId]?.[discId]?.[idx] || key
  return { cycleId, discId, idx, suffix, topic }
}

export default function Revisoes() {
  const { reviews, markReview, studied } = useStore()
  const today = new Date().toISOString().split('T')[0]

  const due = Object.entries(reviews)
    .filter(([,v]) => !v.done && v.date <= today)
    .map(([k,v]) => ({ key:k, ...v }))
    .sort((a,b) => a.date.localeCompare(b.date))

  const upcoming = Object.entries(reviews)
    .filter(([,v]) => !v.done && v.date > today)
    .map(([k,v]) => ({ key:k, ...v }))
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  const done = Object.entries(reviews)
    .filter(([,v]) => v.done).length

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Revisões</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Sistema de repetição espaçada — D+1 · D+3 · D+7 · D+30</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { v: due.length,      l:'Revisões pendentes', c: due.length > 0 ? 'var(--red)' : 'var(--green)' },
          { v: upcoming.length, l:'Próximas revisões',  c:'var(--amber)' },
          { v: done,            l:'Revisões concluídas', c:'var(--green)' },
        ].map((m,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:700, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Due now */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>
        Pendentes hoje {due.length > 0 && <span style={{ background:'var(--red-bg)', color:'var(--red)', padding:'1px 6px', borderRadius:20, marginLeft:6 }}>{due.length}</span>}
      </p>

      {due.length === 0 ? (
        <div style={{ background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'20px', textAlign:'center', color:'var(--green)', marginBottom:16 }}>
          ✓ Nenhuma revisão pendente hoje!
        </div>
      ) : (
        <div style={{ marginBottom:20 }}>
          {due.map(({ key }) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key)
            const disc = DISC[discId]
            return (
              <div key={key} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:disc?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:disc?.color, flexShrink:0 }}>
                  {discId}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{cycleId} · Revisão {REVIEW_LABELS[suffix] || suffix}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => markReview(key, true)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'var(--amber)', fontSize:11, cursor:'pointer' }}>
                    Difícil
                  </button>
                  <button onClick={() => markReview(key, false)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(52,211,153,0.3)', background:'rgba(52,211,153,0.08)', color:'var(--green)', fontSize:11, cursor:'pointer' }}>
                    Feito ✓
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Próximas revisões</p>
      {upcoming.length === 0 ? (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>
          Estude tópicos nos Ciclos para agendar revisões automáticas
        </div>
      ) : (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
          {upcoming.map(({ key, date }, i) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key)
            const disc = DISC[discId]
            return (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<upcoming.length-1?'1px solid var(--border)':'none' }}>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc?.bg, color:disc?.color, minWidth:28, textAlign:'center' }}>{discId}</span>
                <span style={{ fontSize:12, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</span>
                <span style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--mono)', flexShrink:0 }}>{REVIEW_LABELS[suffix]}</span>
                <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', flexShrink:0 }}>{fmtFull(date)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Cycle reviews */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'20px 0 8px' }}>Revisões de ciclo programadas</p>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
        {[
          { label:'Revisão C1', date:'09/03', done:true },
          { label:'Revisão C1 + C2', date:'06/04', done:false },
          { label:'Revisão C1 + C2 + C3', date:'04/05', done:false },
          { label:'Revisão C1 + C2 + C3 + C4', date:'01/06', done:false },
          { label:'Revisão completa C1 → C5', date:'07/06', done:false },
        ].map((r,i,arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: r.done ? 'var(--green)' : 'var(--bg4)', border: r.done ? 'none' : '2px solid var(--border2)', flexShrink:0 }} />
            <span style={{ fontSize:12, flex:1, color: r.done ? 'var(--text3)' : 'var(--text)', textDecoration: r.done ? 'line-through':'none' }}>{r.label}</span>
            <span style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)' }}>{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
