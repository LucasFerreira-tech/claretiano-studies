import { useState, useEffect } from 'react'
import { CYCLES, PORTFOLIOS, EXAMS } from '../data/academicData'
import { daysUntil, fmtFull, daysColor, currentCycle } from '../utils'
import { DISC } from '../utils'
import TarefasHoje from '../components/TarefasHoje'
import AvisoPagamento from '../components/AvisoPagamento'
import Atividades from '../components/Atividades'

const cycle = currentCycle(CYCLES)

const deadlines = [
  ...PORTFOLIOS.map(p => ({ title: p.title, date: p.deadline, disc: p.discipline })),
  ...CYCLES.filter(c=>c.questionsDeadline).map(c => ({ title: `Questões Online ${c.id}`, date: c.questionsDeadline, disc:'SO' })),
  ...EXAMS.map(e => ({ title: e.title, date: e.date, disc:'SO' })),
].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,7)

const discProgress = { SO:38, DPE:32, AMT:28, ANT:25 }

function useBrasiliaTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const hora = now.toLocaleTimeString('pt-BR', { timeZone:'America/Sao_Paulo', hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const data = now.toLocaleDateString('pt-BR', { timeZone:'America/Sao_Paulo', weekday:'long', day:'2-digit', month:'long', year:'numeric' })
  return { hora, data }
}

// ── Desktop Dashboard (unchanged) ───────────────────────────────────────
function DesktopDashboard() {
  const { hora, data } = useBrasiliaTime()
  return (
    <div className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>
            {cycle.label} — {fmtFull(cycle.start)} a {fmtFull(cycle.end)}
          </p>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontSize:22, fontWeight:700, color:'var(--accent)', fontFamily:'var(--mono)', letterSpacing:'0.04em' }}>{hora}</div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{data.charAt(0).toUpperCase() + data.slice(1)}</div>
          <div style={{ fontSize:9, color:'var(--text3)', marginTop:1, opacity:0.6 }}>Horário de Brasília</div>
        </div>
      </div>

      <div style={{ marginBottom:18 }}><AvisoPagamento /></div>

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

      <div style={{ marginTop:18 }}><TarefasHoje /></div>
      <div style={{ marginTop:18 }}><Atividades /></div>
    </div>
  )
}

