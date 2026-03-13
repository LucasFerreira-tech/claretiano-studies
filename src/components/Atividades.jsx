import { useState } from 'react'
import { useStore } from '../store/store'

const DISC_OPTIONS = ['SO', 'DPE', 'AMT', 'ANT', 'Geral']
const CYCLE_OPTIONS = ['C1', 'C2', 'C3', 'C4', 'C5']

const DISC_COLORS = {
  SO:    { color: '#4f8ef7', bg: 'rgba(79,142,247,0.12)'  },
  DPE:   { color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  AMT:   { color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  ANT:   { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  Geral: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
}

// Ciclo atual padrão baseado na data
function getCurrentCycle() {
  const today = new Date().toISOString().split('T')[0]
  if (today <= '2026-03-08') return 'C1'
  if (today <= '2026-04-05') return 'C2'
  if (today <= '2026-05-03') return 'C3'
  if (today <= '2026-05-31') return 'C4'
  return 'C5'
}

export default function Atividades() {
  const { activities, addActivity, toggleActivity, deleteActivity } = useStore()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [materia, setMateria] = useState('SO')
  const [ciclo, setCiclo] = useState(getCurrentCycle())
  const [showForm, setShowForm] = useState(false)

  const pending = activities.filter(a => !a.done)
  const done    = activities.filter(a => a.done)

  function handleAdd() {
    if (!titulo.trim()) return
    addActivity(titulo.trim(), descricao.trim(), materia, ciclo)
    setTitulo('')
    setDescricao('')
    setMateria('SO')
    setCiclo(getCurrentCycle())
    setShowForm(false)
  }

  function ActivityRow({ a, i, arr }) {
    const disc = DISC_COLORS[a.subject] || DISC_COLORS.Geral
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
        borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
        opacity: a.done ? 0.6 : 1,
      }}>
        <input
          type="checkbox"
          checked={a.done}
          onChange={() => toggleActivity(a.id)}
          style={{ cursor: 'pointer', accentColor: 'var(--accent)', marginTop: 2, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, flexWrap: 'wrap' }}>
            {/* Badge disciplina */}
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
              background: disc.bg, color: disc.color, flexShrink: 0,
            }}>{a.subject}</span>
            {/* Badge ciclo */}
            {a.cycle && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                background: 'var(--bg4)', color: 'var(--text2)', flexShrink: 0,
              }}>{a.cycle}</span>
            )}
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'var(--text)',
              textDecoration: a.done ? 'line-through' : 'none',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{a.title}</span>
          </div>
          {a.description && (
            <p style={{ fontSize: 11, color: 'var(--text3)', margin: 0, lineHeight: 1.4 }}>
              {a.description}
            </p>
          )}
          {/* Aviso de revisão ao concluir */}
          {a.done && a.subject !== 'Geral' && (
            <p style={{ fontSize: 10, color: '#34d399', margin: '3px 0 0', fontWeight: 600 }}>
              ✓ Revisões agendadas automaticamente
            </p>
          )}
        </div>
        <button
          onClick={() => deleteActivity(a.id)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text3)', fontSize: 14, padding: '0 2px', lineHeight: 1, flexShrink: 0,
          }}
          title="Excluir atividade"
        >×</button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
          Atividades de Estudo
          {pending.length > 0 && (
            <span style={{
              background: 'rgba(251,146,60,0.15)', color: '#fb923c',
              fontSize: 10, padding: '1px 6px', borderRadius: 20, marginLeft: 6, fontWeight: 700,
            }}>{pending.length}</span>
          )}
        </p>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancelar' : '+ Nova'}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px', marginBottom: 10,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título da atividade / pergunta..."
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '6px 10px', fontSize: 12, color: 'var(--text)', outline: 'none',
            }}
          />
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição ou enunciado (opcional)..."
            rows={2}
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '6px 10px', fontSize: 12, color: 'var(--text)',
              outline: 'none', resize: 'vertical', fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={materia}
              onChange={e => setMateria(e.target.value)}
              style={{
                flex: 2, background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '6px 10px', fontSize: 12, color: 'var(--text)', outline: 'none',
              }}
            >
              {DISC_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={ciclo}
              onChange={e => setCiclo(e.target.value)}
              style={{
                flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '6px 10px', fontSize: 12, color: 'var(--text)', outline: 'none',
              }}
            >
              {CYCLE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={handleAdd}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 6, padding: '6px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >Salvar</button>
          </div>
          {materia !== 'Geral' && (
            <p style={{ fontSize: 10, color: 'var(--text3)', margin: 0 }}>
              💡 Ao concluir, revisões serão agendadas automaticamente para os próximos dias de aula de <strong style={{ color: DISC_COLORS[materia]?.color }}>{materia}</strong>
            </p>
          )}
        </div>
      )}

      {/* Pendentes */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 14px', minHeight: 44 }}>
        {pending.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text3)', padding: '10px 0', textAlign: 'center' }}>
            Nenhuma atividade pendente
          </p>
        ) : pending.map((a, i, arr) => <ActivityRow key={a.id} a={a} i={i} arr={arr} />)}
      </div>

      {/* Concluídas */}
      {done.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>
            Concluídas ({done.length})
          </p>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 14px' }}>
            {done.map((a, i, arr) => <ActivityRow key={a.id} a={a} i={i} arr={arr} />)}
          </div>
        </div>
      )}
    </div>
  )
}
