import { useState } from 'react'
import { useStore } from '../store/store'

const SESSOES = [
  {
    id: 1, titulo: 'Contexto da IA no Brasil (PBIA) + ética', dia: 'Qua', data: '19/03', semana: 1,
    blocos: [
      { duracao: '20min', titulo: 'Leitura + instruções do portfólio', desc: 'Leia as páginas 11–18 do PBIA (o que é IA, potencial transformador). Aproveite para ler as instruções do portfólio na sala de aula virtual.', tag: 'leitura' },
      { duracao: '30min', titulo: 'Explore o NotebookLM com o próprio PBIA', desc: 'Acesse notebooklm.google.com → crie um notebook → carregue o PDF do PBIA → peça: "resuma os principais desafios do Brasil em IA" e "quais são as janelas de oportunidade mencionadas?"', tag: 'ferramenta', link: { label: 'NotebookLM', url: 'https://notebooklm.google.com' } },
      { duracao: '20min', titulo: 'Reflexão + início do portfólio', desc: 'Anote: o que o NotebookLM fez que você não conseguiria fazer manualmente em 5 minutos? Qual a limitação percebida? Esse registro é o começo do portfólio.', tag: 'portfolio' },
    ],
  },
  {
    id: 2, titulo: 'E-book: princípios éticos + busca exploratória', dia: 'Qua', data: '19/03 (tarde)', semana: 1,
    blocos: [
      { duracao: '20min', titulo: 'Leitura: capítulos 1 e 2 (até busca exploratória)', desc: 'Foque em: o que são LLMs, por que IA não pode ser autora, o que é "alucinação", e como fazer busca exploratória com ChatGPT. Leia o exemplo da página 13.', tag: 'leitura' },
      { duracao: '30min', titulo: 'Teste busca exploratória com tema de SO', desc: 'Abra o ChatGPT (ou Claude) e use a técnica do e-book: "sou estudante de sistemas operacionais e quero entender melhor concorrência entre processos. Quais os principais temas?" Explore 2–3 níveis de profundidade.', tag: 'ferramenta', link: { label: 'ChatGPT / Claude', url: 'https://chat.openai.com' } },
      { duracao: '20min', titulo: 'Reflexão + portfólio', desc: 'Quando a busca exploratória é útil e quando pode ser perigosa? O que mudou no resultado quando você foi mais específico no prompt?', tag: 'portfolio' },
    ],
  },
  {
    id: 3, titulo: 'E-book: leitura de artigos + estudo com IA', dia: 'Qua', data: '26/03', semana: 1,
    blocos: [
      { duracao: '20min', titulo: 'Leitura: utilidades V (leitura) e VI (estudo)', desc: 'Leia as páginas 25–33 do e-book. Foque no ExplainPaper e no NotebookLM como ferramenta de estudo (página 29). Veja o exemplo do ChatEDU.', tag: 'leitura' },
      { duracao: '30min', titulo: 'Teste NotebookLM como ferramenta de estudo', desc: 'Carregue o material de SO ou DPE no NotebookLM. Peça: "gere 5 perguntas de revisão sobre processos e estados" e "explique de forma simples o que é deadlock". Compare com o que você estudou.', tag: 'ferramenta', link: { label: 'NotebookLM', url: 'https://notebooklm.google.com' } },
      { duracao: '20min', titulo: 'Reflexão + portfólio', desc: 'NotebookLM para estudo vs. Claude: qual gerou perguntas mais úteis para revisão? Registre a comparação.', tag: 'portfolio' },
    ],
  },
  {
    id: 4, titulo: 'PBIA: janelas de oportunidade + IA nas empresas', dia: 'Qua', data: '26/03', semana: 2,
    blocos: [
      { duracao: '20min', titulo: 'Leitura: páginas 19–30 do PBIA', desc: 'Leia sobre janelas de oportunidade do Brasil (saúde, agronegócio, meio ambiente, português) e os 5 pilares da "IA para o bem de todos". São os tópicos mais prováveis de aparecer nas questões online.', tag: 'leitura' },
      { duracao: '30min', titulo: 'Explore o Lovable ou Base44', desc: 'Acesse lovable.dev → crie uma conta → tente criar um app simples descrevendo em linguagem natural: "um app de lista de tarefas para estudantes". Observe o processo sem código.', tag: 'ferramenta', link: { label: 'Lovable', url: 'https://lovable.dev' } },
      { duracao: '20min', titulo: 'Reflexão + portfólio', desc: 'O que o Lovable gerou? Onde precisou de ajustes? Qual o potencial disso para um estudante ou empreendedor sem conhecimento técnico?', tag: 'portfolio' },
    ],
  },
  {
    id: 5, titulo: 'E-book: formatação, escrita e geração visual', dia: 'Qua', data: '02/04', semana: 2,
    blocos: [
      { duracao: '20min', titulo: 'Leitura: utilidades VII e IX (formatação + slides)', desc: 'Leia páginas 34–49. Foque no QuillBot (correção gramatical) e no SlidesAI (geração de apresentações). São as ferramentas mais úteis no dia a dia acadêmico.', tag: 'leitura' },
      { duracao: '30min', titulo: 'Teste QuillBot + SlidesAI', desc: 'QuillBot: instale a extensão Chrome e use em qualquer texto que estiver escrevendo. SlidesAI: crie uma mini apresentação sobre "O que é IA?" usando "Apenas o Tópico" no plano gratuito.', tag: 'ferramenta', link: { label: 'QuillBot', url: 'https://quillbot.com' } },
      { duracao: '20min', titulo: 'Reflexão + portfólio', desc: 'Quais ferramentas do e-book você já usava sem saber que eram IA? Registre isso — é um bom ponto para o portfólio.', tag: 'portfolio' },
    ],
  },
  {
    id: 6, titulo: 'PBIA: plano de ação + integridade acadêmica', dia: 'Qua', data: '02/04', semana: 2,
    blocos: [
      { duracao: '20min', titulo: 'Leitura: páginas 30–42 do PBIA + e-book caps finais', desc: 'Leia os 5 eixos do plano de ação do PBIA (infraestrutura, formação, serviço público, inovação, governança). Leia as considerações finais e a declaração de IA do e-book (páginas 50–54).', tag: 'leitura' },
      { duracao: '25min', titulo: 'Quiz aqui sobre todo o conteúdo visto até agora', desc: 'Peça aqui: "me faz 8 questões sobre o PBIA e ferramentas de IA acadêmicas cobrindo: definição de IA, pilares do bem de todos, janelas de oportunidade, e questões éticas".', tag: 'quiz', claude: true },
      { duracao: '25min', titulo: 'Avanço no portfólio', desc: 'Organize o que já anotou nas sessões anteriores em formato de portfólio: ferramenta testada, o que fez, pontos fortes, limitações, uso potencial.', tag: 'portfolio' },
    ],
  },
  {
    id: 7, titulo: 'Ferramenta livre + revisão geral', dia: 'Qua', data: '02/04', semana: 3,
    blocos: [
      { duracao: '20min', titulo: 'Escolha uma ferramenta que não testou', desc: 'Olhe a lista "Outras ferramentas" (página 53) ou o e-book e escolha uma que tenha utilidade real para você agora: Mendeley (referências), Gamma (slides bonitos), ou Mapify (mapas mentais).', tag: 'leitura' },
      { duracao: '35min', titulo: 'Teste com conteúdo real das suas outras disciplinas', desc: 'Use a ferramenta escolhida com material real: mapa mental de DPE, slides de ANT, ou organize referências de SO. Documente o processo com prints ou anotações.', tag: 'ferramenta' },
      { duracao: '15min', titulo: 'Portfólio + questões online', desc: 'Finalize o portfólio com essa última ferramenta. Lembre: em 05/04 abrem as questões online — responda no mesmo dia.', tag: 'portfolio' },
    ],
  },
  {
    id: 8, titulo: 'Simulado das questões online + portfólio final', dia: 'Qui/Sex', data: '03–04/04', semana: 3,
    blocos: [
      { duracao: '30min', titulo: 'Simulado de questões online aqui', desc: 'Peça aqui: "crie 10 questões de múltipla escolha sobre o conteúdo de AMT: PBIA (definição de IA, 5 pilares, janelas de oportunidade, 5 eixos do plano), ética no uso de IA acadêmica, e ferramentas do e-book".', tag: 'quiz', claude: true },
      { duracao: '40min', titulo: 'Finalizar e revisar o portfólio', desc: 'Revise todo o portfólio acumulado. Verifique se está cobrindo: pelo menos 3 ferramentas testadas, reflexão sobre ética, e conexão com o contexto do PBIA. Entregue assim que abrir.', tag: 'portfolio' },
    ],
  },
  {
    id: 9, titulo: 'Questões online abertas', dia: 'Sáb', data: '05/04', semana: 3,
    blocos: [
      { duracao: 'manhã', titulo: 'Responder as questões online assim que abrirem', desc: 'Não deixe para depois. Abriu, respondeu. Com o conteúdo estudado nas semanas anteriores, as questões devem ser rápidas.', tag: 'quiz' },
    ],
  },
]