// ── Mobile Dashboard ─────────────────────────────────────────────────────
function MobileDashboard() {
  const { hora, data } = useBrasiliaTime()
  const daysProva1 = daysUntil('2026-05-16')

  const WEEK = [
    { d:'Seg', items:['SO', 'DPE', 'Prog.'] },
    { d:'Ter', items:['ANT', 'SO', 'JA'] },
    { d:'Qua', items:['DPE', 'AMT', 'Prog.'] },
    { d:'Qui', items:['SO', 'DPE', 'JA'] },
    { d:'Sex', items:['DPE', 'SO', 'Prog.'] },
  ]

  const today = new Date().toLocaleString('en-US', { timeZone:'America/Sao_Paulo', weekday:'short' }).toLowerCase()
  const dayMap = { mon:'Seg', tue:'Ter', wed:'Qua', thu:'Qui', fri:'Sex', sat:'Sáb', sun:'Dom' }
  const todayLabel = dayMap[today] || ''

  return (
    <div className="m-page">

      {/* ── Hero header ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--text3)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:4 }}>
              AcadêmicoPlan
            </div>
            <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1, color:'var(--text)' }}>
              Olá,<br/>
              <span style={{ color:'var(--accent)' }}>Lucas</span> 👋
            </h1>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:26, fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)', letterSpacing:'-0.02em', lineHeight:1 }}>
              {hora.slice(0,5)}
            </div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:3 }}>
              {hora.slice(6)} · Brasília
            </div>
          </div>
        </div>
        <div style={{ fontSize:12, color:'var(--text2)', marginTop:6 }}>
          {data.charAt(0).toUpperCase() + data.slice(1)}
        </div>
      </div>

      {/* ── Aviso pagamento ── */}
      <AvisoPagamento />

      {/* ── Stats row (scroll horizontal) ── */}
      <div className="m-hscroll" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:10, paddingBottom:4, width:'max-content' }}>
          {[
            { v: cycle.id,         l:'Ciclo atual',  c:'#4f8ef7', bg:'rgba(79,142,247,0.1)' },
            { v: `${daysProva1}d`, l:'Prova 1',      c:'#34d399', bg:'rgba(52,211,153,0.1)' },
            { v: '5',              l:'Portfólios',    c:'#c084fc', bg:'rgba(192,132,252,0.1)' },
            { v: '3',              l:'Provas',        c:'#fb923c', bg:'rgba(251,146,60,0.1)' },
          ].map((m, i) => (
            <div key={i} style={{
              background: m.bg,
              border: `1px solid ${m.c}30`,
              borderRadius:12, padding:'12px 16px', minWidth:90,
              animation: `fadeUp 0.2s ease ${i*0.05}s both`,
            }}>
              <div style={{ fontSize:22, fontWeight:800, color:m.c, letterSpacing:'-0.02em' }}>{m.v}</div>
              <div style={{ fontSize:10, color:'var(--text3)', marginTop:3, fontWeight:600 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hoje na grade ── */}
      <div style={{ marginBottom:20 }}>
        <div className="m-label">Hoje na grade</div>
        <div className="m-card" style={{ padding:'12px 14px' }}>
          {WEEK.map((row, i) => {
            const isToday = row.d === todayLabel
            return (
              <div key={row.d} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'8px 0',
                borderBottom: i < WEEK.length - 1 ? '1px solid var(--border)' : 'none',
                background: isToday ? 'rgba(79,142,247,0.04)' : 'transparent',
                borderRadius: isToday ? 6 : 0,
                margin: isToday ? '0 -4px' : 0,
                padding: isToday ? '8px 4px' : '8px 0',
              }}>
                <span style={{
                  minWidth:28, fontSize:11, fontWeight:700,
                  color: isToday ? 'var(--accent)' : 'var(--text3)',
                }}>{row.d}</span>
                {isToday && <span style={{ fontSize:9, color:'var(--accent)', marginRight:2 }}>●</span>}
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', flex:1 }}>
                  {row.items.map(it => {
                    const disc = DISC[it.replace('.','')] || DISC[it]
                    return disc
                      ? <span key={it} style={{ fontSize:10, padding:'2px 7px', borderRadius:20, background:disc.bg, color:disc.color, fontWeight:700 }}>{it}</span>
                      : <span key={it} style={{ fontSize:10, padding:'2px 7px', borderRadius:20, background:'var(--bg3)', color:'var(--text2)' }}>{it}</span>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Próximos prazos ── */}
      <div style={{ marginBottom:20 }}>
        <div className="m-label">Próximos prazos</div>
        <div className="m-card" style={{ padding:'4px 14px' }}>
          {deadlines.map((d, i) => {
            const days = daysUntil(d.date)
            const disc = DISC[d.disc]
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'11px 0',
                borderBottom: i < deadlines.length - 1 ? '1px solid var(--border)' : 'none',
                gap:10,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                  <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20, background:disc?.bg, color:disc?.color, flexShrink:0 }}>{d.disc}</span>
                  <span style={{ fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</span>
                </div>
                <span style={{
                  fontSize:12, fontWeight:700, color:daysColor(days), flexShrink:0,
                  background: days <= 7 ? 'rgba(248,113,113,0.1)' : 'transparent',
                  padding: days <= 7 ? '2px 7px' : '0',
                  borderRadius:20,
                }}>
                  {days < 0 ? 'Exp.' : days === 0 ? 'Hoje!' : `${days}d`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Progresso das disciplinas ── */}
      <div style={{ marginBottom:20 }}>
        <div className="m-label">Progresso do semestre</div>
        <div className="m-card" style={{ padding:'14px' }}>
          {Object.entries(discProgress).map(([id, pct]) => {
            const disc = DISC[id]
            return (
              <div key={id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:disc.bg, color:disc.color }}>{id}</span>
                    <span style={{ fontSize:11, color:'var(--text2)' }}>
                      {id==='SO'?'Sistemas Op.':id==='DPE'?'Des. Profissional':id==='AMT'?'Aprendizagem':' Antropologia'}
                    </span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:disc.color }}>{pct}%</span>
                </div>
                <div style={{ background:'var(--bg4)', borderRadius:99, height:6 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:disc.color, borderRadius:99, transition:'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tarefas ── */}
      <div style={{ marginBottom:20 }}>
        <TarefasHoje />
      </div>

      {/* ── Atividades ── */}
      <div style={{ marginBottom:20 }}>
        <Atividades />
      </div>

    </div>
  )
}

// ── Export: renderiza mobile ou desktop conforme tela ──────────────────────
export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}
