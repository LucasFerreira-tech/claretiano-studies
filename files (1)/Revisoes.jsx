import { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import { TOPICS, CYCLES } from '../data/academicData'
import { DISC, fmtFull, addDays } from '../utils'

const REVIEW_LABEL = { d1:'Revisão 1', d3:'Revisão 2', d30:'Revisão 3 · 30d' }
const CYCLE_REVIEWS_DEFAULT = [
  { id:'cr1', label:'Revisão C1',               date:'2026-03-09', done:true  },
  { id:'cr2', label:'Revisão C1 + C2',           date:'2026-04-06', done:false },
  { id:'cr3', label:'Revisão C1 + C2 + C3',      date:'2026-05-04', done:false },
  { id:'cr4', label:'Revisão C1–C4',             date:'2026-06-01', done:false },
  { id:'cr5', label:'Revisão completa C1–C5',    date:'2026-06-07', done:false },
]

function getTopicLabel(key) {
  const parts = key.split('-')
  const suffix  = parts[parts.length - 1]
  const idx     = parseInt(parts[parts.length - 2])
  const discId  = parts[parts.length - 3]
  const cycleId = parts.slice(0, parts.length - 3).join('-')
  const topic   = TOPICS[cycleId]?.[discId]?.[idx] || key
  return { cycleId, discId, suffix, topic }
}

function ReviewCard({ item, onDone, onHard }) {
  const { cycleId, discId, suffix, topic } = getTopicLabel(item.key)
  const disc = DISC[discId]
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:'14px', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:disc?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:disc?.color, flexShrink:0 }}>
          {discId}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, lineHeight:1.3 }}>{topic}</div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{cycleId} · {REVIEW_LABEL[suffix] || suffix}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onHard} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', fontSize:12, fontWeight:600 }}>
          😅 Difícil
        </button>
        <button onClick={onDone} style={{ flex:2, padding:'10px', borderRadius:10, border:'none', background:'rgba(52,211,153,0.15)', color:'#34d399', fontSize:12, fontWeight:700 }}>
          ✓ Concluída
        </button>
      </div>
    </div>
  )
}

