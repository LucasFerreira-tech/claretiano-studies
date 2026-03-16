import { useState } from 'react'
import { useStore } from '../store/store'
import { DISC } from '../utils'

const DISC_STYLE = {
  SO:     { color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)'  },
  DPE:    { color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  AMT:    { color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  ANT:    { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  Rev:    { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  Folga:  { color: '#5a6278', bg: 'rgba(90,98,120,0.10)'  },
}

const SEMANAS = [
  {
    num: 1, label: 'Semana 1', periodo: '17–23/03',
    dias: [
      { dia: 'SEG', num: 17, sessoes: [
        { disc: 'SO',  titulo: 'Revisão tópicos 2, 3 e 4 — resumo próprio + quiz', duracao: '1h30', desc: 'Escrever o que entendeu hoje sem olhar o material. Processo, contexto, PCB, 3 estados.' },
      ]},
      { dia: 'TER', num: 18, sessoes: [
        { disc: 'DPE', titulo: 'Conceito de empreendedor + 3 modalidades de Bessant e Tidd', duracao: '1h30', desc: 'Say, Schumpeter, Drucker, Dolabela + Anki primeiros flashcards.' },
      ]},
      { dia: 'QUA', num: 19, sessoes: [
        { disc: 'ANT', titulo: 'ANT — unidade 1: leitura + resumo + Anki', duracao: '45min', desc: 'Sessão leve de ANT.' },
        { disc: 'AMT', titulo: 'NotebookLM com PBIA + ler instruções do portfólio', duracao: '45min', desc: 'Carregar PDF do PBIA no NotebookLM e explorar. Ler instruções do portfólio.' },
      ]},
      { dia: 'QUI', num: 20, sessoes: [
        { disc: 'SO',  titulo: 'Subprocessos, hierarquia pai/filho + threads', duracao: '1h30', desc: 'Tópico 5 completo. Quiz processo × thread × subprocesso.' },
      ]},
      { dia: 'SEX', num: 21, sessoes: [
        { disc: 'DPE', titulo: 'Perfil, comportamento e 4 mitos do empreendedor', duracao: '1h30', desc: '14 características de Dornelas + Anki dos mitos (clássico de prova).' },
      ]},
      { dia: 'SÁB', num: 22, sessoes: [
        { disc: 'SO',  titulo: 'Escalonamento: preemptivo, prioridades + FIFO e Round Robin', duracao: '1h30', desc: 'Ler tópico 6 + refazer exemplos numéricos + resolver com dados novos.' },
      ]},
      { dia: 'DOM', num: 23, sessoes: [
        { disc: 'Rev', titulo: 'Revisão acumulada semana 1', duracao: '45–60min', desc: 'Revisar Anki de DPE + reler os resumos de SO (tópicos 2–5) + o que ficou fraco de AMT/ANT. Anotar dúvidas para a semana 2.' },
      ]},
    ],
  },
  {
    num: 2, label: 'Semana 2', periodo: '24–30/03',
    dias: [
      { dia: 'SEG', num: 24, sessoes: [
        { disc: 'SO',  titulo: 'SPF e SRF com cálculo + comparação dos 4 algoritmos', duracao: '1h30', desc: 'Resolver exemplos do material + tabela comparando FIFO, RR, SPF, SRF.' },
      ]},
      { dia: 'TER', num: 25, sessoes: [
        { disc: 'DPE', titulo: 'Criatividade, inovação e 4 formas de competitividade', duracao: '1h30', desc: 'Covin e Miles, Ireland e Webb, 6 elementos de Adams + Anki.' },
      ]},
      { dia: 'QUA', num: 26, sessoes: [
        { disc: 'ANT', titulo: 'ANT — unidade 2: leitura + resumo + quiz rápido', duracao: '45min', desc: 'Modernidade líquida, Bauman, reificação.' },
        { disc: 'AMT', titulo: 'E-book: ética + busca exploratória com tema de SO', duracao: '45min', desc: 'Caps 1–2 do e-book + testar ChatGPT com tema de concorrência.' },
      ]},
      { dia: 'QUI', num: 27, sessoes: [
        { disc: 'SO',  titulo: 'Filas multiníveis + race conditions e região crítica', duracao: '1h30', desc: 'Fechar tópico 6 + iniciar tópico 7: 4 condições da região crítica.' },
      ]},
      { dia: 'SEX', num: 28, sessoes: [
        { disc: 'DPE', titulo: 'Processo empreendedor + ideia vs. oportunidade', duracao: '1h30', desc: '4 fases + caso do software + fontes de ideias.' },
      ]},
      { dia: 'SÁB', num: 29, sessoes: [
        { disc: 'SO',  titulo: 'Exclusão mútua: lock, Peterson, TSL', duracao: '1h', desc: 'Por que cada técnica falha antes da próxima.' },
        { disc: 'DPE', titulo: 'Sustentabilidade + revisão rápida tópicos 2–4', duracao: '30min', desc: 'Tripé ESG, % mortalidade IBGE + quiz revisão.' },
      ]},
      { dia: 'DOM', num: 30, sessoes: [
        { disc: 'Rev', titulo: 'Revisão acumulada semana 2', duracao: '45–60min', desc: 'Anki de DPE + rever erros dos cálculos de SO + pontos fracos de exclusão mútua. Anotar o que ainda não está claro antes da semana 3.' },
      ]},
    ],
  },
  {
    num: 3, label: 'Semana 3', periodo: '31/03–06/04',
    dias: [
      { dia: 'SEG', num: 31, sessoes: [
        { disc: 'SO',  titulo: 'Sleep/wakeup, Produtor-Consumidor e deadlock', duracao: '1h30', desc: 'Simular os 4 passos que geram deadlock + entender por que falha.' },
      ]},
      { dia: 'TER', num: 1, sessoes: [
        { disc: 'DPE', titulo: 'Capital de giro, preço de venda e ponto de equilíbrio', duracao: '1h30', desc: 'Único tópico com cálculo em DPE — MCU, PEC em quantidade e valor.' },
      ]},
      { dia: 'QUA', num: 2, sessoes: [
        { disc: 'ANT', titulo: 'ANT — revisão geral + simulado', duracao: '45min', desc: 'Quiz completo + revisão Anki de ANT.' },
        { disc: 'AMT', titulo: 'Lovable/Base44 + fechar portfólio', duracao: '45min', desc: 'Testar criação de app simples + finalizar registros do portfólio.' },
      ]},
      { dia: 'QUI', num: 3, sessoes: [
        { disc: 'SO',  titulo: 'Semáforos, monitores e troca de mensagens', duracao: '1h30', desc: 'Fechar tópico 7 + tabela comparativa de todas as técnicas de sincronização.' },
      ]},
      { dia: 'SEX', num: 4, sessoes: [
        { disc: 'DPE', titulo: 'TIR, payback + simulado final DPE', duracao: '1h30', desc: 'Fluxo de caixa, payback simples vs. descontado + quiz completo.' },
      ]},
      { dia: 'SÁB', num: 5, sessoes: [
        { disc: 'SO',  titulo: 'Simulado final SO — toda a unidade', duracao: '1h30', desc: '20 questões cobrindo tudo: conceito, estados, threads, escalonamento e concorrência.' },
        { disc: 'AMT', titulo: 'Questões online AMT — responder assim que abrir', duracao: 'manhã', desc: 'Abriu, respondeu. Não deixar para depois.' },
      ]},
      { dia: 'DOM', num: 6, sessoes: [
        { disc: 'Rev', titulo: 'Revisão final — pontos fracos antes da PE1', duracao: '1h', desc: 'Rever só o que errou nos simulados das semanas anteriores. Nada novo — apenas consolidar o que ficou solto.' },
      ]},
    ],
  },
]

const SCHEDULE_GRADE = [
  { time:'07:50', label:'Matéria 1', slots:['SO','ANT','DPE','SO','DPE','Revisão'] },
  { time:'09:20', label:'Bíblico',   slots:['Bíblia','Bíblia','Bíblia','Bíblia','Bíblia','Portfólio'] },
  { time:'09:40', label:'Matéria 2', slots:['DPE','SO','AMT','DPE','SO','Questões'] },
  { time:'13:00', label:'Programação',slots:['Prog.','Prog.','Prog.','Prog.','Prog.',null] },
  { time:'Tarde', label:'Jovem Aprendiz',slots:[null,'JA Excel',null,'JA Adm.',null,null] },
]
const DAYS = ['Seg','Ter','Qua','Qui','Sex','Sáb']

function Block({ label }) {
  if (!label) return <div style={{ minHeight:28 }} />
  const disc = DISC[label]
  if (disc) return <div style={{ background:disc.bg, color:disc.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:600, width:'100%' }}>{label}</div>
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
  return <div style={{ background:s.bg, color:s.color, borderRadius:5, padding:'3px 7px', fontSize:11, fontWeight:500, width:'100%' }}>{label}</div>
}

export default function Semana() {
  const [tab, setTab] = useState('cronograma')
  const [semana, setSemana] = useState(1)
  const { milestones, toggleMilestone } = useStore()

  const semanaData = SEMANAS.find(s => s.num === semana)

  return (
    <div className="page-enter">
      <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>Semana</h1>
      <p style={{ fontSize:12, color:'var(--text3)', marginBottom:20 }}>Grade horária e cronograma de estudos das 3 semanas</p>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20 }}>
        {[['cronograma','📅 Cronograma de estudos'], ['grade','⬚ Grade horária']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'6px 16px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
            border: tab===k ? 'none' : '1px solid var(--border)',
            background: tab===k ? 'var(--accent)' : 'transparent',
            color: tab===k ? '#fff' : 'var(--text2)', transition:'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {/* ── Cronograma de estudos ── */}
      {tab === 'cronograma' && (
        <div>
          {/* Legenda */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
            {Object.entries(DISC_STYLE).map(([k,v]) => (
              <span key={k} style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:v.bg, color:v.color }}>{k}</span>
            ))}
          </div>

          {/* Semana selector */}
          <div style={{ display:'flex', gap:6, marginBottom:16 }}>
            {SEMANAS.map(s => (
              <button key={s.num} onClick={() => setSemana(s.num)} style={{
                padding:'6px 18px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer',
                border: semana===s.num ? 'none' : '1px solid var(--border)',
                background: semana===s.num ? 'rgba(79,142,247,0.15)' : 'transparent',
                color: semana===s.num ? 'var(--accent)' : 'var(--text3)', transition:'all 0.15s',
              }}>{s.label} <span style={{ fontSize:10, opacity:0.7 }}>{s.periodo}</span></button>
            ))}
          </div>

          {/* Dias */}
          {semanaData?.dias.map((dia, di) => {
            const isDomingo = dia.dia === 'DOM'
            return (
              <div key={di} style={{ display:'grid', gridTemplateColumns:'56px 1fr', gap:12, marginBottom:10, alignItems:'start' }}>
                {/* Label do dia */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:10 }}>
                  <div style={{ fontSize:10, fontWeight:700, color: isDomingo ? '#f87171' : 'var(--text3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{dia.dia}</div>
                  <div style={{ fontSize:22, fontWeight:700, color: isDomingo ? '#f87171' : 'var(--text)', lineHeight:1.2 }}>{dia.num}</div>
                </div>
                {/* Sessões do dia */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {dia.sessoes.map((s, si) => {
                    const ds = DISC_STYLE[s.disc] || DISC_STYLE.Folga
                    const key = `semana-${semana}-${di}-${si}`
                    const isDone = !!milestones[key]
                    return (
                      <div key={si} onClick={() => toggleMilestone(key)} style={{
                        background: isDone ? 'var(--bg3)' : 'var(--bg2)',
                        border: `1px solid ${isDone ? 'rgba(52,211,153,0.25)' : 'var(--border)'}`,
                        borderRadius:10, padding:'10px 14px', cursor:'pointer',
                        opacity: isDone ? 0.6 : 1, transition:'all 0.15s',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:ds.bg, color:ds.color, flexShrink:0 }}>{s.disc}</span>
                          <span style={{ fontSize:13, fontWeight:600, color: isDone ? 'var(--text3)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{isDone ? '✓ ' : ''}{s.titulo}</span>
                          <span style={{ fontSize:10, color:'var(--text3)', flexShrink:0 }}>{s.duracao}</span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.4 }}>{s.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
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
                {DAYS.map(d => <div key={d} style={{ padding:'10px 8px', fontSize:12, fontWeight:600, color:'var(--text)', textAlign:'center' }}>{d}</div>)}
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
          {/* Legend */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
            {Object.entries(DISC).map(([id,d]) => (
              <span key={id} style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:d.bg, color:d.color }}>{id}</span>
            ))}
            {[{ label:'Programação', c:'#34d399' },{ label:'Jovem Aprendiz', c:'#fb923c' },{ label:'Revisão/Portfólio', c:'#c084fc' },{ label:'Bíblico', c:'#8b93a8' }].map(x => (
              <span key={x.label} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'var(--bg3)', color:x.c }}>{x.label}</span>
            ))}
          </div>
          <div style={{ marginTop:20, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontWeight:600, color:'#34d399', marginBottom:4 }}>📟 Estudo de Programação</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}>Todo dia útil — início <strong>16/03/2026</strong> · 13:00 às 15:30 (2h30) · Seg a Sex<br/>Linguagens: JavaScript, lógica de programação, projetos práticos</div>
          </div>
          <div style={{ marginTop:10, background:'rgba(251,146,60,0.06)', border:'1px solid rgba(251,146,60,0.2)', borderRadius:10, padding:'12px 16px' }}>
            <div style={{ fontWeight:600, color:'#fb923c', marginBottom:4 }}>👔 Jovem Aprendiz</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7 }}><strong>Terça:</strong> Excel e comunicação profissional<br/><strong>Quinta:</strong> Entrevistas e habilidades administrativas</div>
          </div>
        </div>
      )}
    </div>
  )
}
