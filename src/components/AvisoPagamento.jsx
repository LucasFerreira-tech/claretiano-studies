import { useState } from 'react'
import { useStore } from '../store/store'

export default function AvisoPagamento() {
  const { payments, addPayment, deletePayment, getActivePaymentReminders } = useStore()
  const [nome, setNome] = useState('')
  const reminders = getActivePaymentReminders()

  function handleAdd() {
    const n = nome.trim()
    if (!n) return
    addPayment(n)
    setNome('')
  }

  return (
    <div>
      {/* Lembretes ativos (dias 1-8) */}
      {reminders.map(p => (
        <div
          key={p.id}
          style={{
            background:'rgba(248,113,113,0.08)',
            border:'1px solid rgba(248,113,113,0.25)',
            borderRadius:10, padding:'10px 14px', marginBottom:10,
            display:'flex', gap:10, alignItems:'center',
          }}
        >
          <span style={{ fontSize:18 }}>⚠</span>
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:600, color:'#f87171' }}>Lembrete de pagamento:</span>
            <span style={{ fontSize:12, color:'var(--text2)', marginLeft:6 }}>
              {p.name} deve ser pago entre os dias 1 e 8 deste mês.
            </span>
          </div>
        </div>
      ))}

      {/* Gerenciar pagamentos */}
      <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>
        Pagamentos Mensais
      </p>

      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome do pagamento..."
          style={{
            flex:1, background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:7, padding:'6px 10px', fontSize:12, color:'var(--text)',
            outline:'none',
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

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'4px 14px', minHeight:44 }}>
        {payments.length === 0 ? (
          <p style={{ fontSize:12, color:'var(--text3)', padding:'10px 0', textAlign:'center' }}>
            Nenhum pagamento cadastrado
          </p>
        ) : payments.map((p, i) => (
          <div
            key={p.id}
            style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'8px 0',
              borderBottom: i < payments.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{
                fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:20,
                background:'rgba(251,146,60,0.12)', color:'#fb923c',
              }}>
                Mensal
              </span>
              <span style={{ fontSize:12, color:'var(--text)' }}>{p.name}</span>
            </div>
            <button
              onClick={() => deletePayment(p.id)}
              style={{
                background:'transparent', border:'none', cursor:'pointer',
                color:'var(--text3)', fontSize:14, padding:'0 2px', lineHeight:1,
              }}
              title="Remover pagamento"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
