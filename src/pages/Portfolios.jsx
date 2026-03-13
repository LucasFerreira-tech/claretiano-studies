import { PORTFOLIOS } from '../data/academicData'
import { DISC, daysUntil, fmtFull, daysColor } from '../utils'
import { useStore } from '../store/store'

export default function Portfolios() {
  const { toggleMilestone, milestones, getMilestoneProgress } = useStore()

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Portfólios</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>5 trabalhos no semestre — marque os milestones ao concluir</p>

      {PORTFOLIOS.map(p => {
        const disc = DISC[p.discipline]
        const days = daysUntil(p.deadline)
        const pct = getMilestoneProgress(p.id, p.milestones.length)
        const today = new Date().toISOString().split('T')[0]

        return (
          <div key={p.id} style={{ background:'var(--bg2)', border:`1px solid ${pct === 100 ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`, borderRadius:10, padding:'16px', marginBottom:12 }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20, background:disc.bg, color:disc.color }}>{p.discipline}</span>
                  <span style={{ fontSize:14, fontWeight:600 }}>{p.title}</span>
                </div>
                <div style={{ fontSize:11, color:'var(--text3)' }}>
                  Ciclos: {p.cycles.join(' + ')} &nbsp;·&nbsp; Início: {fmtFull(p.periodStart)}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                <div style={{ fontSize:11, color:'var(--text3)' }}>Prazo</div>
                <div style={{ fontSize:14, fontWeight:700, color:daysColor(days) }}>{fmtFull(p.deadline)}</div>
                <div style={{ fontSize:11, color:daysColor(days) }}>{days < 0 ? 'Expirado' : days === 0 ? 'Hoje!' : `${days} dias`}</div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ flex:1, background:'var(--bg4)', borderRadius:99, height:6 }}>
                <div style={{ width:`${pct}%`, height:'100%', background: pct===100 ? 'var(--green)' : disc.color, borderRadius:99, transition:'width 0.4s' }} />
              </div>
              <span style={{ fontSize:12, color: pct===100 ? 'var(--green)' : 'var(--text3)', fontWeight:600, minWidth:32 }}>{pct}%</span>
            </div>

            {/* Milestones */}
            <div>
              {p.milestones.map((ms, i) => {
                const key = `${p.id}-${i}`
                const done = !!milestones[key]
                const isPast = ms.date <= today
                return (
                  <div key={i} onClick={() => toggleMilestone(key)} style={{
                    display:'flex', alignItems:'center', gap:10, padding:'6px 0',
                    borderBottom: i < p.milestones.length-1 ? '1px solid var(--border)' : 'none',
                    cursor:'pointer',
                  }}>
                    <div style={{
                      width:10, height:10, borderRadius:'50%', flexShrink:0,
                      background: done ? 'var(--green)' : isPast ? 'var(--amber)' : 'var(--bg4)',
                      border: done ? 'none' : `2px solid ${isPast ? 'var(--amber)' : 'var(--border2)'}`,
                      transition:'all 0.15s',
                    }} />
                    <span style={{ fontSize:11, color:'var(--text3)', minWidth:42, fontFamily:'var(--mono)' }}>{fmtFull(ms.date)}</span>
                    <span style={{ fontSize:12, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through':'none', flex:1 }}>{ms.label}</span>
                    {done && <span style={{ fontSize:10, color:'var(--green)' }}>✓</span>}
                    {!done && isPast && <span style={{ fontSize:10, color:'var(--amber)' }}>pendente</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