function MobileRevisoes() {
  const { reviews, markReview } = useStore()
  const today = new Date().toISOString().split('T')[0]
  const [cycleReviews, setCycleReviews] = useState(CYCLE_REVIEWS_DEFAULT)
  const [tab, setTab] = useState('pendentes')
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState('')

  const due = Object.entries(reviews).filter(([,v]) => !v.done && v.date <= today).map(([k,v]) => ({ key:k, ...v })).sort((a,b) => a.date.localeCompare(b.date))
  const upcoming = Object.entries(reviews).filter(([,v]) => !v.done && v.date > today).map(([k,v]) => ({ key:k, ...v })).sort((a,b) => a.date.localeCompare(b.date))
  const doneCount = Object.values(reviews).filter(v => v.done).length

  return (
    <div className="m-page">
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.03em', marginBottom:4 }}>Revisões</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:16 }}>Próx. aula · 3ª aula · 30 dias</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:18 }}>
        {[
          { v:due.length,      l:'Hoje',     c: due.length>0?'#f87171':'#34d399', bg: due.length>0?'rgba(248,113,113,0.1)':'rgba(52,211,153,0.1)' },
          { v:upcoming.length, l:'Próximas', c:'#fbbf24', bg:'rgba(251,191,36,0.1)' },
          { v:doneCount,       l:'Feitas',   c:'#34d399', bg:'rgba(52,211,153,0.1)' },
        ].map((m,i) => (
          <div key={i} style={{ background:m.bg, borderRadius:12, padding:'12px 8px', textAlign:'center' }}>
            <div style={{ fontSize:26, fontWeight:800, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:2, fontWeight:600 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16, background:'var(--bg2)', borderRadius:12, padding:4 }}>
        {[['pendentes','Pendentes'], ['proximas','Próximas'], ['ciclos','Ciclos']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex:1, padding:'8px', borderRadius:9, fontSize:12, fontWeight:700, border:'none',
            background: tab===k ? 'var(--bg4)' : 'transparent',
            color: tab===k ? 'var(--text)' : 'var(--text3)',
            transition:'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {tab === 'pendentes' && (
        due.length === 0
          ? <div style={{ background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:14, padding:'28px', textAlign:'center', color:'#34d399', fontSize:15, fontWeight:600 }}>
              ✓ Nenhuma pendente hoje!
            </div>
          : due.map(item => (
              <ReviewCard key={item.key} item={item} onDone={() => markReview(item.key, false)} onHard={() => markReview(item.key, true)} />
            ))
      )}

      {tab === 'proximas' && (
        upcoming.length === 0
          ? <div className="m-card" style={{ padding:'24px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>
              Estude tópicos nos Ciclos para gerar revisões
            </div>
          : <div className="m-card" style={{ padding:'4px 14px' }}>
              {upcoming.map(({ key, date }, i) => {
                const { cycleId, discId, suffix, topic } = getTopicLabel(key)
                const disc = DISC[discId]
                return (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0', borderBottom: i<upcoming.length-1?'1px solid var(--border)':'none' }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:disc?.bg, color:disc?.color, flexShrink:0 }}>{discId}</span>
                    <span style={{ fontSize:13, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</span>
                    <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', flexShrink:0 }}>{fmtFull(date)}</span>
                  </div>
                )
              })}
            </div>
      )}

      {tab === 'ciclos' && (
        <div>
          <button onClick={() => setCycleReviews(prev => prev.map(r => r.id==='cr1' ? {...r, date:'2026-03-14', done:false} : r))}
            style={{ width:'100%', padding:'10px', borderRadius:10, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', fontSize:12, fontWeight:600, marginBottom:12 }}>
            ↻ Reagendar Revisão C1 → 14/03
          </button>
          <div className="m-card" style={{ padding:'4px 14px' }}>
            {cycleReviews.map((r, i, arr) => (
              <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
                <div onClick={() => setCycleReviews(prev => prev.map(x => x.id===r.id ? {...x, done:!x.done} : x))}
                  className="m-touchable"
                  style={{ width:22, height:22, borderRadius:6, flexShrink:0, border: r.done?'none':'2px solid var(--border2)', background: r.done?'#34d399':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {r.done && <span style={{ color:'#0a0d14', fontSize:11, fontWeight:800 }}>✓</span>}
                </div>
                <span style={{ fontSize:13, flex:1, color: r.done?'var(--text3)':'var(--text)', textDecoration: r.done?'line-through':'none' }}>{r.label}</span>
                {editingId === r.id
                  ? <div style={{ display:'flex', gap:4 }}>
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                        style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:6, padding:'3px 6px', fontSize:11, color:'var(--text)', outline:'none', width:120 }} />
                      <button onClick={() => { setCycleReviews(prev => prev.map(x => x.id===r.id?{...x,date:editDate}:x)); setEditingId(null) }}
                        style={{ padding:'3px 8px', borderRadius:6, border:'none', background:'var(--accent)', color:'#fff', fontSize:11, fontWeight:600 }}>OK</button>
                    </div>
                  : <button onClick={() => { setEditingId(r.id); setEditDate(r.date) }}
                      style={{ background:'transparent', border:'none', color:'var(--text3)', fontSize:11, fontFamily:'var(--mono)', cursor:'pointer' }}>
                      {fmtFull(r.date)} ✎
                    </button>
                }
              </div>
            ))}
          </div>

          {/* Legenda */}
          <div style={{ marginTop:14, background:'rgba(79,142,247,0.06)', border:'1px solid rgba(79,142,247,0.15)', borderRadius:12, padding:'12px 14px' }}>
            <div style={{ fontWeight:700, color:'#4f8ef7', marginBottom:6, fontSize:12 }}>📅 Como funciona</div>
            <div style={{ fontSize:11, color:'var(--text2)', lineHeight:1.8 }}>
              <strong style={{color:'var(--text)'}}>Rev. 1</strong> → próx. dia de aula<br/>
              <strong style={{color:'var(--text)'}}>Rev. 2</strong> → 3ª aula após o estudo<br/>
              <strong style={{color:'var(--text)'}}>Rev. 3</strong> → 30 dias depois
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DesktopRevisoes() {
  const { reviews, markReview } = useStore()
  const today = new Date().toISOString().split('T')[0]
  const [cycleReviews, setCycleReviews] = useState(CYCLE_REVIEWS_DEFAULT)
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState('')

  const due = Object.entries(reviews).filter(([,v]) => !v.done && v.date <= today).map(([k,v]) => ({ key:k, ...v })).sort((a,b) => a.date.localeCompare(b.date))
  const upcoming = Object.entries(reviews).filter(([,v]) => !v.done && v.date > today).map(([k,v]) => ({ key:k, ...v })).sort((a,b) => a.date.localeCompare(b.date))
  const doneCount = Object.values(reviews).filter(v => v.done).length

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Revisões</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Repetição espaçada: próx. aula · 3ª aula · 30 dias — baseado na sua grade semanal</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { v:due.length, l:'Pendentes hoje', c: due.length>0?'#f87171':'#34d399' },
          { v:upcoming.length, l:'Próximas revisões', c:'#fbbf24' },
          { v:doneCount, l:'Concluídas', c:'#34d399' },
        ].map((m,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:700, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{m.l}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>
        Pendentes hoje {due.length>0 && <span style={{ background:'rgba(248,113,113,0.15)', color:'#f87171', padding:'1px 6px', borderRadius:20, marginLeft:6 }}>{due.length}</span>}
      </p>
      {due.length===0 ? (
        <div style={{ background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'20px', textAlign:'center', color:'#34d399', marginBottom:16 }}>✓ Nenhuma revisão pendente hoje!</div>
      ) : (
        <div style={{ marginBottom:20 }}>
          {due.map(({ key }) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key)
            const disc = DISC[discId]
            return (
              <div key={key} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:disc?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:disc?.color, flexShrink:0 }}>{discId}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{cycleId} · {REVIEW_LABEL[suffix]||suffix}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => markReview(key, true)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', fontSize:11, cursor:'pointer' }}>Difícil</button>
                  <button onClick={() => markReview(key, false)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(52,211,153,0.3)', background:'rgba(52,211,153,0.08)', color:'#34d399', fontSize:11, cursor:'pointer' }}>Feito ✓</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Próximas revisões</p>
      {upcoming.length===0 ? (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:13, marginBottom:20 }}>Estude tópicos nos Ciclos para gerar revisões automáticas</div>
      ) : (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px', marginBottom:20 }}>
          {upcoming.map(({ key, date }, i) => {
            const { cycleId, discId, suffix, topic } = getTopicLabel(key)
            const disc = DISC[discId]
            return (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<upcoming.length-1?'1px solid var(--border)':'none' }}>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc?.bg, color:disc?.color, minWidth:28, textAlign:'center', flexShrink:0 }}>{discId}</span>
                <span style={{ fontSize:12, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{topic}</span>
                <span style={{ fontSize:11, color:'var(--text2)', fontFamily:'var(--mono)', flexShrink:0 }}>{fmtFull(date)}</span>
              </div>
            )
          })}
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:0 }}>Cronograma de revisões de ciclo</p>
        <button onClick={() => setCycleReviews(prev => prev.map(r => r.id==='cr1'?{...r,date:'2026-03-14',done:false}:r))}
          style={{ fontSize:10, padding:'3px 10px', borderRadius:6, border:'1px solid rgba(251,191,36,0.3)', background:'rgba(251,191,36,0.08)', color:'#fbbf24', cursor:'pointer' }}>↻ Reagendar C1 → 14/03</button>
      </div>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
        {cycleReviews.map((r, i, arr) => (
          <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
            <input type="checkbox" checked={r.done} onChange={() => setCycleReviews(prev => prev.map(x => x.id===r.id?{...x,done:!x.done}:x))} style={{ cursor:'pointer', accentColor:'var(--accent)', flexShrink:0 }} />
            <span style={{ fontSize:12, flex:1, color: r.done?'var(--text3)':'var(--text)', textDecoration: r.done?'line-through':'none' }}>{r.label}</span>
            {editingId===r.id
              ? <div style={{ display:'flex', gap:4 }}>
                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:5, padding:'2px 6px', fontSize:11, color:'var(--text)', outline:'none' }} />
                  <button onClick={() => { setCycleReviews(prev => prev.map(x => x.id===r.id?{...x,date:editDate}:x)); setEditingId(null) }} style={{ fontSize:10, padding:'2px 8px', borderRadius:5, border:'none', background:'var(--accent)', color:'#fff', cursor:'pointer' }}>OK</button>
                </div>
              : <button onClick={() => { setEditingId(r.id); setEditDate(r.date) }} style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)', padding:'2px 4px', borderRadius:4 }}>{fmtFull(r.date)} ✎</button>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Revisoes() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile ? <MobileRevisoes /> : <DesktopRevisoes />
}
