import { CYCLES, PORTFOLIOS, EXAMS } from '../data/academicData'
import { daysUntil, fmtFull, daysColor, currentCycle } from '../utils'
import { DISC } from '../utils'
import TarefasHoje from '../components/TarefasHoje'
import AvisoPagamento from '../components/AvisoPagamento'

const cycle = currentCycle(CYCLES)

const deadlines = [
  ...PORTFOLIOS.map(p => ({ title: p.title, date: p.deadline, disc: p.discipline })),
  ...CYCLES.filter(c=>c.questionsDeadline).map(c => ({ title: `Questões Online ${c.id}`, date: c.questionsDeadline, disc:'SO' })),
  ...EXAMS.map(e => ({ title: e.title, date: e.date, disc:'SO' })),
].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,7)

const discProgress = { SO:38, DPE:32, AMT:28, ANT:25 }

export default function Dashboard() {

  return (
    <div className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>
            {cycle.label} — {fmtFull(cycle.start)} a {fmtFull(cycle.end)}
          </p>
        </div>
      </div>

      <div style={{ marginBottom:18 }}>
        <AvisoPagamento />
      </div>

      {/* Metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
        {[
          { v: cycle.id,   l:'Ciclo atual',     s: `${fmtFull(cycle.start)} → ${fmtFull(cycle.end)}`, c:'#4f8ef7' },
          { v: '5',        l:'Portfólios',       s:'no semestre',    c:'#c084fc' },
          { v: '3',        l:'Provas',           s:'no semestre',    c:'#fb923c' },
          { v: `${daysUntil('2026-05-16')}d`,  l:'Prova 1', s:'16/05/2026', c:'#34d399' },
        ].map((m,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 12px' }}>
            <div style={{ fontSize:24, fontWeight:700, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{m.l}</div>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:4, fontWeight:500 }}>{m.s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Deadlines */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Próximos prazos</p>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
            {deadlines.map((d,i) => {
              const days = daysUntil(d.date)
              const disc = DISC[d.disc]
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom: i<deadlines.length-1 ? '1px solid var(--border)':'none', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc?.bg, color:disc?.color, flexShrink:0 }}>{d.disc}</span>
                    <span style={{ fontSize:12, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:daysColor(days), flexShrink:0 }}>
                    {days < 0 ? 'Expirado' : days === 0 ? 'Hoje!' : `${days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress */}
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Progresso das disciplinas</p>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px' }}>
            {Object.entries(discProgress).map(([id, pct]) => {
              const disc = DISC[id]
              return (
                <div key={id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc.bg, color:disc.color, minWidth:32, textAlign:'center' }}>{id}</span>
                  <div style={{ flex:1, background:'var(--bg4)', borderRadius:99, height:5 }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:disc.color, borderRadius:99, transition:'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize:11, color:'var(--text3)', minWidth:28, textAlign:'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>

          <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'14px 0 8px' }}>Esta semana</p>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px' }}>
            {[
              { d:'Seg', items:['SO', 'DPE', 'Programação'] },
              { d:'Ter', items:['ANT', 'SO', 'JA — Excel'] },
              { d:'Qua', items:['DPE', 'AMT', 'Programação'] },
              { d:'Qui', items:['SO', 'DPE', 'JA — Adm.'] },
              { d:'Sex', items:['DPE', 'SO', 'Programação'] },
            ].map((row,i,arr) => (
              <div key={row.d} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
                <span style={{ minWidth:26, fontSize:11, fontWeight:700, color:'var(--text3)' }}>{row.d}</span>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {row.items.map(it => {
                    const disc = DISC[it]
                    return disc
                      ? <span key={it} style={{ fontSize:10, padding:'1px 6px', borderRadius:20, background:disc.bg, color:disc.color, fontWeight:600 }}>{it}</span>
                      : <span key={it} style={{ fontSize:10, padding:'1px 6px', borderRadius:20, background:'var(--bg3)', color:'var(--text2)' }}>{it}</span>
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tarefas de Hoje */}
      <div style={{ marginTop:18 }}>
        <TarefasHoje />
      </div>
    </div>
  )
}
