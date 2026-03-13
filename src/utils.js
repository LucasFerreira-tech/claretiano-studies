export const DISC = {
  SO:  { color:'#4f8ef7', bg:'rgba(79,142,247,0.12)'  },
  DPE: { color:'#34d399', bg:'rgba(52,211,153,0.12)'  },
  AMT: { color:'#c084fc', bg:'rgba(192,132,252,0.12)' },
  ANT: { color:'#fb923c', bg:'rgba(251,146,60,0.12)'  },
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const t = new Date(today()); t.setHours(0,0,0,0)
  return Math.ceil((new Date(dateStr) - t) / 86400000)
}

export function fmt(dateStr) {
  if (!dateStr) return ''
  const [y,m,d] = dateStr.split('-')
  return `${d}/${m}`
}

export function fmtFull(dateStr) {
  if (!dateStr) return ''
  const [y,m,d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function daysColor(days) {
  if (days === null) return '#5a6278'
  if (days < 0)  return '#5a6278'
  if (days <= 7) return '#f87171'
  if (days <=21) return '#fbbf24'
  return '#34d399'
}

// ── Data simulada (apenas para testes) ──────────────────────
// Defina window.__FAKE_TODAY = 'YYYY-MM-DD' para simular outra data
export function today() {
  if (typeof window !== 'undefined' && window.__FAKE_TODAY) {
    return window.__FAKE_TODAY
  }
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr); d.setDate(d.getDate()+n)
  return d.toISOString().split('T')[0]
}

export function currentCycle(cycles) {
  const t = today()
  return cycles.find(c => t >= c.start && t <= c.end) || cycles[1]
}

export function isMensalidade() {
  return new Date().getDate() <= 8
}
