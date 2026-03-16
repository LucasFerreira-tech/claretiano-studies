import { useState } from 'react'
import { useStore } from '../store/store'

const CONCEITOS = [
  { nome: 'Perspectiva diacrônica', desc: 'Análise histórica ao longo do tempo. Como o conceito de "humano" mudou da Antiguidade até hoje.' },
  { nome: 'Perspectiva sincrônica', desc: 'Análise do momento presente. Como indivíduo e sociedade interagem hoje simultaneamente.' },
  { nome: 'Dignidade humana (Correa)', desc: '3 fases: 1) dignidade pelo cargo, 2) dignidade mínima + hierarquia, 3) dignidade igual para todos — DUDH 1948.' },
  { nome: 'Pós-verdade', desc: 'Emoções e crenças pessoais valem mais que fatos objetivos na formação da opinião. "Acredito, logo é verdade."' },
  { nome: 'Modernidade líquida (Bauman)', desc: 'Relações, empregos e identidades fluem como líquido — assumem a forma do ambiente. Instabilidade como norma.' },
  { nome: 'Sociedade de consumo (Bauman)', desc: 'Pessoas se tornam mercadorias — precisam ser desejáveis para conseguir emprego, afeto, status. "Consumo, logo sou."' },
  { nome: 'Reificação', desc: 'Quando a pessoa é tratada como coisa/objeto — reduzida a sua função ou utilidade no mercado.' },
  { nome: 'Humanização', desc: 'Reconhecimento da pessoa em sua integralidade — não apenas pelo papel que ocupa.' },
  { nome: 'Neurose de poder (Horney)', desc: 'Ambição por poder que nasce da fraqueza e ansiedade, não da força. Disfarça conflitos internos.' },
  { nome: 'Indivíduo instável (Jung)', desc: 'Industrialização e urbanização geraram pessoas desenraizadas, inseguras e facilmente influenciáveis.' },
  { nome: 'Capital erótico', desc: 'Atratividade como estratégia de sobrevivência social e profissional. O corpo como produto no mercado.' },
  { nome: 'Identidade social (Lasch)', desc: 'O lugar social do indivíduo precisa significar transformação, não apenas adaptação ao consumo.' },
]

