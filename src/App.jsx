import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Semana from './pages/Semana'
import Ciclos from './pages/Ciclos'
import Portfolios from './pages/Portfolios'
import Revisoes from './pages/Revisoes'
import Provas from './pages/Provas'

const NAV = [
  { to: '/',           icon: '◈', label: 'Dashboard' },
  { to: '/semana',     icon: '⬚', label: 'Semana' },
  { to: '/ciclos',     icon: '◎', label: 'Ciclos' },
  { to: '/portfolios', icon: '▤', label: 'Portfólios' },
  { to: '/revisoes',   icon: '↻', label: 'Revisões' },
  { to: '/provas',     icon: '◆', label: 'Provas' },
]

const S = {
  app:     { display:'flex', height:'100vh', overflow:'hidden' },
  sidebar: { width:210, flexShrink:0, background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'16px 0' },
  logo:    { padding:'0 18px 16px', borderBottom:'1px solid var(--border)', marginBottom:8 },
  logoT:   { fontSize:15, fontWeight:700, color:'var(--text)', letterSpacing:'-0.02em' },
  logoS:   { fontSize:11, color:'var(--text3)', marginTop:2 },
  navSec:  { fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'12px 18px 4px' },
  main:    { flex:1, overflowY:'auto', padding:'24px 28px' },
}

function Sidebar() {
  return (
    <div style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoT}>AcadêmicoPlan</div>
        <div style={S.logoS}>ADS · Claretiano 2026</div>
      </div>
      <div style={S.navSec}>Principal</div>
      {NAV.slice(0,3).map(n => <NavItem key={n.to} {...n} />)}
      <div style={S.navSec}>Trabalhos</div>
      {NAV.slice(3).map(n => <NavItem key={n.to} {...n} />)}
    </div>
  )
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink to={to} end={to==='/'} style={({ isActive }) => ({
      display:'flex', alignItems:'center', gap:10, padding:'8px 18px',
      textDecoration:'none', fontSize:13, transition:'all 0.12s',
      color: isActive ? 'var(--accent)' : 'var(--text2)',
      background: isActive ? 'rgba(79,142,247,0.08)' : 'transparent',
      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
      fontWeight: isActive ? 600 : 400,
    })}>
      <span style={{ fontSize:14, width:18, textAlign:'center' }}>{icon}</span>
      {label}
    </NavLink>
  )
}


// ── Simulador de data (só para testes) ───────────────────────
// Carrega do localStorage ao iniciar
if (localStorage.getItem('__FAKE_TODAY')) {
  window.__FAKE_TODAY = localStorage.getItem('__FAKE_TODAY')
}

function DateSimulator() {
  const realToday = new Date().toISOString().split('T')[0]
  const [open, setOpen] = useState(false)
  const [fakeDate, setFakeDate] = useState(window.__FAKE_TODAY || '')

  function apply(date) {
    if (date && date !== realToday) {
      window.__FAKE_TODAY = date
      localStorage.setItem('__FAKE_TODAY', date)
    } else {
      delete window.__FAKE_TODAY
      localStorage.removeItem('__FAKE_TODAY')
    }
    setFakeDate(date)
    window.location.reload()
  }

  const isActive = !!window.__FAKE_TODAY

  return (
    <div style={{ position:'fixed', bottom:16, right:16, zIndex:9999 }}>
      {open && (
        <div style={{
          background:'var(--bg2)', border:`1px solid ${isActive?'rgba(251,191,36,0.5)':'var(--border)'}`,
          borderRadius:12, padding:'14px', marginBottom:8, width:240,
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>
            🧪 Simulador de data
          </div>
          <input
            type="date"
            value={fakeDate || realToday}
            onChange={e => setFakeDate(e.target.value)}
            style={{
              width:'100%', background:'var(--bg3)', border:'1px solid var(--border)',
              borderRadius:7, padding:'6px 10px', fontSize:13, color:'var(--text)',
              outline:'none', marginBottom:8,
            }}
          />
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => apply(fakeDate)} style={{
              flex:2, padding:'7px', borderRadius:7, border:'none',
              background:'var(--accent)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer',
            }}>Aplicar</button>
            <button onClick={() => apply('')} style={{
              flex:1, padding:'7px', borderRadius:7,
              border:'1px solid var(--border)', background:'transparent',
              color:'var(--text3)', fontSize:12, cursor:'pointer',
            }}>Reset</button>
          </div>
          {isActive && (
            <div style={{ marginTop:8, fontSize:11, color:'#fbbf24', textAlign:'center' }}>
              ⚠ Data simulada ativa
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width:40, height:40, borderRadius:'50%', border:'none', cursor:'pointer',
          background: isActive ? '#fbbf24' : 'var(--bg3)',
          color: isActive ? '#0a0d14' : 'var(--text2)',
          fontSize:18, display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
          transition:'all 0.15s',
        }}
        title="Simulador de data"
      >
        🗓
      </button>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div style={S.app}>
        <Sidebar />
        <div style={S.main}>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/semana"     element={<Semana />} />
            <Route path="/ciclos"     element={<Ciclos />} />
            <Route path="/portfolios" element={<Portfolios />} />
            <Route path="/revisoes"   element={<Revisoes />} />
            <Route path="/provas"     element={<Provas />} />
          </Routes>
        </div>
      </div>
    <DateSimulator />
    </HashRouter>
  )
}
