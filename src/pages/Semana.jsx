import { useState } from 'react'
import { useStore } from '../store/store'
import { DISC } from '../utils'

// ── Estrutura do cronograma por semana/dia/slot ──────────────
// Slots: [07:50 Mat1, 09:20 Bíblico, 09:40 Mat2, 13:00 Prog, Tarde JA]

const SEMANAS_DATA = [
  {
    num: 1, label: 'Semana 1', periodo: '17–23/03',
    dias: [
      { dia: 'SEG', num: '17', slots: [
        { disc:'SO',    cls:'so',    title:'Revisão tópicos 2,3,4',                    sub:'Resumo próprio sem olhar o material' },
        { disc:'Bíblia',cls:'biblia',title:'',                                          sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'Conceito empreendedor + Say, Schumpeter, Drucker', sub:'3 modalidades Bessant e Tidd', id:'s1_seg_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo',                           sub:'13:00' },
        null,
      ]},
      { dia: 'TER', num: '18', slots: [
        { disc:'ANT',   cls:'ant',   title:'Perspectiva diacrônica',                   sub:'3 fases dignidade (Correa) + pós-verdade', id:'s1_ter_ant' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'Subprocessos e hierarquia pai/filho',      sub:'Threads vs processos', id:'s1_ter_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Excel',cls:'ja',  title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'QUA', num: '19', slots: [
        { disc:'DPE',   cls:'dpe',   title:'Perfil empreendedor + 14 características', sub:'Dornelas', id:'s1_qua_dpe' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'AMT',   cls:'amt',   title:'NotebookLM com PBIA',                      sub:'Ler instruções do portfólio', id:'s1_qua_amt' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'QUI', num: '20', slots: [
        { disc:'SO',    cls:'so',    title:'Escalonamento: FIFO e Round Robin',        sub:'Cálculos com dados novos', id:'s1_qui_so' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'4 mitos do empreendedor',                 sub:'Dolabela + Anki dos mitos', id:'s1_qui_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Adm.',cls:'ja',   title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'SEX', num: '21', slots: [
        { disc:'DPE',   cls:'dpe',   title:'Criatividade e inovação',                 sub:'6 elementos Adams + Bessant e Tidd', id:'s1_sex_dpe' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'SPF e SRF com cálculo',                   sub:'Comparação 4 algoritmos', id:'s1_sex_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'SÁB', num: '22', slots: [
        { disc:'Revisão', cls:'rev', title:'Revisão acumulada semana 1',              sub:'Anki + erros dos cálculos + pontos fracos', id:'s1_sab_rev' },
        { disc:'Portfólio',cls:'amt',title:'AMT — portfólio',                         sub:'Registros da semana', id:'s1_sab_port' },
        { disc:'Questões',cls:'dpe', title:'Questões se disponíveis', sub:'' },
        null, null,
      ]},
    ],
  },
  {
    num: 2, label: 'Semana 2', periodo: '24–30/03',
    dias: [
      { dia: 'SEG', num: '24', slots: [
        { disc:'SO',    cls:'so',    title:'Filas multiníveis + race conditions',      sub:'4 condições da região crítica', id:'s2_seg_so' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'4 formas competitividade (Covin e Miles)', sub:'Ireland e Webb — empreendedorismo estratégico', id:'s2_seg_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'TER', num: '25', slots: [
        { disc:'ANT',   cls:'ant',   title:'Modernidade líquida (Bauman)',             sub:'Reificação vs humanização', id:'s2_ter_ant' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'Exclusão mútua: lock, Peterson, TSL',     sub:'Por que cada técnica falha', id:'s2_ter_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Excel',cls:'ja',  title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'QUA', num: '26', slots: [
        { disc:'DPE',   cls:'dpe',   title:'Processo empreendedor + ideia vs oportunidade', sub:'4 fases + caso do software', id:'s2_qua_dpe' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'AMT',   cls:'amt',   title:'E-book: ética + busca exploratória',      sub:'Testar com material de SO', id:'s2_qua_amt' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'QUI', num: '27', slots: [
        { disc:'SO',    cls:'so',    title:'Sleep/wakeup + Produtor-Consumidor',      sub:'Deadlock — 4 condições', id:'s2_qui_so' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'Sustentabilidade + tripé ESG',            sub:'% mortalidade IBGE + revisão tópicos 2–4', id:'s2_qui_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Adm.',cls:'ja',   title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'SEX', num: '28', slots: [
        { disc:'DPE',   cls:'dpe',   title:'Capital de giro + preço de venda',        sub:'MCU e PEC com cálculo', id:'s2_sex_dpe' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'Semáforos e monitores',                   sub:'Comparação técnicas de sincronização', id:'s2_sex_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'SÁB', num: '29', slots: [
        { disc:'Revisão',cls:'rev',  title:'Revisão acumulada semana 2',              sub:'Anki + erros cálculos SO e DPE + fracos', id:'s2_sab_rev' },
        { disc:'Portfólio',cls:'amt',title:'AMT — portfólio',                         sub:'Registros da semana', id:'s2_sab_port' },
        null, null, null,
      ]},
    ],
  },
  {
    num: 3, label: 'Semana 3', periodo: '31/03–06/04',
    dias: [
      { dia: 'SEG', num: '31', slots: [
        { disc:'SO',    cls:'so',    title:'Troca de mensagens + revisão concorrência', sub:'Tabela comparativa todas as técnicas', id:'s3_seg_so' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'TIR e payback',                           sub:'Fluxo de caixa + payback simples vs descontado', id:'s3_seg_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'TER', num: '1', slots: [
        { disc:'ANT',   cls:'ant',   title:'Jung, Horney, Lasch',                     sub:'Tabela comparativa + Anki situação→conceito', id:'s3_ter_ant' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'Simulado final SO — 20 questões',         sub:'Tudo: processos, escalonamento, concorrência', id:'s3_ter_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Excel',cls:'ja',  title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'QUA', num: '2', slots: [
        { disc:'DPE',   cls:'dpe',   title:'Simulado final DPE — 15 questões',        sub:'Tudo + cálculos TIR e PEC', id:'s3_qua_dpe' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'AMT',   cls:'amt',   title:'Lovable/Base44 + fechar portfólio',       sub:'Testar criação de app + finalizar registros', id:'s3_qua_amt' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'QUI', num: '3', slots: [
        { disc:'SO',    cls:'so',    title:'Revisão cirúrgica SO',                    sub:'Só os erros do simulado', id:'s3_qui_so' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'DPE',   cls:'dpe',   title:'Revisão cirúrgica DPE',                  sub:'Só os erros do simulado', id:'s3_qui_dpe' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        { disc:'JA Adm.',cls:'ja',   title:'Jovem Aprendiz', sub:'tarde' },
      ]},
      { dia: 'SEX', num: '4', slots: [
        { disc:'ANT',   cls:'ant',   title:'ANT — revisão geral + simulado',          sub:'10 questões situação→conceito', id:'s3_sex_ant' },
        { disc:'Bíblia',cls:'biblia',title:'',sub:'' },
        { disc:'SO',    cls:'so',    title:'Revisão final pontos fracos',             sub:'Antes das questões online', id:'s3_sex_so' },
        { disc:'Prog.', cls:'prog',  title:'Estudo autônomo', sub:'13:00' },
        null,
      ]},
      { dia: 'SÁB', num: '5', slots: [
        { disc:'Revisão',cls:'rev',  title:'Revisão final semana 3',                 sub:'Rever erros de todos os simulados', id:'s3_sab_rev' },
        { disc:'Questões',cls:'dpe', title:'Questões online — todas as disciplinas', sub:'Abriu em 05/04 — responder no mesmo dia', id:'s3_sab_quest' },
        null, null, null,
      ]},
    ],
  },
]

const SLOT_LABELS = ['07:50 · Mat. 1', '09:20 · Bíblico', '09:40 · Mat. 2', '13:00 · Prog.', 'Tarde · JA']

const CLS_STYLE = {
  so:     { color:'#4f8ef7', bg:'rgba(79,142,247,0.12)'  },
  dpe:    { color:'#34d399', bg:'rgba(52,211,153,0.12)'  },
  amt:    { color:'#c084fc', bg:'rgba(192,132,252,0.12)' },
  ant:    { color:'#fb923c', bg:'rgba(251,146,60,0.12)'  },
  rev:    { color:'#f87171', bg:'rgba(248,113,113,0.12)' },
  biblia: { color:'#5a6278', bg:'rgba(90,98,120,0.10)'  },
  prog:   { color:'#34d399', bg:'rgba(52,211,153,0.08)' },
  ja:     { color:'#fb923c', bg:'rgba(251,146,60,0.08)' },
}

const DISC_STYLE = {
  SO:  { color:'#4f8ef7', bg:'rgba(79,142,247,0.12)' },
  DPE: { color:'#34d399', bg:'rgba(52,211,153,0.12)' },
  AMT: { color:'#c084fc', bg:'rgba(192,132,252,0.12)' },
  ANT: { color:'#fb923c', bg:'rgba(251,146,60,0.12)' },
}

// Grade horária original
const SCHEDULE_GRADE = [
  { time:'07:50', label:'Matéria 1',    slots:['SO','ANT','DPE','SO','DPE','Revisão'] },
  { time:'09:20', label:'Bíblico',      slots:['Bíblia','Bíblia','Bíblia','Bíblia','Bíblia','Portfólio'] },
  { time:'09:40', label:'Matéria 2',    slots:['DPE','SO','AMT','DPE','SO','Questões'] },
  { time:'13:00', label:'Programação',  slots:['Prog.','Prog.','Prog.','Prog.','Prog.',null] },
  { time:'Tarde', label:'Jovem Aprendiz',slots:[null,'JA Excel',null,'JA Adm.',null,null] },
]
const DAYS_GRADE = ['Seg','Ter','Qua','Qui','Sex','Sáb']

function Block({ label }) {
  if (!label) return <div style={{ minHeight:28 }} />
  const d = DISC[label]
  if (d) return <div style={{ background:d.bg, color:d.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:600, width:'100%' }}>{label}</div>
  const sp = { 'Prog.':{ bg:'rgba(52,211,153,0.1)',color:'#34d399' },'JA Excel':{ bg:'rgba(251,146,60,0.1)',color:'#fb923c' },'JA Adm.':{ bg:'rgba(251,146,60,0.1)',color:'#fb923c' },'Bíblia':{ bg:'rgba(90,98,120,0.15)',color:'#8b93a8' },'Revisão':{ bg:'rgba(90,98,120,0.15)',color:'#8b93a8' },'Portfólio':{ bg:'rgba(192,132,252,0.1)',color:'#c084fc' },'Questões':{ bg:'rgba(248,113,113,0.1)',color:'#f87171' } }
  const s = sp[label] || { bg:'var(--bg3)', color:'var(--text2)' }
  return <div style={{ background:s.bg, color:s.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:500, width:'100%' }}>{label}</div>
}

export default function Semana() {
  const [tab, setTab] = useState('cronograma')
  const [semana, setSemana] = useState(1)
  const { milestones, toggleMilestone } = useStore()

  const semanaData = SEMANAS_DATA.find(s => s.num === semana)

  // Progresso por disciplina
  const progresso = ['so','dpe','ant','amt'].map(d => {
    const allIds = SEMANAS_DATA.flatMap(s => s.dias.flatMap(dia => dia.slots.filter(sl => sl && sl.id && sl.cls === d).map(sl => sl.id)))
    const done = allIds.filter(id => milestones[`semana-${id}`]).length
    return { disc: d.toUpperCase(), cls: d, total: allIds.length, done }
  })

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Semana</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Cronograma de 3 semanas + grade horária</p>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20 }}>
        {[['cronograma','📅 Cronograma'], ['grade','⬚ Grade horária']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
            border: tab===k?'none':'1px solid var(--border)',
            background: tab===k?'var(--accent)':'transparent',
            color: tab===k?'#fff':'var(--text2)', transition:'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {/* ── Cronograma ── */}
      {tab === 'cronograma' && (
        <div>
          {/* Progresso geral por disciplina */}
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:12 }}>Progresso geral — 3 semanas</div>
            {progresso.map(p => {
              const st = CLS_STYLE[p.cls] || CLS_STYLE.so
              const pct = p.total ? Math.round(p.done/p.total*100) : 0
              return (
                <div key={p.disc} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:st.bg, color:st.color, minWidth:32, textAlign:'center' }}>{p.disc}</span>
                  <div style={{ flex:1, background:'var(--bg4)', borderRadius:99, height:5 }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:st.color, borderRadius:99, transition:'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize:11, color:'var(--text3)', minWidth:50, textAlign:'right' }}>{p.done}/{p.total}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:st.color, minWidth:32, textAlign:'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>

          {/* Semana selector */}
          <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
            {SEMANAS_DATA.map(s => (
              <button key={s.num} onClick={() => setSemana(s.num)} style={{
                padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer',
                border: semana===s.num?'none':'1px solid var(--border)',
                background: semana===s.num?'rgba(79,142,247,0.15)':'transparent',
                color: semana===s.num?'var(--accent)':'var(--text3)', transition:'all 0.15s',
              }}>{s.label} <span style={{ fontSize:10, opacity:0.65 }}>{s.periodo}</span></button>
            ))}
          </div>

          {/* Tabela cronograma — scroll horizontal */}
          <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
            <div style={{ minWidth:600 }}>
              {/* Header com dias */}
              <div style={{ display:'grid', gridTemplateColumns:`80px repeat(${semanaData.dias.length},1fr)`, background:'var(--bg3)', borderRadius:'10px 10px 0 0', border:'1px solid var(--border)', borderBottom:'none' }}>
                <div style={{ padding:'8px 10px', fontSize:10, fontWeight:700, color:'var(--text3)' }}>Horário</div>
                {semanaData.dias.map(d => (
                  <div key={d.dia} style={{ padding:'8px 6px', textAlign:'center', borderLeft:'1px solid var(--border)' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase' }}>{d.dia}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', lineHeight:1.1 }}>{d.num}</div>
                  </div>
                ))}
              </div>

              {/* Rows por slot de horário */}
              {SLOT_LABELS.map((slotLabel, si) => (
                <div key={si} style={{ display:'grid', gridTemplateColumns:`80px repeat(${semanaData.dias.length},1fr)`, border:'1px solid var(--border)', borderBottom: si===SLOT_LABELS.length-1?'1px solid var(--border)':'none', borderRadius: si===SLOT_LABELS.length-1?'0 0 10px 10px':'0' }}>
                  <div style={{ padding:'8px 10px', background:'var(--bg3)', display:'flex', alignItems:'center' }}>
                    <div style={{ fontSize:9, color:'var(--text3)', fontWeight:600, lineHeight:1.4 }}>{slotLabel.replace(' · ','\n')}</div>
                  </div>
                  {semanaData.dias.map((dia, di) => {
                    const slot = dia.slots[si]
                    if (!slot) return <div key={di} style={{ borderLeft:'1px solid var(--border)', background:'var(--bg)', minHeight:44 }} />
                    const st = CLS_STYLE[slot.cls] || { color:'var(--text3)', bg:'var(--bg3)' }
                    const isStudy = !!slot.id
                    const isDone = isStudy && !!milestones[`semana-${slot.id}`]
                    const isMuted = ['biblia','prog','ja'].includes(slot.cls)
                    return (
                      <div key={di}
                        onClick={isStudy ? () => toggleMilestone(`semana-${slot.id}`) : undefined}
                        style={{
                          borderLeft:'1px solid var(--border)',
                          padding:'6px 8px',
                          cursor: isStudy ? 'pointer' : 'default',
                          background: isDone ? 'rgba(52,211,153,0.04)' : 'var(--bg2)',
                          opacity: isDone ? 0.55 : 1,
                          transition:'all 0.15s',
                        }}
                      >
                        <div style={{ display:'flex', alignItems:'flex-start', gap:4 }}>
                          {isDone && <span style={{ fontSize:9, color:'#34d399', fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>}
                          <div style={{ minWidth:0 }}>
                            <span style={{ display:'inline-block', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:20, background:st.bg, color:st.color, marginBottom:3 }}>{slot.disc}</span>
                            {!isMuted && slot.title && (
                              <div style={{ fontSize:11, fontWeight:600, color: isDone?'var(--text3)':'var(--text)', lineHeight:1.3, textDecoration: isDone?'line-through':'none' }}>{slot.title}</div>
                            )}
                            {!isMuted && slot.sub && (
                              <div style={{ fontSize:10, color:'var(--text3)', lineHeight:1.3, marginTop:2 }}>{slot.sub}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize:11, color:'var(--text3)', marginTop:10, textAlign:'center' }}>
            💡 Clique nas células de estudo para marcar como concluído
          </p>
        </div>
      )}

      {/* ── Grade horária ── */}
      {tab === 'grade' && (
        <div>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:16 }}>Grade semanal — a partir de 16/03/2026</p>
          <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:16, minWidth:520 }}>
              <div style={{ display:'grid', gridTemplateColumns:'70px repeat(6,1fr)', background:'var(--bg3)' }}>
                <div style={{ padding:'10px 8px', fontSize:11, color:'var(--text3)', fontWeight:600 }}>Horário</div>
                {DAYS_GRADE.map(d => <div key={d} style={{ padding:'10px 8px', fontSize:12, fontWeight:600, color:'var(--text)', textAlign:'center' }}>{d}</div>)}
              </div>
              {SCHEDULE_GRADE.map((row, ri) => (
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
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
            {Object.entries(DISC).map(([id,d]) => <span key={id} style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:d.bg, color:d.color }}>{id}</span>)}
            {[{ label:'Programação',c:'#34d399' },{ label:'Jovem Aprendiz',c:'#fb923c' },{ label:'Revisão/Portfólio',c:'#c084fc' },{ label:'Bíblico',c:'#8b93a8' }].map(x => (
              <span key={x.label} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'var(--bg3)', color:x.c }}>{x.label}</span>
            ))}
          </div>
          <div style={{ marginTop:20, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontWeight:600, color:'#34d399', marginBottom:4 }}>📟 Estudo de Programação</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}>Todo dia útil — início <strong>16/03/2026</strong> · 13:00 às 15:30 (2h30) · Seg a Sex</div>
          </div>
          <div style={{ marginTop:10, background:'rgba(251,146,60,0.06)', border:'1px solid rgba(251,146,60,0.2)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontWeight:600, color:'#fb923c', marginBottom:4 }}>👔 Jovem Aprendiz</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}><strong>Terça:</strong> Excel e comunicação profissional · <strong>Quinta:</strong> Entrevistas e habilidades administrativas</div>
          </div>
        </div>
      )}
    </div>
  )
}
