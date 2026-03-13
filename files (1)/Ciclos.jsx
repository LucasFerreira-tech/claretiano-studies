import { useState, useEffect } from 'react'
import { CYCLES, TOPICS } from '../data/academicData'
import { DISC, daysUntil, fmtFull, daysColor } from '../utils'
import { useStore } from '../store/store'

const DISC_LIST = ['SO','DPE','AMT','ANT']
const DISC_NAMES = { SO:'Sistemas Operacionais', DPE:'Desenv. Profissional', AMT:'Aprendizagem Mediada', ANT:'Antropologia' }

function DesktopCiclos() {
  const [active, setActive] = useState('C2')
  const { toggleStudied, studied } = useStore()
  const cycle = CYCLES.find(c => c.id === active)
  const topics = TOPICS[active] || {}
  const days = daysUntil(cycle?.questionsDeadline)

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Ciclos</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Tópicos por disciplina — marque ao estudar para agendar revisões automáticas</p>
      <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
        {CYCLES.map(c => {
          const isActive = c.id === active
          const colors = { completed:'var(--text3)', active:'var(--accent)', upcoming:'var(--text2)' }
          return (
            <button key={c.id} onClick={() => setActive(c.id)} style={{
              padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600,
              border: isActive ? 'none' : '1px solid var(--border)',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : colors[c.status],
              cursor:'pointer', transition:'all 0.15s',
            }}>
              {c.label}{c.status==='completed' && ' ✓'}{c.status==='active' && ' ●'}
            </button>
          )
        })}
      </div>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:20, flexWrap:'wrap' }}>
        <div><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>PERÍODO</div><div style={{ fontSize:13, fontWeight:500 }}>{fmtFull(cycle?.start)} → {fmtFull(cycle?.end)}</div></div>
        {cycle?.questionsDeadline && (
          <div>
            <div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>QUESTÕES ONLINE</div>
            <div style={{ fontSize:13, fontWeight:500, color:daysColor(days) }}>{fmtFull(cycle.questionsDeadline)} {days !== null && `(${days > 0 ? days+'d' : 'Expirado'})`}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>STATUS</div>
          <div style={{ fontSize:13, fontWeight:600, color: cycle?.status==='completed'?'var(--green)': cycle?.status==='active'?'var(--accent)':'var(--text2)' }}>
            {cycle?.status==='completed' ? '✓ Concluído' : cycle?.status==='active' ? '● Em andamento' : '○ Próximo'}
          </div>
        </div>
      </div>
      {active === 'C1' && (
        <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#fbbf24' }}>
          ⚠ Ciclo 1 concluído — faça a revisão completa. <strong>Questões Online vencem em 05/04/2026!</strong>
        </div>
      )}
      {cycle?.status === 'upcoming' ? (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'20px', textAlign:'center', color:'var(--text3)' }}>
          Este ciclo começa em {fmtFull(cycle.start)}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {DISC_LIST.map(discId => {
            const disc = DISC[discId]
            const list = topics[discId] || []
            const studiedCount = list.filter((_,i) => studied[`${active}-${discId}-${i}`]).length
            return (
              <div key={discId} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20, background:disc.bg, color:disc.color }}>{discId}</span>
                    <span style={{ fontSize:12, fontWeight:600 }}>{DISC_NAMES[discId]}</span>
                  </div>
                  <span style={{ fontSize:11, color:'var(--text3)' }}>{studiedCount}/{list.length}</span>
                </div>
                <div style={{ background:'var(--bg4)', borderRadius:99, height:3, marginBottom:10 }}>
                  <div style={{ width: list.length ? `${studiedCount/list.length*100}%`:'0%', height:'100%', background:disc.color, borderRadius:99, transition:'width 0.3s' }} />
                </div>
                {list.map((topic, i) => {
                  const key = `${active}-${discId}-${i}`
                  const done = !!studied[key]
                  return (
                    <div key={i} onClick={() => toggleStudied(key)} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom: i<list.length-1 ? '1px solid var(--border)':'none', cursor:'pointer' }}>
                      <div style={{ width:16, height:16, borderRadius:4, flexShrink:0, border: done ? 'none' : '1.5px solid var(--border2)', background: done ? 'var(--green)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                        {done && <span style={{ color:'#0f1117', fontSize:10, fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:12, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through':'none' }}>{topic}</span>
                      {done && <span style={{ fontSize:9, color:'var(--green)', marginLeft:'auto', flexShrink:0 }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MobileCiclos() {
  const [active, setActive] = useState('C2')
  const [activeDisc, setActiveDisc] = useState('SO')
  const { toggleStudied, studied } = useStore()
  const cycle = CYCLES.find(c => c.id === active)
  const topics = TOPICS[active] || {}
  const days = daysUntil(cycle?.questionsDeadline)
  const disc = DISC[activeDisc]
  const list = topics[activeDisc] || []
  const studiedCount = list.filter((_,i) => studied[`${active}-${activeDisc}-${i}`]).length

  return (
    <div className="m-page">
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.03em', marginBottom:4 }}>Ciclos</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:16 }}>Marque ao estudar para agendar revisões</p>

      {/* Cycle tabs */}
      <div className="m-hscroll" style={{ marginBottom:14 }}>
        <div style={{ display:'flex', gap:6, paddingBottom:4, width:'max-content' }}>
          {CYCLES.map(c => {
            const isA = c.id === active
            const colors = { completed:'var(--text3)', active:'var(--accent)', upcoming:'var(--text2)' }
            return (
              <button key={c.id} onClick={() => setActive(c.id)} className="m-touchable" style={{
                padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:700,
                border: isA ? 'none' : '1px solid var(--border)',
                background: isA ? 'var(--accent)' : 'var(--bg2)',
                color: isA ? '#fff' : colors[c.status],
                whiteSpace:'nowrap',
              }}>
                {c.label}{c.status==='completed'&&' ✓'}{c.status==='active'&&' ●'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cycle info card */}
      <div className="m-card" style={{ padding:'12px 14px', marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:2 }}>Período</div>
            <div style={{ fontSize:13, fontWeight:600 }}>{fmtFull(cycle?.start)} → {fmtFull(cycle?.end)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:2 }}>Status</div>
            <div style={{ fontSize:13, fontWeight:700, color: cycle?.status==='completed'?'#34d399': cycle?.status==='active'?'var(--accent)':'var(--text2)' }}>
              {cycle?.status==='completed'?'✓ Concluído':cycle?.status==='active'?'● Ativo':'○ Próximo'}
            </div>
          </div>
        </div>
        {cycle?.questionsDeadline && (
          <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid var(--border)', fontSize:12, color:daysColor(days) }}>
            📝 Questões online: {fmtFull(cycle.questionsDeadline)} {days !== null && `(${days > 0 ? days+'d' : 'Expirado'})`}
          </div>
        )}
      </div>

      {active === 'C1' && (
        <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#fbbf24' }}>
          ⚠ Questões Online vencem em 05/04/2026!
        </div>
      )}

      {cycle?.status === 'upcoming' ? (
        <div className="m-card" style={{ padding:'24px', textAlign:'center', color:'var(--text3)' }}>
          Começa em {fmtFull(cycle.start)}
        </div>
      ) : (
        <>
          {/* Discipline tabs */}
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {DISC_LIST.map(d => {
              const dStyle = DISC[d]
              const isA = d === activeDisc
              const dList = topics[d] || []
              const cnt = dList.filter((_,i) => studied[`${active}-${d}-${i}`]).length
              return (
                <button key={d} onClick={() => setActiveDisc(d)} className="m-touchable" style={{
                  flex:1, padding:'8px 4px', borderRadius:10, fontSize:11, fontWeight:700,
                  border: isA ? `1.5px solid ${dStyle.color}` : '1px solid var(--border)',
                  background: isA ? dStyle.bg : 'var(--bg2)',
                  color: isA ? dStyle.color : 'var(--text3)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                }}>
                  <span>{d}</span>
                  <span style={{ fontSize:9, fontWeight:600, opacity:0.8 }}>{cnt}/{dList.length}</span>
                </button>
              )
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:12, color:'var(--text2)', fontWeight:600 }}>{DISC_NAMES[activeDisc]}</span>
              <span style={{ fontSize:12, fontWeight:700, color:disc.color }}>{studiedCount}/{list.length}</span>
            </div>
            <div style={{ background:'var(--bg4)', borderRadius:99, height:6 }}>
              <div style={{ width: list.length ? `${studiedCount/list.length*100}%`:'0%', height:'100%', background:disc.color, borderRadius:99, transition:'width 0.4s' }} />
            </div>
          </div>

          {/* Topics list */}
          <div className="m-card" style={{ padding:'4px 14px' }}>
            {list.map((topic, i) => {
              const key = `${active}-${activeDisc}-${i}`
              const done = !!studied[key]
              return (
                <div key={i} onClick={() => toggleStudied(key)} className="m-touchable" style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'13px 0',
                  borderBottom: i < list.length-1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width:22, height:22, borderRadius:6, flexShrink:0,
                    border: done ? 'none' : `2px solid var(--border2)`,
                    background: done ? '#34d399' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.15s',
                  }}>
                    {done && <span style={{ color:'#0a0d14', fontSize:12, fontWeight:800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:13, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through':'none', flex:1, lineHeight:1.4 }}>{topic}</span>
                  {done && <span style={{ fontSize:10, color:'#34d399', flexShrink:0 }}>Rev. ✓</span>}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function Ciclos() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile ? <MobileCiclos /> : <DesktopCiclos />
}
