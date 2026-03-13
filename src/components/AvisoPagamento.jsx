import { useStore } from '../store/store'

export default function AvisoPagamento() {
  const { isPaymentPeriod } = useStore()

  if (!isPaymentPeriod()) return null

  return (
    <div style={{
      background: 'rgba(248,113,113,0.08)',
      border: '1px solid rgba(248,113,113,0.25)',
      borderRadius: 10, padding: '10px 14px', marginBottom: 18,
      display: 'flex', gap: 10, alignItems: 'center',
    }}>
      <span style={{ fontSize: 18 }}>⚠</span>
      <div>
        <span style={{ fontWeight: 600, color: '#f87171' }}>Aviso de pagamento:</span>
        <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 8 }}>
          verifique seus pagamentos do início do mês.
        </span>
      </div>
    </div>
  )
}
