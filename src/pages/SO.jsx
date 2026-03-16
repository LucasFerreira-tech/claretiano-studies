import { useState } from 'react'
import { useStore } from '../store/store'

// ── Dados do cronograma ──────────────────────────────────────
const SESSOES = [
  {
    id: 1, titulo: 'Revisão tópicos 2, 3 e 4', dia: 'Seg', data: '17/03',
    semana: 1,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'Vídeo: "O que é processo em SO" no YouTube. Releia rapidamente suas anotações de hoje.', link: { label: 'YouTube: "processo sistema operacional Tanenbaum"', url: 'https://www.youtube.com/results?search_query=processo+sistema+operacional+Tanenbaum' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'Escreva aqui no chat: o que é processo, contexto, PCB (PID/UID/quotas), os 3 estados e transições. Sem olhar o material.', link: { label: 'Claude: quiz tópicos 2–4', url: null, claude: true } },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça aqui: "me faz um quiz sobre processos, modelo de processo e estados".', link: { label: 'Claude: quiz tópicos 2–4', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 2, titulo: 'Subprocessos e hierarquia pai/filho', dia: 'Ter', data: '18/03',
    semana: 1,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "processos e subprocessos sistemas operacionais". Leia o início do tópico 5 no material.', link: { label: 'YouTube: "fork processo filho SO"', url: 'https://www.youtube.com/results?search_query=fork+processo+filho+SO' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'O que acontece com os filhos quando o pai morre? Por que subprocessos desperdiçam recursos? Escreva com exemplos do dia a dia.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça quiz aqui sobre subprocessos e hierarquia. Foque nas diferenças entre processo pai, filho e subprocesso.', link: { label: 'Claude: quiz subprocessos', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 3, titulo: 'Threads: mono vs. multi, núcleo vs. usuário', dia: 'Qui', data: '20/03',
    semana: 1,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "threads vs processos explicação" — vídeo animado ajuda muito aqui. Leia o restante do tópico 5.', link: { label: 'YouTube: "thread vs process animation"', url: 'https://www.youtube.com/results?search_query=thread+vs+process+animation' } },
        { texto: 'Silberschatz cap. 4 — Threads', link: { label: 'Minha Biblioteca', url: null, material: true } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'Por que threads são mais leves? O que elas compartilham e o que é individual? Diferença entre thread de núcleo e de usuário.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça aqui um quiz comparando processo x thread x subprocesso. É a confusão mais comum nesse tópico.', link: { label: 'Claude: quiz processo vs thread', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 4, titulo: 'Escalonamento: preemptivo, prioridades', dia: 'Sex', data: '21/03',
    semana: 1,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "escalonamento de processos preemptivo". Leia o início do tópico 6 no material.', link: { label: 'YouTube: "escalonamento SO preemptivo não preemptivo"', url: 'https://www.youtube.com/results?search_query=escalonamento+SO+preemptivo+n%C3%A3o+preemptivo' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'Quando usar preemptivo vs. não preemptivo? O que é prioridade estática e dinâmica? Exemplos práticos de cada.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça quiz de classificação: dado um cenário, identificar qual tipo de escalonamento é mais adequado.', link: { label: 'Claude: quiz escalonamento preemptivo', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 5, titulo: 'FIFO e Round Robin com cálculo', dia: 'Sáb', data: '22/03',
    semana: 1,
    regra: { titulo: 'Regra de ouro para escalonamento (tópico 6)', texto: 'Não adianta ler os algoritmos — tem que calcular. Refaça os exemplos numéricos do material com pelo menos um conjunto de dados diferente. Se o cálculo fechar, você aprendeu.' },
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "round robin scheduling animation" — assista animação do algoritmo funcionando. Releia os exemplos numéricos do material.', link: { label: 'YouTube: "FIFO round robin scheduling example"', url: 'https://www.youtube.com/results?search_query=FIFO+round+robin+scheduling+example' } },
      ]},
      { tipo: 'calculo', duracao: '30min', itens: [
        { texto: 'Refaça os exemplos do material sem olhar a resposta. Depois crie seus próprios dados (3 processos, tempos diferentes) e resolva FIFO e RR.', link: { label: 'Material tópico 6 — tabelas 1 e 2', url: null, material: true } },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Me mande seus cálculos aqui pra eu corrigir e gero novos exercícios com dados diferentes.', link: { label: 'Claude: corrija meu cálculo FIFO/RR', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 6, titulo: 'SPF e SRF com cálculo', dia: 'Seg', data: '24/03',
    semana: 2,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "shortest job first scheduling" com animação. Leia os exemplos do SPF e SRF no material.', link: { label: 'YouTube: "SJF SRF scheduling animation"', url: 'https://www.youtube.com/results?search_query=SJF+SRF+scheduling+animation' } },
      ]},
      { tipo: 'calculo', duracao: '30min', itens: [
        { texto: 'Resolva os exemplos das tabelas 3 e 4 do material. Depois calcule o mesmo conjunto de processos nos 4 algoritmos e compare os tempos médios.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça um quiz aqui que misture os 4 algoritmos. O objetivo é saber escolher qual usar dado um cenário.', link: { label: 'Claude: quiz comparativo 4 algoritmos', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 7, titulo: 'Filas multiníveis de retorno', dia: 'Ter', data: '25/03',
    semana: 2,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "multilevel feedback queue scheduling". Leia o final do tópico 6 e o escalonamento de threads.', link: { label: 'YouTube: "multilevel feedback queue"', url: 'https://www.youtube.com/results?search_query=multilevel+feedback+queue' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'O que é um processo "bom" e um "mau"? Por que processos de E/S têm vantagem? Como a fila de último nível funciona?' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Quiz completo de escalonamento — todos os algoritmos, incluindo filas multiníveis.', link: { label: 'Claude: quiz completo tópico 6', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 8, titulo: 'Race conditions e região crítica', dia: 'Qui', data: '27/03',
    semana: 2,
    regra: { titulo: 'Regra de ouro para concorrência (tópico 7)', texto: 'Cada técnica existe porque a anterior falha. Antes de ler a solução, tente identificar qual problema ela resolve. Se conseguir prever isso, você entendeu — não decorou.' },
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "race condition explained" — procure um vídeo com animação do problema do spool. Leia o início do tópico 7.', link: { label: 'YouTube: "race condition critical section OS"', url: 'https://www.youtube.com/results?search_query=race+condition+critical+section+OS' } },
      ]},
      { tipo: 'simulacao', duracao: '30min', itens: [
        { texto: 'Feche o material e simule o problema do spool de impressão mentalmente: dois processos, o que dá errado? Depois escreva as 4 condições da região crítica com suas palavras.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça aqui um quiz sobre race conditions e as 4 condições. Peça também pra eu criar um cenário novo de concorrência pra você identificar o problema.', link: { label: 'Claude: quiz race conditions', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 9, titulo: 'Exclusão mútua: lock, Peterson, TSL', dia: 'Sex', data: '28/03',
    semana: 2,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "mutual exclusion OS". Leia as técnicas de espera ocupada no tópico 7 — foco em entender por que cada uma falha.', link: { label: 'YouTube: "mutex lock Peterson algorithm"', url: 'https://www.youtube.com/results?search_query=mutex+lock+Peterson+algorithm' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'Faça uma tabela com suas palavras: técnica / como funciona / por que falha. Esse resumo vai ser sua cola mental para a prova.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça um quiz que siga a ordem: dado o problema da variável lock, você prevê o problema? Dado a solução de Peterson, qual o próximo problema?', link: { label: 'Claude: quiz exclusão mútua em cadeia', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 10, titulo: 'Quiz revisão semanas 1 e 2', dia: 'Sáb', data: '29/03',
    semana: 2,
    etapas: [
      { tipo: 'revisao', duracao: '20min', itens: [
        { texto: 'Releia apenas os pontos que você anotou como fracos nas sessões anteriores. Não releia tudo.' },
      ]},
      { tipo: 'exercicios', duracao: '70min', itens: [
        { texto: 'Peça aqui um quiz misturando threads, todos os algoritmos de escalonamento e início de concorrência. Mínimo 15 questões. Anote tudo que errar — vira prioridade da semana 3.', link: { label: 'Claude: quiz revisão semanas 1 e 2 — 15 questões', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 11, titulo: 'Sleep/wakeup, Produtor-Consumidor, deadlock', dia: 'Seg', data: '31/03',
    semana: 3,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "producer consumer problem OS animation". Leia o tópico 7 — parte do sleep/wakeup.', link: { label: 'YouTube: "producer consumer problem deadlock"', url: 'https://www.youtube.com/results?search_query=producer+consumer+problem+deadlock' } },
      ]},
      { tipo: 'simulacao', duracao: '30min', itens: [
        { texto: 'Siga a sequência de execução do material que gera o deadlock (os 4 passos). Escreva com suas palavras por que os dois processos dormem para sempre.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Peça um quiz sobre o Produtor-Consumidor e deadlock. Foque em identificar a condição que gera o problema.', link: { label: 'Claude: quiz Produtor-Consumidor', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 12, titulo: 'Semáforos (down/up)', dia: 'Ter', data: '01/04',
    semana: 3,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "semaphore OS explained". Leia a parte de semáforos no tópico 7.', link: { label: 'YouTube: "semaphore down up sistema operacional"', url: 'https://www.youtube.com/results?search_query=semaphore+down+up+sistema+operacional' } },
        { texto: 'Silberschatz cap. 6 — Sincronização', link: { label: 'Minha Biblioteca', url: null, material: true } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'O que o semáforo resolve que o sleep/wakeup não resolvia? O que ele ainda não resolve (deadlock)? Escreva com suas palavras a diferença.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Quiz sobre semáforos com foco na lógica do down e up. Peça que eu simule uma situação de uso.', link: { label: 'Claude: quiz semáforos', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 13, titulo: 'Monitores e troca de mensagens', dia: 'Qui', data: '03/04',
    semana: 3,
    etapas: [
      { tipo: 'aquecimento', duracao: '20min', itens: [
        { texto: 'YouTube: "monitor synchronization OS". Leia o final do tópico 7 — monitores e send/receive.', link: { label: 'YouTube: "monitor vs semaphore OS"', url: 'https://www.youtube.com/results?search_query=monitor+vs+semaphore+OS' } },
      ]},
      { tipo: 'resumo', duracao: '30min', itens: [
        { texto: 'Faça uma tabela geral: todas as técnicas de sincronização, o que cada uma resolve, o que ainda falha. Esse é o resumo mais importante da unidade toda.' },
      ]},
      { tipo: 'exercicios', duracao: '40min', itens: [
        { texto: 'Quiz completo de concorrência — todas as técnicas. Peça questões que peçam comparação, não só definição.', link: { label: 'Claude: quiz completo tópico 7', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 14, titulo: 'Revisão dos pontos fracos', dia: 'Sex', data: '04/04',
    semana: 3,
    etapas: [
      { tipo: 'revisao', duracao: '30min', itens: [
        { texto: 'Pegue todos os erros anotados nas sessões anteriores. Releia APENAS esses pontos. Não revise o que você já sabe.' },
      ]},
      { tipo: 'exercicios', duracao: '60min', itens: [
        { texto: 'Me mande a lista dos tópicos onde errou mais e peço um quiz focado só nisso.', link: { label: 'Claude: quiz pontos fracos personalizados', url: null, claude: true } },
      ]},
    ],
  },
  {
    id: 15, titulo: 'Simulado final', dia: 'Sáb', data: '05/04',
    semana: 3,
    etapas: [
      { tipo: 'simulado', duracao: '90min', itens: [
        { texto: 'Peça aqui um simulado com 20 questões cobrindo toda a unidade: conceito de processo, estados, threads, todos os algoritmos de escalonamento e todas as técnicas de sincronização. Inclua pelo menos 2 questões de cálculo de escalonamento. Resolva sem olhar nada.', link: { label: 'Claude: simulado final 20 questões unidade completa', url: null, claude: true } },
      ]},
    ],
  },
]

const MATERIAIS = [
  { tipo: 'pdf', titulo: 'Silberschatz — Fundamentos de SO', subtitulo: 'Cap. 3 (Processos), Cap. 4 (Threads), Cap. 5 (Escalonamento), Cap. 6 (Sincronização)', label: 'Minha Biblioteca' },
  { tipo: 'pdf', titulo: 'Tanenbaum — Sistemas Operacionais Modernos', subtitulo: 'Cap. 2 (Processos e Threads). Fonte citada diretamente no material da faculdade.', label: 'Minha Biblioteca' },
  { tipo: 'youtube', titulo: 'Neso Academy — "Operating System" playlist', subtitulo: 'Em inglês. Melhores vídeos animados de escalonamento (FIFO, RR, SJF, SRF).', label: 'Abrir no YouTube', url: 'https://www.youtube.com/@nesoacademy' },
  { tipo: 'youtube', titulo: 'Professor Edson Moreno — "Sistemas Operacionais"', subtitulo: 'Em português. Boas explicações de processos, threads e sincronização.', label: 'Abrir no YouTube', url: 'https://www.youtube.com/results?search_query=Edson+Moreno+sistemas+operacionais' },
  { tipo: 'youtube', titulo: 'Gate Smashers — "OS scheduling"', subtitulo: 'Em inglês. Excelente para Produtor-Consumidor, semáforos e deadlock com animações.', label: 'Abrir no YouTube', url: 'https://www.youtube.com/@GateSmashers' },
  { tipo: 'claude', titulo: 'Resumo para correção', subtitulo: 'Cole seu resumo e peça: "corrija o que está errado ou incompleto e explique o que faltou".', label: 'Usar no Claude' },
  { tipo: 'claude', titulo: 'Quiz por tópico', subtitulo: 'Peça: "me faz 5 questões sobre [tópico] com nível médio, com gabarito comentado".', label: 'Usar no Claude' },
  { tipo: 'claude', titulo: 'Exercício de cálculo', subtitulo: 'Peça: "me dá 3 processos com tempos diferentes e me pede pra calcular FIFO e Round Robin com quantum 10".', label: 'Usar no Claude' },
  { tipo: 'claude', titulo: 'Dúvida pontual', subtitulo: 'Descreva exatamente onde travou: "entendi o semáforo mas não entendi por que ele não elimina deadlock".', label: 'Usar no Claude' },
]

const TIPO_CONFIG = {
  aquecimento: { label: 'Aquecimento',     color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)',  icon: '🔥' },
  resumo:      { label: 'Resumo próprio',  color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)',   border: 'rgba(79,142,247,0.2)',  icon: '✍️' },
  exercicios:  { label: 'Exercícios',      color: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)',  icon: '💪' },
  calculo:     { label: 'Cálculo próprio', color: '#c084fc', bg: 'rgba(192,132,252,0.08)',  border: 'rgba(192,132,252,0.2)', icon: '🔢' },
  simulacao:   { label: 'Simulação mental',color: '#fb923c', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.2)',  icon: '🧠' },
  revisao:     { label: 'Revisão rápida',  color: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)', icon: '🔁' },
  simulado:    { label: 'Simulado',        color: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)',  icon: '🎯' },
}

const ESTRUTURA = [
  { tipo: 'aquecimento', duracao: '20 min', desc: 'Vídeo curto + leitura do material + exemplo do livro PDF (para cálculos)' },
  { tipo: 'resumo',      duracao: '30 min', desc: 'Fecha tudo. Escreve com suas palavras. Onde travar = ponto fraco.' },
  { tipo: 'exercicios',  duracao: '40 min', desc: 'Quiz no Claude + algoritmos com dados diferentes + anota os erros.' },
]

export default function SO() {
  const [tab, setTab] = useState('cronograma')
  const [semana, setSemana] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const { milestones, toggleMilestone } = useStore()

  const sessoesSemana = SESSOES.filter(s => s.semana === semana)

  function toggleExpand(id) {
    setExpanded(v => v === id ? null : id)
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(79,142,247,0.12)', color: '#4f8ef7' }}>SO</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Sistemas Operacionais</h1>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>Cronograma de 15 sessões · 3 semanas · 17/03 → 05/04</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['cronograma','📅 Cronograma'], ['estrutura','⚙️ Estrutura da Sessão'], ['materiais','📚 Materiais']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: tab === k ? 'none' : '1px solid var(--border)',
            background: tab === k ? '#4f8ef7' : 'transparent',
            color: tab === k ? '#fff' : 'var(--text2)',
            transition: 'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {/* ── Cronograma ── */}
      {tab === 'cronograma' && (
        <div>
          {/* Semana selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[1, 2, 3].map(s => (
              <button key={s} onClick={() => setSemana(s)} style={{
                padding: '6px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: semana === s ? 'none' : '1px solid var(--border)',
                background: semana === s ? 'rgba(79,142,247,0.15)' : 'transparent',
                color: semana === s ? '#4f8ef7' : 'var(--text3)',
                transition: 'all 0.15s',
              }}>Semana {s}</button>
            ))}
          </div>

          {/* Progresso da semana */}
          <div style={{ marginBottom: 16 }}>
            {(() => {
              const total = sessoesSemana.length
              const done = sessoesSemana.filter(s => milestones[`so-s${s.id}`]).length
              const pct = total ? Math.round(done / total * 100) : 0
              return (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Progresso — Semana {semana}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#4f8ef7' }}>{done}/{total} sessões</span>
                    </div>
                    <div style={{ background: 'var(--bg4)', borderRadius: 99, height: 6 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#4f8ef7', borderRadius: 99, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#4f8ef7' }}>{pct}%</span>
                </div>
              )
            })()}
          </div>

          {/* Sessões */}
          {sessoesSemana.map(s => {
            const isOpen = expanded === s.id
            const isDone = !!milestones[`so-s${s.id}`]
            return (
              <div key={s.id} style={{ marginBottom: 10 }}>
                {/* Regra de ouro */}
                {s.regra && (
                  <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 8, display: 'flex', gap: 10 }}>
                    <span>💡</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', marginBottom: 3 }}>{s.regra.titulo}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{s.regra.texto}</div>
                    </div>
                  </div>
                )}

                {/* Card da sessão */}
                <div style={{ background: 'var(--bg2)', border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden' }}>
                  {/* Header clicável */}
                  <div onClick={() => toggleExpand(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}>
                    {/* Checkbox */}
                    <div onClick={e => { e.stopPropagation(); toggleMilestone(`so-s${s.id}`) }}
                      style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: isDone ? 'none' : '2px solid var(--border2)', background: isDone ? '#34d399' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      {isDone && <span style={{ color: '#0f1117', fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>Sessão {s.id}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: 'rgba(79,142,247,0.12)', color: '#4f8ef7' }}>{s.dia} {s.data}</span>
                        <span style={{ fontSize: 10, color: 'var(--text3)' }}>1h30</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? 'var(--text3)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>{s.titulo}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>

                  {/* Etapas expandidas */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {s.etapas.map((e, ei) => {
                        const cfg = TIPO_CONFIG[e.tipo] || TIPO_CONFIG.aquecimento
                        return (
                          <div key={ei} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <span>{cfg.icon}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</span>
                              <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>{e.duracao}</span>
                            </div>
                            {e.itens.map((item, ii) => (
                              <div key={ii} style={{ marginBottom: ii < e.itens.length - 1 ? 8 : 0 }}>
                                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, margin: 0, marginBottom: item.link ? 6 : 0 }}>{item.texto}</p>
                                {item.link && (
                                  item.link.url
                                    ? <a href={item.link.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: item.link.claude ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.06)', color: item.link.claude ? '#4f8ef7' : 'var(--text2)', textDecoration: 'none', border: '1px solid var(--border)' }}>
                                        {item.link.claude ? '🤖' : item.link.material ? '📄' : '▶'} {item.link.label}
                                      </a>
                                    : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: item.link.claude ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.06)', color: item.link.claude ? '#4f8ef7' : 'var(--text2)', border: '1px solid var(--border)' }}>
                                        {item.link.claude ? '🤖' : '📄'} {item.link.label}
                                      </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Estrutura da Sessão ── */}
      {tab === 'estrutura' && (
        <div>
          <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4f8ef7', marginBottom: 6 }}>⏱ Toda sessão: 1h30 — sempre na mesma ordem</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>Não pula etapas — cada uma prepara a próxima.</div>
          </div>

          {ESTRUTURA.map((e, i) => {
            const cfg = TIPO_CONFIG[e.tipo]
            return (
              <div key={i} style={{ background: 'var(--bg2)', border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cfg.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{e.duracao}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
                {e.tipo === 'aquecimento' && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.7 }}>
                    1. Assista um vídeo curto do YouTube sobre o tópico do dia (10 min)<br/>
                    2. Leia o trecho correspondente no material da faculdade<br/>
                    3. Para tópicos de cálculo, leia também o exemplo do livro PDF
                  </div>
                )}
                {e.tipo === 'resumo' && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.7 }}>
                    1. Fecha tudo. Escreve com suas palavras o que entendeu<br/>
                    2. Use papel ou escreva aqui no chat comigo<br/>
                    3. Onde travar = ponto fraco. Anota e relê só esse trecho
                  </div>
                )}
                {e.tipo === 'exercicios' && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.7 }}>
                    1. Peça quiz aqui no Claude sobre o tópico do dia<br/>
                    2. Para algoritmos: resolva os exemplos do material com dados diferentes<br/>
                    3. Anote os erros — eles viram a revisão da semana seguinte
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Materiais ── */}
      {tab === 'materiais' && (
        <div>
          {[
            { grupo: 'Livros (PDF)', tipos: ['pdf'] },
            { grupo: 'YouTube', tipos: ['youtube'] },
            { grupo: 'Como usar o Claude', tipos: ['claude'] },
          ].map(({ grupo, tipos }) => (
            <div key={grupo} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{grupo}</p>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 14px' }}>
                {MATERIAIS.filter(m => tipos.includes(m.tipo)).map((m, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>
                      {m.tipo === 'pdf' ? '📄' : m.tipo === 'youtube' ? '▶️' : '🤖'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{m.titulo}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>{m.subtitulo}</div>
                    </div>
                    {m.url && (
                      <a href={m.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', textDecoration: 'none', border: '1px solid rgba(79,142,247,0.2)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {m.label} ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
