import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import GlassCard from '../common/GlassCard'

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M3 7l5-4h8l5 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
        <path d="M8 21V12h8v9" />
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Track active index for sliding pill
  const activeIndex = NAV_ITEMS.findIndex(item => location.pathname.startsWith(item.path))
  
  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'U'
  const avatarColor = `hsl(${([...(user?.name || '')].reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 55%, 52%)`

  const logoGradient = 'linear-gradient(135deg, #6366f1, #a855f7)'

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* ── Sidebar (desktop only) ── */}
      <aside
        className={`hidden md:flex flex-shrink-0 flex-col h-full relative z-10 overflow-visible transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[80px]' : 'w-[260px]'
        }`}
      >
        <div className={`absolute inset-0 glass !border-y-0 !border-l-0 !rounded-none border-r border-white/10 bg-gradient-to-b from-[#0F0F17]/80 to-[#0A0A12]/90`}>
          {/* Glowing bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-500 opacity-30 shadow-[0_-2px_10px_rgba(99,102,241,0.8)]" />
        </div>
        
        <div className="relative h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-4 px-6 py-6 border-b border-white/[0.06]">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30"
              style={{ background: logoGradient }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
                Zen<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Task</span>
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 relative overflow-y-auto overflow-x-hidden">
            {/* Animated Pill Background Indicator */}
            {activeIndex >= 0 && (
              <div 
                className="absolute left-4 right-4 h-11 bg-indigo-500/15 border border-indigo-500/20 rounded-xl transition-all duration-300 ease-in-out pointer-events-none"
                style={{ top: `${24 + activeIndex * 48}px` }}
              />
            )}

            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-4 px-3 h-11 mb-1 rounded-xl transition-all duration-200 relative group z-10 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-300'
                  }`}
                >
                  <div className={`relative flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''}`}>
                    {item.icon}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    )}
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <span className="font-medium whitespace-nowrap group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div className="px-4 pb-6 pt-4 space-y-2 border-t border-white/[0.06]">
            {/* User info + logout */}
            <div className="flex items-center gap-4 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-md"
                style={{ background: avatarColor }}
              >
                {avatarLetter}
              </div>
              <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-indigo-500/80 border border-white/20 flex items-center justify-center text-white hover:bg-indigo-400 transition-colors z-20 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 transition-transform duration-300"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative z-0">
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 glass !border-x-0 !border-b-0 !rounded-none border-t border-white/[0.06] flex flex-row items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative ${
                isActive ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-indigo-500/10 rounded-xl" />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </NavLink>
          );
        })}

      </nav>
    </div>
  )
}