const SESSOES = [
  {
    id: 1, titulo: 'Perspectiva diacrônica: a pessoa na história ocidental', dia: 'Qua', data: '19/03', semana: 1,
    blocos: [
      { duracao: '20min', tipo: 'leitura', titulo: 'Leitura ativa — tópico 2', desc: 'Leia o tópico 2 inteiro. Pergunta-guia: "como o conceito de dignidade humana mudou ao longo da história?" Preste atenção nos dados do Quadro 1 (% de mortes em conflitos) — são dados que aparecem em questões.' },
      { duracao: '15min', tipo: 'resumo', titulo: 'Resumo + exemplo pessoal', desc: 'Escreva: as 3 fases da dignidade humana (Correa) com suas palavras + um exemplo atual de cada fase. O que é pós-verdade e dê um exemplo de fake news que você já viu circular.' },
      { duracao: '10min', tipo: 'anki', titulo: 'Anki + quiz', desc: 'Crie 4 flashcards: diacrônico vs. sincrônico, 3 fases da dignidade, pós-verdade, dado do Quadro 1. Peça aqui: "quiz sobre perspectiva diacrônica e dignidade humana em ANT".', claude: true },
    ],
  },
  {
    id: 2, titulo: 'Modernidade líquida e sociedade de consumo', dia: 'Qua', data: '26/03', semana: 1,
    blocos: [
      { duracao: '20min', tipo: 'leitura', titulo: 'Leitura ativa — tópico 3 (primeira metade)', desc: 'Leia até o conceito de modernidade líquida de Bauman. Pergunta-guia: "em que momento da minha vida eu me comportei como \'mercadoria\' ou tratei alguém assim?" Anote o exemplo mentalmente.' },
      { duracao: '15min', tipo: 'resumo', titulo: 'Resumo + conexão com a vida real', desc: 'Escreva com suas palavras: o que é modernidade líquida? O que é reificação vs. humanização? Use o exemplo do gerente de banco do material como base e crie um paralelo com algo que você conhece.' },
      { duracao: '10min', tipo: 'anki', titulo: 'Anki + quiz', desc: 'Crie 4 flashcards no formato situação → conceito: modernidade líquida, reificação, sociedade de consumo (Bauman), capital erótico. Peça quiz aqui sobre esses conceitos.', claude: true },
    ],
  },
  {
    id: 3, titulo: 'Jung, Horney e Lasch: o indivíduo na modernidade', dia: 'Qua', data: '02/04', semana: 2,
    blocos: [
      { duracao: '20min', tipo: 'leitura', titulo: 'Leitura ativa — tópico 3 (segunda metade)', desc: 'Leia do Jung até o final do tópico 3. Pergunta-guia: "que tipo de comportamento compulsivo ou neurótico eu identifico nas pessoas ao meu redor (ou em mim) que esse texto explica?" Leia com curiosidade, não com julgamento.' },
      { duracao: '15min', tipo: 'resumo', titulo: 'Resumo comparativo', desc: 'Monte uma mini-tabela com suas palavras: Jung (indivíduo instável), Horney (neurose de poder), Lasch (identidade social e consumo). O que cada um diz sobre o indivíduo moderno? Onde concordam?' },
      { duracao: '10min', tipo: 'anki', titulo: 'Anki + quiz', desc: 'Crie flashcards para Jung, Horney e Lasch no formato situação → conceito + autor. Peça quiz aqui: "questões sobre Jung, Horney e Lasch em ANT no estilo de prova".', claude: true },
    ],
  },
  {
    id: 4, titulo: 'Revisão de toda a unidade + simulado', dia: 'Qua/Sex', data: '02/04 ou 04/04', semana: 2,
    blocos: [
      { duracao: '10min', tipo: 'anki', titulo: 'Revisão rápida dos flashcards Anki', desc: 'Passe por todos os flashcards criados nas 3 sessões anteriores. Não releia o material — confie nos flashcards e identifique os que ainda estão frágeis.' },
      { duracao: '35min', tipo: 'quiz', titulo: 'Simulado completo da unidade', desc: 'Peça aqui: "me faz 10 questões de múltipla escolha sobre ANT Unidade 2, cobrindo: perspectivas diacrônica e sincrônica, dignidade humana (3 fases), pós-verdade, modernidade líquida, reificação, humanização, Jung, Horney e Lasch. Questões no estilo \'qual conceito explica essa situação?\'"', claude: true },
    ],
  },
  {
    id: 5, titulo: 'Questões online + revisão cirúrgica', dia: 'Sáb', data: '05/04', semana: 3,
    blocos: [
      { duracao: '15min', tipo: 'resumo', titulo: 'Revisar só os erros do simulado', desc: 'Releia apenas os trechos correspondentes às questões que errou no simulado da semana 2. Nada novo — só fechar os buracos.' },
      { duracao: '30min', tipo: 'quiz', titulo: 'Responder questões online de ANT', desc: 'Assim que abrirem as questões online em 05/04, responda. Com os conceitos bem fixados via Anki e os simulados feitos, as questões devem fluir.' },
    ],
  },
]

