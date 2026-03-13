import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Semana from './pages/Semana'
import Ciclos from './pages/Ciclos'
import Portfolios from './pages/Portfolios'
import Revisoes from './pages/Revisoes'
import Provas from './pages/Provas'

const NAV = [
  { to: '/',           icon: '◈', label: 'Início' },
  { to: '/ciclos',     icon: '◎', label: 'Ciclos' },
  { to: '/revisoes',   icon: '↻', label: 'Revisões' },
  { to: '/portfolios', icon: '▤', label: 'Trabalhos' },
  { to: '/provas',     icon: '◆', label: 'Provas' },
]

const NAV_DESKTOP = [
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
      {NAV_DESKTOP.slice(0,3).map(n => <NavItem key={n.to} {...n} />)}
      <div style={S.navSec}>Trabalhos</div>
      {NAV_DESKTOP.slice(3).map(n => <NavItem key={n.to} {...n} />)}
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

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV.map(n => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <div className="nav-dot" />
          <span className="nav-icon">{n.icon}</span>
          <span>{n.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      {/* ── Desktop ── */}
      <div className="desktop-layout" style={S.app}>
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

      {/* ── Mobile ── */}
      <div className="mobile-layout">
        <div className="mobile-scroll">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/semana"     element={<Semana />} />
            <Route path="/ciclos"     element={<Ciclos />} />
            <Route path="/portfolios" element={<Portfolios />} />
            <Route path="/revisoes"   element={<Revisoes />} />
            <Route path="/provas"     element={<Provas />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  )
}
