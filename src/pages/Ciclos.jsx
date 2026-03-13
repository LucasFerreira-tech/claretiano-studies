import { useState } from 'react'
import { CYCLES, TOPICS } from '../data/academicData'
import { DISC, daysUntil, fmtFull, daysColor } from '../utils'
import { useStore } from '../store/store'

const DISC_LIST = ['SO','DPE','AMT','ANT']

export default function Ciclos() {
  const [active, setActive] = useState('C2')
  const { toggleStudied, studied } = useStore()

  const cycle = CYCLES.find(c => c.id === active)
  const topics = TOPICS[active] || {}
  const days = daysUntil(cycle?.questionsDeadline)

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Ciclos</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Tópicos por disciplina — marque ao estudar para agendar revisões automáticas</p>

      {/* Tabs */}
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
              {c.label}
              {c.status==='completed' && ' ✓'}
              {c.status==='active' && ' ●'}
            </button>
          )
        })}
      </div>

      {/* Cycle info */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:20, flexWrap:'wrap' }}>
        <div><div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>PERÍODO</div><div style={{ fontSize:13, fontWeight:500 }}>{fmtFull(cycle?.start)} → {fmtFull(cycle?.end)}</div></div>
        {cycle?.questionsDeadline && (
          <div>
            <div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>QUESTÕES ONLINE</div>
            <div style={{ fontSize:13, fontWeight:500, color:daysColor(days) }}>
              {fmtFull(cycle.questionsDeadline)} {days !== null && `(${days > 0 ? days+'d' : 'Expirado'})`}
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize:10, color:'var(--text3)', marginBottom:2 }}>STATUS</div>
          <div style={{ fontSize:13, fontWeight:600, color: cycle?.status==='completed'?'var(--green)': cycle?.status==='active'?'var(--accent)':'var(--text2)' }}>
            {cycle?.status==='completed' ? '✓ Concluído' : cycle?.status==='active' ? '● Em andamento' : '○ Próximo'}
          </div>
        </div>
      </div>

      {/* Alert for C1 */}
      {active === 'C1' && (
        <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#fbbf24' }}>
          ⚠ Ciclo 1 concluído — faça a revisão completa. <strong>Questões Online vencem em 05/04/2026!</strong>
        </div>
      )}

      {/* Topics */}
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
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>{discId === 'SO' ? 'Sistemas Operacionais' : discId === 'DPE' ? 'Desenv. Profissional' : discId === 'AMT' ? 'Aprendizagem Mediada' : 'Antropologia'}</span>
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
                    <div key={i} onClick={() => toggleStudied(key)} style={{
                      display:'flex', alignItems:'center', gap:10, padding:'7px 0',
                      borderBottom: i<list.length-1 ? '1px solid var(--border)':'none',
                      cursor:'pointer',
                    }}>
                      <div style={{
                        width:16, height:16, borderRadius:4, flexShrink:0,
                        border: done ? 'none' : '1.5px solid var(--border2)',
                        background: done ? 'var(--green)' : 'transparent',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        transition:'all 0.15s',
                      }}>
                        {done && <span style={{ color:'#0f1117', fontSize:10, fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:12, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through':'none', transition:'all 0.15s' }}>{topic}</span>
                      {done && <span style={{ fontSize:9, color:'var(--green)', marginLeft:'auto', flexShrink:0 }}>D1·D3·D7·D30 ✓</span>}
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
