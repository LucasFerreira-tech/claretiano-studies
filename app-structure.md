# AcadêmicoPlan — Estrutura do Aplicativo

## Stack tecnológica
- **Framework**: React 18 + Vite
- **Estilização**: Tailwind CSS
- **Estado**: Zustand (leve, sem Redux)
- **Persistência**: localStorage (GitHub Pages = sem backend)
- **Roteamento**: React Router v6
- **Deploy**: GitHub Pages via gh-pages

---

## Estrutura de pastas

```
academic-planner/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   ├── academicData.js      ← dados estáticos (ciclos, disciplinas, portfólios)
│   │   ├── schedule.js          ← grade semanal
│   │   └── reminders.js         ← mensalidade, eventos recorrentes
│   ├── store/
│   │   ├── useTaskStore.js      ← tarefas, checkboxes, progresso
│   │   ├── useReviewStore.js    ← revisão espaçada (D1/D3/D7/D30)
│   │   └── usePortfolioStore.js ← progresso dos portfólios
│   ├── pages/
│   │   ├── Dashboard.jsx        ← visão geral, progresso, próximos eventos
│   │   ├── Calendar.jsx         ← calendário mensal com todos eventos
│   │   ├── WeekView.jsx         ← cronograma semanal detalhado
│   │   ├── Cycles.jsx           ← conteúdo por ciclo + questões online
│   │   ├── Portfolios.jsx       ← controle de portfólios com milestones
│   │   ├── Reviews.jsx          ← revisões espaçadas pendentes
│   │   └── Exams.jsx            ← preparação para provas
│   ├── components/
│   │   ├── TaskCard.jsx
│   │   ├── DisciplineBadge.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── MensalidadeAlert.jsx ← alerta recorrente visível
│   │   ├── ReviewQueue.jsx      ← fila de revisões D1/D3/D7/D30
│   │   └── Navbar.jsx
│   ├── hooks/
│   │   ├── useSpacedRepetition.js
│   │   └── useDeadlineAlert.js
│   └── App.jsx
└── package.json
```

---

## Páginas e funcionalidades

### 1. Dashboard
- Cards de métricas: ciclo atual, portfólios em andamento, revisões pendentes, próxima prova
- Alerta de mensalidade (D1 a D8 de cada mês) — destaque vermelho
- Lista dos próximos 7 dias com tarefas
- Progresso geral do semestre (barra)
- Botão: "Marcar tópico como estudado" → dispara revisões espaçadas

### 2. Calendário
- Visão mensal
- Cores por tipo: estudo, revisão, entrega, prova, programação, mensalidade
- Clique no dia → mostra tarefas detalhadas
- Lembrete de mensalidade aparece nos dias 1–8 com ícone de aviso

### 3. Cronograma Semanal (WeekView)
- Grade seg–sáb com blocos de horário
- 07:50 Matéria 1 | 09:20 Bíblico | 09:40 Matéria 2 | tarde Programação
- Jovem Aprendiz: Ter + Qui à tarde
- Sábado: revisão + portfólio
- Bloco de programação fixo todos os dias úteis a partir de 16/03

### 4. Ciclos (Cycles)
- Seletor de ciclo
- Lista de tópicos com checkbox por disciplina
- Status das questões online (data de vencimento em destaque)
- Ao marcar tópico → cria automaticamente revisões D1/D3/D7/D30
- Revisão progressiva de ciclos: C1 → C1+C2 → etc.

### 5. Portfólios
- Card de cada portfólio com:
  - barra de progresso
  - milestones com checkbox
  - dias restantes para o prazo
  - alerta quando < 7 dias

### 6. Revisões (Reviews)
- Fila estilo Anki: tópicos com revisão pendente hoje
- Botão "Feito" → agenda próxima revisão
- Botão "Difícil" → reagenda para amanhã
- Histórico de revisões concluídas
- Revisões de ciclo completo programadas

### 7. Provas (Exams)
- Timeline de preparação por prova
- Checklist de conteúdo por ciclo
- Countdown até a prova
- Alerta especial: Prova 2 é presencial — confirmar polo