const TAG_CONFIG = {
  leitura:   { label: 'Leitura',    color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)'   },
  ferramenta:{ label: 'Ferramenta', color: '#c084fc', bg: 'rgba(192,132,252,0.1)'  },
  portfolio: { label: 'Portfólio',  color: '#fb923c', bg: 'rgba(251,146,60,0.1)'   },
  quiz:      { label: 'Quiz',       color: '#34d399', bg: 'rgba(52,211,153,0.1)'   },
}

const METODO = [
  { num: 1, titulo: 'Leitura com propósito', duracao: '20 min', desc: 'Leia com uma pergunta em mente: "para que serve isso?" ou "quando eu usaria?". Não anote tudo — anote só o que te surpreendeu.' },
  { num: 2, titulo: 'Teste na prática',      duracao: '30 min', desc: 'Abra a ferramenta indicada e siga o exemplo do e-book. Depois adapte para um uso seu — use um tema das outras disciplinas (SO ou DPE) como conteúdo de teste.' },
  { num: 3, titulo: 'Reflexão + portfólio', duracao: '20 min', desc: 'Anote: o que a ferramenta faz bem? Qual o limite dela? Onde usaria no seu dia a dia acadêmico? Esse registro vai direto para o portfólio da disciplina.' },
]

export default function AMT() {
  const [tab, setTab] = useState('cronograma')
  const [semana, setSemana] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const { milestones, toggleMilestone } = useStore()

  const sessoesSemana = SESSOES.filter(s => s.semana === semana)
  const color = '#c084fc'
  const colorBg = 'rgba(192,132,252,0.1)'
  const colorBorder = 'rgba(192,132,252,0.2)'

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: colorBg, color }}>AMT</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Aprendizagem Mediada por Tecnologia</h1>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>Cronograma de 9 sessões · 3 semanas · 19/03 → 05/04</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['cronograma','📅 Cronograma'], ['metodo','⚙️ Método AMT']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: tab === k ? 'none' : '1px solid var(--border)',
            background: tab === k ? color : 'transparent',
            color: tab === k ? '#fff' : 'var(--text2)', transition: 'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {tab === 'cronograma' && (
        <div>
          {/* Dica estratégica */}
          <div style={{ background: colorBg, border: `1px solid ${colorBorder}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4 }}>💡 Dica estratégica</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
              Use os materiais das outras disciplinas como conteúdo de teste. Carregue o PDF de SO no NotebookLM, peça um resumo do capítulo de escalonamento. Isso economiza tempo e já serve como estudo cruzado.
            </div>
          </div>

          {/* Semana selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[1, 2, 3].map(s => (
              <button key={s} onClick={() => setSemana(s)} style={{
                padding: '6px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: semana === s ? 'none' : '1px solid var(--border)',
                background: semana === s ? colorBg : 'transparent',
                color: semana === s ? color : 'var(--text3)', transition: 'all 0.15s',
              }}>Semana {s}</button>
            ))}
          </div>

          {/* Progresso */}
          {(() => {
            const total = sessoesSemana.length
            const done = sessoesSemana.filter(s => milestones[`amt-s${s.id}`]).length
            const pct = total ? Math.round(done / total * 100) : 0
            return (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Progresso — Semana {semana}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{done}/{total} sessões</span>
                  </div>
                  <div style={{ background: 'var(--bg4)', borderRadius: 99, height: 6 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s' }} />
                  </div>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color }}>{pct}%</span>
              </div>
            )
          })()}

          {sessoesSemana.map(s => {
            const isOpen = expanded === s.id
            const isDone = !!milestones[`amt-s${s.id}`]
            return (
              <div key={s.id} style={{ background: 'var(--bg2)', border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                <div onClick={() => setExpanded(v => v === s.id ? null : s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}>
                  <div onClick={e => { e.stopPropagation(); toggleMilestone(`amt-s${s.id}`) }}
                    style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: isDone ? 'none' : '2px solid var(--border2)', background: isDone ? '#34d399' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    {isDone && <span style={{ color: '#0f1117', fontSize: 11, fontWeight: 800 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>Sessão {s.id}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: colorBg, color }}>{s.dia} {s.data}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>45min</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? 'var(--text3)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>{s.titulo}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {s.blocos.map((b, bi) => {
                      const tc = TAG_CONFIG[b.tag] || TAG_CONFIG.leitura
                      return (
                        <div key={bi} style={{ background: tc.bg, border: `1px solid ${tc.color}30`, borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tc.label}</span>
                            <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>{b.duracao}</span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{b.titulo}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{b.desc}</div>
                          {b.link && (
                            <a href={b.link.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'var(--text2)', textDecoration: 'none', border: '1px solid var(--border)' }}>
                              ↗ {b.link.label}
                            </a>
                          )}
                          {b.claude && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(79,142,247,0.12)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.2)' }}>
                              🤖 Pedir aqui no Claude
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'metodo' && (
        <div>
          <div style={{ background: colorBg, border: `1px solid ${colorBorder}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6 }}>AMT é diferente das outras disciplinas</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>Aqui você não memoriza teoria — você lê e imediatamente usa a ferramenta. O aprendizado acontece na prática. Cada sessão tem uma lógica simples: entender o conceito → testar a ferramenta → refletir sobre o que aprendeu.</div>
          </div>
          {METODO.map((m, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color, flexShrink: 0 }}>{m.num}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{m.titulo}</div>
                  <div style={{ fontSize: 11, color }}>{m.duracao}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
          <div style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fb923c', marginBottom: 4 }}>📋 Sobre o portfólio</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>O portfólio provavelmente pede um registro de uso das ferramentas (NotebookLM, Lovable, Base44). Exatamente o que você vai acumulando em cada sessão — anote ferramenta testada, o que fez, pontos fortes, limitações e uso potencial.</div>
          </div>
        </div>
      )}
    </div>
  )
}
