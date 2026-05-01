import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { Skeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'
import GlassCard from '../components/common/GlassCard'

function AddMemberModal({ isOpen, onClose, projectId, onAdded }) {
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      api.get('/auth/users').then(r => setUsers(r.data)).catch(() => {})
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedId) { toast.error('Select a user'); return }
    setLoading(true)
    try {
      await api.post(`/projects/${projectId}/members`, { user_id: selectedId })
      const member = users.find(u => String(u.id) === String(selectedId))
      toast.success(`${member?.name} added!`)
      onAdded(member)
      onClose()
      setSelectedId('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Select User</label>
          <select className="input-field" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">Choose a user…</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get('/tasks', { params: { projectId: id } }),
    ]).then(([pRes, tRes]) => {
      setProject(pRes.data)
      setTasks(tRes.data)
    }).catch(() => {
      toast.error('Failed to load project')
      navigate('/projects')
    }).finally(() => setLoading(false))
  }, [id])

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return
    try {
      await api.delete(`/projects/${id}/members/${userId}`)
      setProject(p => ({ ...p, members: p.members.filter(m => m.id !== userId) }))
      toast.success('Member removed')
    } catch {
      toast.error('Failed to remove member')
    }
  }

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted')
      navigate('/projects')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const pct = project?.task_count > 0
    ? Math.round((project.done_count / project.task_count) * 100)
    : 0

  const PRIORITY_DOT = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-emerald-400' }
  const STATUS_BADGE = {
    todo: 'bg-slate-500/15 text-slate-400',
    in_progress: 'bg-indigo-500/15 text-indigo-400',
    done: 'bg-emerald-500/15 text-emerald-400',
  }
  const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Breadcrumb + header */}
      <div className="animate-[fadeUp_0.6s_ease-out]">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-white">{project?.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">{project?.name}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-lg">{project?.description || 'No description.'}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin() && (
              <>
                <button
                  onClick={handleDeleteProject}
                  className="btn-danger flex items-center gap-2 text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                  </svg>
                  Delete
                </button>
              </>
            )}
            <Link
              to={`/projects/${id}/kanban`}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="4" height="18" rx="1"/><rect x="10" y="3" width="4" height="12" rx="1"/><rect x="17" y="3" width="4" height="15" rx="1"/>
              </svg>
              Open Kanban
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: project?.task_count || 0, color: 'text-indigo-400' },
          { label: 'Completed', value: project?.done_count || 0, color: 'text-emerald-400' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-amber-400' },
          { label: 'Overdue', value: project?.overdue_count || 0, color: project?.overdue_count > 0 ? 'text-red-400' : 'text-slate-400' },
        ].map((s, i) => (
          <GlassCard
            key={s.label}
            className="text-center p-5 stagger-card"
            style={{ '--delay': `${i * 80}ms` }}
          >
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Progress */}
      <GlassCard
        className="p-5 stagger-card"
        style={{ '--delay': '300ms' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-base text-white">Overall Progress</h3>
          <span className="font-display font-bold text-xl text-gradient">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
            style={{ 
              width: mounted ? `${pct}%` : '0%',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)' 
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{project?.done_count || 0} of {project?.task_count || 0} tasks completed</p>
      </GlassCard>

      {/* Members + Tasks split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Members */}
        <GlassCard
          className="p-5 stagger-card"
          style={{ '--delay': '350ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-base text-white">Members</h3>
            {isAdmin() && (
              <button
                onClick={() => setShowAddMember(true)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            )}
          </div>

          {!project?.members?.length ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No members yet</p>
              {isAdmin() && (
                <button onClick={() => setShowAddMember(true)} className="text-xs text-indigo-400 mt-2 hover:underline">
                  Add first member →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {project.members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <Avatar name={member.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{member.role}</p>
                  </div>
                  {isAdmin() && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Tasks list */}
        <GlassCard
          className="p-5 lg:col-span-2 stagger-card"
          style={{ '--delay': '400ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-base text-white">Tasks</h3>
            <Link
              to={`/projects/${id}/kanban`}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Open board →
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" className="w-6 h-6">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p className="text-sm text-slate-400">No tasks yet</p>
              <Link to={`/projects/${id}/kanban`} className="text-xs text-indigo-400 mt-2 hover:underline">
                Create tasks in the board →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(task => {
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                return (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-default">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority] || 'bg-slate-400'}`} />
                    <span className="flex-1 text-sm text-white truncate">{task.title}</span>
                    {task.assigned_name && (
                      <Avatar name={task.assigned_name} size="xs" className="flex-shrink-0" />
                    )}
                    <span className={`badge ${STATUS_BADGE[task.status]} flex-shrink-0`}>
                      {STATUS_LABEL[task.status] || task.status}
                    </span>
                    {task.due_date && (
                      <span className={`text-xs flex-shrink-0 hidden sm:block ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        projectId={id}
        onAdded={member => setProject(p => ({ ...p, members: [...(p.members || []), member] }))}
      />
    </div>
  )
}