---

## Tipos de tarefas (TaskType enum)

```js
const TASK_TYPES = {
  STUDY:        'study',        // sessão de estudo normal
  REVIEW_D1:    'review_d1',    // revisão D+1
  REVIEW_D3:    'review_d3',    // revisão D+3
  REVIEW_D7:    'review_d7',    // revisão D+7
  REVIEW_D30:   'review_d30',   // revisão D+30
  REVIEW_CYCLE: 'review_cycle', // revisão de ciclo completo
  PORTFOLIO:    'portfolio',    // etapa de portfólio
  QUESTIONS:    'questions',    // questões online
  EXAM_PREP:    'exam_prep',    // preparação para prova
  EXAM:         'exam',         // prova
  PROGRAMMING:  'programming',  // bloco fixo de programação
  JA_STUDY:     'ja_study',     // estudo Jovem Aprendiz
  MENSALIDADE:  'mensalidade',  // lembrete de mensalidade
  BIBLICAL:     'biblical',     // estudo bíblico
  INTERVIEW:    'interview'     // entrevista Jovem Aprendiz
}
```

---

## Schema do banco de dados (localStorage)

```js
// tasks
{
  id: "uuid",
  type: TASK_TYPES.*,
  title: "string",
  disciplineId: "SO|DPE|AMT|ANT|null",
  cycleId: "C1|C2|...|null",
  date: "YYYY-MM-DD",
  time: "HH:MM",
  duration: 90, // minutos
  completed: false,
  createdAt: "ISO8601",
  completedAt: "ISO8601|null",
  parentTopicId: "uuid|null" // para revisões espaçadas
}

// topics (tópicos estudados — dispara revisões)
{
  id: "uuid",
  disciplineId: "SO",
  cycleId: "C2",
  title: "Processos e threads",
  studiedAt: "YYYY-MM-DD",
  reviews: {
    d1:  { scheduled: "YYYY-MM-DD", done: false },
    d3:  { scheduled: "YYYY-MM-DD", done: false },
    d7:  { scheduled: "YYYY-MM-DD", done: false },
    d30: { scheduled: "YYYY-MM-DD", done: false }
  }
}

// portfolios_progress
{
  portfolioId: "PORT-ANT",
  milestones: {
    "2026-03-16": { done: false },
    "2026-03-24": { done: false },
    ...
  },
  notes: "string",
  progressPercent: 0
}

// settings
{
  studyStartTime: "07:50",
  biblicalBreakTime: "09:20",
  biblicalDuration: 20,
  programmingTime: "13:00",
  programmingDays: ["mon","tue","wed","thu","fri"],
  programmingStart: "2026-03-16"
}
```

---

## Lógica de revisão espaçada

```js
function scheduleReviews(topicId, studiedDate) {
  const d = new Date(studiedDate)
  return [
    { type: 'review_d1',  date: addDays(d, 1)  },
    { type: 'review_d3',  date: addDays(d, 3)  },
    { type: 'review_d7',  date: addDays(d, 7)  },
    { type: 'review_d30', date: addDays(d, 30) }
  ]
}
// Ao marcar tópico como estudado → cria 4 tasks automaticamente
// Cada task aparece na fila de revisões no dia correto
```

---

## Lógica de mensalidade recorrente

```js
function getMensalidadeAlerts(year, month) {
  // Retorna true para dias 1-8 de cada mês
  // Exibe banner vermelho no Dashboard e no Calendar
  return { active: day >= 1 && day <= 8, label: "⚠ Pagamento da Mensalidade da Faculdade" }
}
```

---

## Eventos especiais integrados

| Data | Evento | Tipo |
|------|--------|------|
| 14/03 | Prep entrevista: comunicação profissional | ja_study |
| 15/03 | Prep entrevista: Excel + rotinas adm. | ja_study |
| 16/03 | Simulação de entrevista | interview |
| 17/03 | ENTREVISTA Jovem Aprendiz | interview |
| 16/03→ | Programação diária (tarde) — início | programming |
| D1-D8/mês | Alerta mensalidade | mensalidade |