const TIPO_CONFIG = {
  leitura: { label: 'Leitura ativa', color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', icon: '📖' },
  resumo:  { label: 'Resumo',        color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  icon: '✍️' },
  anki:    { label: 'Anki + Quiz',   color: '#c084fc', bg: 'rgba(192,132,252,0.08)', icon: '🃏' },
  quiz:    { label: 'Simulado',      color: '#34d399', bg: 'rgba(52,211,153,0.08)',  icon: '🎯' },
}

const color = '#fb923c'
const colorBg = 'rgba(251,146,60,0.1)'
const colorBorder = 'rgba(251,146,60,0.2)'

export default function ANT() {
  const [tab, setTab] = useState('cronograma')
  const [semana, setSemana] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const { milestones, toggleMilestone } = useStore()

  const sessoesSemana = SESSOES.filter(s => s.semana === semana)

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: colorBg, color }}>ANT</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Antropologia, Ética e Cultura</h1>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>Cronograma de 5 sessões · 3 semanas · 19/03 → 05/04</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['cronograma','📅 Cronograma'], ['conceitos','💡 Conceitos-chave'], ['metodo','⚙️ Método ANT']].map(([k, l]) => (
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

          {semana === 3 && (
            <div style={{ background: colorBg, border: `1px solid ${colorBorder}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                Se você fez as 4 sessões anteriores, ANT está coberta. A semana 3 é só para responder as questões online em 05/04 e, se necessário, revisar pontos fracos apontados pelo simulado.
              </div>
            </div>
          )}

          {(() => {
            const total = sessoesSemana.length
            const done = sessoesSemana.filter(s => milestones[`ant-s${s.id}`]).length
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
            const isDone = !!milestones[`ant-s${s.id}`]
            return (
              <div key={s.id} style={{ background: 'var(--bg2)', border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                <div onClick={() => setExpanded(v => v === s.id ? null : s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}>
                  <div onClick={e => { e.stopPropagation(); toggleMilestone(`ant-s${s.id}`) }}
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
                      const tc = TIPO_CONFIG[b.tipo] || TIPO_CONFIG.leitura
                      return (
                        <div key={bi} style={{ background: tc.bg, border: `1px solid ${tc.color}30`, borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span>{tc.icon}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tc.label}</span>
                            <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>{b.duracao}</span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{b.titulo}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{b.desc}</div>
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

      {tab === 'conceitos' && (
        <div>
          <div style={{ background: colorBg, border: `1px solid ${colorBorder}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 4 }}>Formato ideal de flashcard para ANT</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
              Não use "o que é modernidade líquida?" — isso é decoreba. Use: <em>"Uma pessoa muda de emprego, cidade e relacionamento constantemente para se adaptar ao mercado. Qual conceito de qual autor explica isso?"</em> → modernidade líquida — Bauman. Esse formato treina exatamente o que cai em prova.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CONCEITOS.map((c, i) => (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{c.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'metodo' && (
        <div>
          <div style={{ background: colorBg, border: `1px solid ${colorBorder}`, borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6 }}>ANT não é pra memorizar — é pra relacionar</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>As questões de prova de humanidades quase nunca perguntam "quem disse X?" isoladamente. Elas descrevem uma situação e pedem que você identifique o conceito ou o autor que explica aquilo.</div>
          </div>
          {[
            { icon: '📖', titulo: 'Leitura ativa', duracao: '20 min', desc: 'Leia com uma pergunta em mente: "isso explica alguma coisa que eu vivo ou vi acontecer?" Sublinhe mentalmente os exemplos práticos — são eles que fixam o conceito.' },
            { icon: '✍️', titulo: 'Resumo + conexão', duracao: '15 min', desc: 'Escreva com suas palavras: o que o autor quis dizer? Crie um exemplo do seu cotidiano que ilustre o conceito. Isso é muito mais poderoso que copiar a definição.' },
            { icon: '🃏', titulo: 'Anki + quiz', duracao: '10 min', desc: 'Crie flashcards no formato: frente = situação do cotidiano, verso = conceito + autor. Peça quiz aqui com questões no estilo "qual conceito explica essa situação?"' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{m.titulo}</div>
                  <div style={{ fontSize: 11, color }}>{m.duracao}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
            ⏱ Tempo total por sessão: 45 minutos. ANT é leve — o segredo é a regularidade.
          </div>
        </div>
      )}
    </div>
  )
}
