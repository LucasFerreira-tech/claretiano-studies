import { DISC } from '../utils'

const DAYS = ['Seg','Ter','Qua','Qui','Sex','Sáb']

const SCHEDULE = [
  { time:'07:50', label:'Matéria 1', slots:['SO','ANT','DPE','SO','DPE','Revisão'] },
  { time:'09:20', label:'Bíblico',   slots:['Bíblia','Bíblia','Bíblia','Bíblia','Bíblia','Portfólio'] },
  { time:'09:40', label:'Matéria 2', slots:['DPE','SO','AMT','DPE','SO','Questões'] },
  { time:'13:00', label:'Programação',slots:['Prog.','Prog.','Prog.','Prog.','Prog.',null] },
  { time:'Tarde', label:'Jovem Aprendiz',slots:[null,'JA Excel',null,'JA Adm.',null,null] },
]

function Block({ label }) {
  if (!label) return <div style={{ minHeight:28 }} />
  const disc = DISC[label]
  if (disc) return (
    <div style={{ background:disc.bg, color:disc.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:600, width:'100%' }}>{label}</div>
  )
  const specials = {
    'Prog.':     { bg:'rgba(52,211,153,0.1)',  color:'#34d399' },
    'JA Excel':  { bg:'rgba(251,146,60,0.1)',  color:'#fb923c' },
    'JA Adm.':   { bg:'rgba(251,146,60,0.1)',  color:'#fb923c' },
    'Bíblia':    { bg:'rgba(90,98,120,0.15)',  color:'#8b93a8' },
    'Revisão':   { bg:'rgba(90,98,120,0.15)',  color:'#8b93a8' },
    'Portfólio': { bg:'rgba(192,132,252,0.1)', color:'#c084fc' },
    'Questões':  { bg:'rgba(248,113,113,0.1)', color:'#f87171' },
  }
  const s = specials[label] || { bg:'var(--bg3)', color:'var(--text2)' }
  return (
    <div style={{ background:s.bg, color:s.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:500, width:'100%' }}>{label}</div>
  )
}

export default function Semana() {
  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Semana</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Grade semanal — a partir de 16/03/2026</p>

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:16 }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'70px repeat(6,1fr)', background:'var(--bg3)' }}>
          <div style={{ padding:'10px 8px', fontSize:11, color:'var(--text3)', fontWeight:600 }}>Horário</div>
          {DAYS.map(d => (
            <div key={d} style={{ padding:'10px 8px', fontSize:12, fontWeight:600, color:'var(--text)', textAlign:'center' }}>{d}</div>
          ))}
        </div>

        {SCHEDULE.map((row, ri) => (
          <div key={ri} style={{ display:'grid', gridTemplateColumns:'70px repeat(6,1fr)', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'10px 8px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--text)', fontFamily:'var(--mono)' }}>{row.time}</div>
              <div style={{ fontSize:9, color:'var(--text3)', marginTop:1 }}>{row.label}</div>
            </div>
            {row.slots.map((slot, si) => (
              <div key={si} style={{ padding:'8px 6px', borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center' }}>
                <Block label={slot} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {Object.entries(DISC).map(([id,d]) => (
          <span key={id} style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:d.bg, color:d.color }}>{id}</span>
        ))}
        {[
          { label:'Programação', c:'#34d399' },
          { label:'Jovem Aprendiz', c:'#fb923c' },
          { label:'Revisão/Portfólio', c:'#c084fc' },
          { label:'Bíblico', c:'#8b93a8' },
        ].map(x => (
          <span key={x.label} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'var(--bg3)', color:x.c }}>{x.label}</span>
        ))}
      </div>

      {/* Programação block */}
      <div style={{ marginTop:20, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'12px 16px' }}>
        <div style={{ fontWeight:600, color:'#34d399', marginBottom:4 }}>📟 Estudo de Programação</div>
        <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}>
          Todo dia útil — início <strong>16/03/2026</strong> · 13:00 às 15:30 (2h30) · Seg a Sex<br/>
          Linguagens: JavaScript, lógica de programação, projetos práticos
        </div>
      </div>

      <div style={{ marginTop:10, background:'rgba(251,146,60,0.06)', border:'1px solid rgba(251,146,60,0.2)', borderRadius:10, padding:'12px 16px' }}>
        <div style={{ fontWeight:600, color:'#fb923c', marginBottom:4 }}>👔 Jovem Aprendiz</div>
        <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}>
          <strong>Terça:</strong> Excel e comunicação profissional<br/>
          <strong>Quinta:</strong> Entrevistas e habilidades administrativas
        </div>
      </div>
    </div>
  )
}
