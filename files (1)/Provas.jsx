import { useState, useEffect } from 'react'
import { EXAMS } from '../data/academicData'
import { daysUntil, fmtFull } from '../utils'

const PREP = {
  PROVA1: [
    { period:'27/04 → 10/05', task:'Revisão intensiva C1 + C2 + C3' },
    { period:'11/05 → 15/05', task:'Simulados — 4 disciplinas' },
    { period:'16/05', task:'Fazer nas primeiras 48h', highlight:true },
  ],
  PROVA2: [
    { period:'01/06 → 07/06', task:'Revisão completa C1 → C5' },
    { period:'08/06 → 12/06', task:'Revisão final + descanso' },
    { period:'13/06 08:00', task:'PROVA PRESENCIAL no polo', highlight:true },
  ],
  'PROVA-INT': [
    { period:'01/06 → 12/06', task:'Revisão junto com PE2' },
    { period:'13/06 → 15/06', task:'Fazer assim que abrir', highlight:true },
  ],
}

function MobileProvas() {
  const [expanded, setExpanded] = useState('PROVA1')

  return (
    <div className="m-page">
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.03em', marginBottom:4 }}>Provas</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:16 }}>Calendário e preparação</p>

      {EXAMS.map(exam => {
        const days = daysUntil(exam.date)
        const isPresencial = exam.type === 'presencial'
        const isOpen = expanded === exam.id
        const prep = PREP[exam.id] || []

        return (
          <div key={exam.id} style={{ marginBottom:12 }}>
            <div onClick={() => setExpanded(isOpen ? null : exam.id)} className="m-touchable"
              style={{ background:'var(--bg2)', border:`1px solid ${isPresencial?'rgba(248,113,113,0.3)':'var(--border)'}`, borderRadius:14, padding:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1, minWidth:0, marginRight:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:isPresencial?'rgba(248,113,113,0.12)':'rgba(79,142,247,0.12)', color:isPresencial?'#f87171':'#4f8ef7' }}>
                      {isPresencial?'PRESENCIAL':'ONLINE'}
                    </span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{exam.title}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>
                    {fmtFull(exam.date)}{exam.time && ` às ${exam.time}`}
                  </div>
                </div>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:30, fontWeight:800, color: days<=30?'#f87171':days<=60?'#fbbf24':'#34d399', lineHeight:1 }}>
                    {days<0?'✓':days===0?'!':days}
                  </div>
                  <div style={{ fontSize:9, color:'var(--text3)', fontWeight:600 }}>{days<0?'FEITA':days===0?'HOJE':'dias'}</div>
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{isOpen?'▲':'▼'}</div>
                </div>
              </div>
            </div>

            {isOpen && (
              <div style={{ background:'var(--bg3)', border:`1px solid ${isPresencial?'rgba(248,113,113,0.15)':'var(--border)'}`, borderRadius:'0 0 14px 14px', padding:'14px', marginTop:-4, animation:'fadeUp 0.15s ease' }}>
                {isPresencial && (
                  <div style={{ background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#f87171', marginBottom:12 }}>
                    ⚠ Confirme o polo · Chegue 30min antes
                  </div>
                )}
                <div style={{ fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Cronograma</div>
                {prep.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom: i<prep.length-1?'1px solid var(--border)':'none' }}>
                    <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:90, flexShrink:0 }}>{p.period}</span>
                    <span style={{ fontSize:12, color: p.highlight?(isPresencial?'#f87171':'#34d399'):'var(--text)', fontWeight:p.highlight?700:400, lineHeight:1.4 }}>{p.task}</span>
                  </div>
                ))}
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:10 }}>
                  {exam.cycles.map(c => (
                    <span key={c} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'var(--bg4)', color:'var(--text2)', fontWeight:600 }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Timeline */}
      <div style={{ marginTop:8, marginBottom:16 }}>
        <div className="m-label">Visão geral do semestre</div>
        <div className="m-card" style={{ padding:'4px 14px' }}>
          {[
            { date:'02/02–08/03', label:'Ciclo 1', color:'var(--text3)' },
            { date:'09/03–05/04', label:'Ciclo 2 (atual)', color:'var(--accent)' },
            { date:'06/04–03/05', label:'Ciclo 3', color:'var(--text2)' },
            { date:'04/05–31/05', label:'Ciclo 4', color:'var(--text2)' },
            { date:'16/05–24/05', label:'Prova Específica 1', color:'#fbbf24' },
            { date:'01/06–30/06', label:'Ciclo 5', color:'var(--text2)' },
            { date:'13/06', label:'Prova 2 + ASI (presencial)', color:'#f87171' },
            { date:'13/06–15/06', label:'Prova Integrada', color:'#f87171' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none', alignItems:'center' }}>
              <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:90, flexShrink:0 }}>{row.date}</span>
              <div style={{ width:6, height:6, borderRadius:'50%', background:row.color, flexShrink:0 }} />
              <span style={{ fontSize:12, color:row.color, fontWeight:row.color!=='var(--text2)'&&row.color!=='var(--text3)'?600:400 }}>{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesktopProvas() {
  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Provas</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Calendário e cronograma de preparação</p>
      {EXAMS.map(exam => {
        const days = daysUntil(exam.date)
        const isPresencial = exam.type === 'presencial'
        const prep = PREP[exam.id] || []
        return (
          <div key={exam.id} style={{ background:'var(--bg2)', border:`1px solid ${isPresencial?'rgba(248,113,113,0.3)':'var(--border)'}`, borderRadius:10, padding:'16px', marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:isPresencial?'rgba(248,113,113,0.12)':'rgba(79,142,247,0.12)', color:isPresencial?'#f87171':'#4f8ef7' }}>{isPresencial?'PRESENCIAL':'ONLINE'}</span>
                  <span style={{ fontSize:15, fontWeight:700 }}>{exam.title}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--text3)' }}>{fmtFull(exam.date)}{exam.time&&` às ${exam.time}`}{exam.deadline&&` → disponível até ${fmtFull(exam.deadline)}`}{exam.location&&` · ${exam.location}`}</div>
                <div style={{ display:'flex', gap:4, marginTop:6, flexWrap:'wrap' }}>
                  {exam.cycles.map(c => <span key={c} style={{ fontSize:10, padding:'1px 6px', borderRadius:20, background:'var(--bg3)', color:'var(--text2)', fontWeight:600 }}>{c}</span>)}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                <div style={{ fontSize:32, fontWeight:700, color:days<=30?'#f87171':days<=60?'var(--amber)':'var(--green)', lineHeight:1 }}>{days<0?'✓':days===0?'Hoje!':`${days}d`}</div>
                <div style={{ fontSize:10, color:'var(--text3)', marginTop:3 }}>dias restantes</div>
              </div>
            </div>
            {isPresencial && <div style={{ background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#f87171', marginBottom:12 }}>⚠ Confirmar endereço do polo com antecedência · Chegar com 30 min antes</div>}
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Cronograma de preparação</div>
            {prep.map((p, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'7px 0', borderBottom: i<prep.length-1?'1px solid var(--border)':'none' }}>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:100, flexShrink:0 }}>{p.period}</span>
                <span style={{ fontSize:12, color:p.highlight?(isPresencial?'#f87171':'var(--green)'):'var(--text)', fontWeight:p.highlight?600:400 }}>{p.task}</span>
              </div>
            ))}
          </div>
        )
      })}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:8, marginBottom:10 }}>Visão geral do semestre</p>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px' }}>
        {[
          { date:'02/02 → 08/03', label:'Ciclo 1', color:'var(--text3)' },
          { date:'09/03 → 05/04', label:'Ciclo 2 (atual)', color:'var(--accent)' },
          { date:'06/04 → 03/05', label:'Ciclo 3', color:'var(--text2)' },
          { date:'04/05 → 31/05', label:'Ciclo 4', color:'var(--text2)' },
          { date:'16/05 → 24/05', label:'Prova Específica 1 (online)', color:'var(--amber)' },
          { date:'01/06 → 30/06', label:'Ciclo 5', color:'var(--text2)' },
          { date:'13/06', label:'Prova Específica 2 + ASI (presencial 08h)', color:'#f87171' },
          { date:'13/06 → 15/06', label:'Prova Integrada (online)', color:'#f87171' },
        ].map((row, i, arr) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'6px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none', alignItems:'center' }}>
            <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:130, flexShrink:0 }}>{row.date}</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:row.color, flexShrink:0 }} />
            <span style={{ fontSize:12, color:row.color, fontWeight:row.color!=='var(--text2)'&&row.color!=='var(--text3)'?600:400 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Provas() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile ? <MobileProvas /> : <DesktopProvas />
}
