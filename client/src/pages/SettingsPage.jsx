import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import toast from 'react-hot-toast'
import GlassCard from '../components/common/GlassCard'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full space-y-6">
      <div className="animate-[fadeUp_0.6s_ease-out]">
        <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <GlassCard
        className="space-y-4 p-5 stagger-card"
        style={{ '--delay': '0ms' }}
      >
        <h2 className="font-display font-semibold text-base text-white border-b border-white/10 pb-3 mb-4">Profile</h2>
        <div className="flex items-center gap-5">
          <Avatar name={user?.name || 'User'} size="xl" />
          <div className="flex-1">
            <p className="font-display font-semibold text-lg text-white">{user?.name}</p>
            <p className="text-sm text-slate-400 mt-0.5">{user?.email || 'No email on record'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${user?.role === 'admin' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-slate-500/15 text-slate-400'} capitalize`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'admin' ? 'bg-indigo-400' : 'bg-slate-400'}`} />
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              className="input-field"
              value={user?.name || ''}
              readOnly
              title="Contact admin to change name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
            <input
              className="input-field capitalize"
              value={user?.role || ''}
              readOnly
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Profile changes require admin action. Contact your administrator.</p>
      </GlassCard>

      {/* Account info */}
      <GlassCard
        className="space-y-3 p-5 stagger-card"
        style={{ '--delay': '200ms' }}
      >
        <h2 className="font-display font-semibold text-base text-white border-b border-white/10 pb-3">Account</h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-white">JWT Authentication</p>
            <p className="text-xs text-slate-400 mt-0.5">Session secured with JSON Web Token</p>
          </div>
          <span className="badge bg-emerald-500/15 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            Active
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-white/10">
          <div>
            <p className="text-sm font-medium text-white">Role</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.role === 'admin' ? 'Full access to all projects and tasks' : 'View and update assigned tasks'}</p>
          </div>
          <span className={`badge capitalize ${user?.role === 'admin' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-slate-500/15 text-slate-400'}`}>
            {user?.role}
          </span>
        </div>
      </GlassCard>

      {/* Danger zone */}
      <GlassCard
        className="space-y-3 p-5 border-red-500/20 stagger-card"
        style={{ '--delay': '300ms' }}
      >
        <h2 className="font-display font-semibold text-base text-red-400 border-b border-red-500/10 pb-3">Session</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign out</p>
            <p className="text-xs text-slate-400 mt-0.5">You'll be redirected to the login page</p>
          </div>
          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="btn-danger flex items-center gap-2 text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setConfirmLogout(false)} className="btn-ghost text-sm">Cancel</button>
              <button onClick={handleLogout} className="btn-danger text-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Confirm
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
