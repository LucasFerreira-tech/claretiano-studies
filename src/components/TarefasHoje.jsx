import { useState } from 'react'
import { useStore } from '../store/store'
import { today } from '../utils'

export default function TarefasHoje() {
  const { addTask, toggleTask, deleteTask, getTodayTasks } = useStore()
  const [titulo, setTitulo] = useState('')
  const [data, setData] = useState(today())
  const tasks = getTodayTasks()

  function handleAdd() {
    const t = titulo.trim()
    if (!t) return
    addTask(t, data)
    setTitulo('')
    setData(today())
  }

  return (
    <div>
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>
        Tarefas de Hoje
      </p>

      {/* Input nova tarefa */}
      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nova tarefa..."
          style={{
            flex:1, background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:7, padding:'6px 10px', fontSize:12, color:'var(--text)',
            outline:'none',
          }}
        />
        <input
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
          style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:7, padding:'6px 8px', fontSize:12, color:'var(--text)',
            outline:'none', cursor:'pointer',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background:'var(--accent)', color:'#fff', border:'none',
            borderRadius:7, padding:'6px 14px', fontSize:12, fontWeight:600,
            cursor:'pointer',
          }}
        >
          +
        </button>
      </div>

      {/* Lista de tarefas */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px', minHeight:44 }}>
        {tasks.length === 0 ? (
          <p style={{ fontSize:12, color:'var(--text3)', padding:'10px 0', textAlign:'center' }}>
            Nenhuma tarefa para hoje
          </p>
        ) : tasks.map((t, i) => (
          <div
            key={t.id}
            style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'8px 0',
              borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
              gap:10,
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
                style={{ cursor:'pointer', accentColor:'var(--accent)', flexShrink:0 }}
              />
              <span style={{
                fontSize:12, color: t.done ? 'var(--text3)' : 'var(--text)',
                textDecoration: t.done ? 'line-through' : 'none',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {t.title}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <span style={{
                fontSize:10, padding:'2px 6px', borderRadius:20,
                background: t.done ? 'rgba(52,211,153,0.12)' : 'rgba(251,146,60,0.12)',
                color: t.done ? '#34d399' : '#fb923c',
                fontWeight:600,
              }}>
                {t.done ? 'Concluída' : 'Pendente'}
              </span>
              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  background:'transparent', border:'none', cursor:'pointer',
                  color:'var(--text3)', fontSize:14, padding:'0 2px',
                  lineHeight:1,
                }}
                title="Excluir tarefa"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
