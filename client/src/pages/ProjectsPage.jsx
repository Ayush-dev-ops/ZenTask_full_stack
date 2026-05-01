import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AvatarGroup } from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { ProjectCardSkeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'
import GlassCard from '../components/common/GlassCard'

function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Project name required'); return }
    setLoading(true)
    try {
      const res = await api.post('/projects', form)
      toast.success('Project created!')
      onCreated({ ...form, id: res.data.id, member_count: 0, task_count: 0, done_count: 0 })
      onClose()
      setForm({ name: '', description: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Project Name *</label>
          <input
            className="input-field"
            placeholder="e.g. Website Redesign"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="What is this project about?"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ProjectCard({ project, onDelete, isAdmin, index }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const pct = project.task_count > 0 ? Math.round((project.done_count / project.task_count) * 100) : 0
  const hue = (project.id * 47) % 360
  const memberNames = project.members?.map(m => m.name) || []

  return (
    <GlassCard
      className="group flex flex-col gap-4 relative overflow-hidden stagger-card"
      style={{ '--delay': `${index * 60}ms` }}
    >
      {/* Subtle accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, hsl(${hue}, 70%, 55%), transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-0">
        <div className="flex-1 min-w-0">
          <Link
            to={`/projects/${project.id}`}
            className="font-display font-semibold text-base text-white hover:text-indigo-400 transition-colors line-clamp-1"
          >
            {project.name}
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {project.description || 'No description provided.'}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
          style={{ background: `hsl(${hue}, 55%, 35%)` }}
        >
          {project.name[0]}
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between px-5">
        {memberNames.length > 0 ? (
          <AvatarGroup names={memberNames} max={4} size="sm" />
        ) : (
          <span className="text-xs text-slate-500">No members</span>
        )}
        <span className="text-xs text-slate-400">
          {project.member_count || 0} member{project.member_count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-1.5 px-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{project.done_count || 0}/{project.task_count || 0} tasks done</span>
          <span className="text-xs font-semibold text-white">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: mounted ? `${pct}%` : '0%',
              background: `linear-gradient(90deg, hsl(${hue}, 60%, 55%), #6366f1)` 
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 pb-3 px-5 border-t border-white/10 mt-2">
        <Link
          to={`/projects/${project.id}`}
          className="flex-1 py-2 rounded-xl text-xs font-medium text-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
          View Details
        </Link>
        <Link
          to={`/projects/${project.id}/kanban`}
          className="flex-1 py-2 rounded-xl text-xs font-medium text-center btn-primary"
        >
          Open Board
        </Link>
        {isAdmin && (
          <button
            onClick={() => onDelete(project.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/10"
            title="Delete project"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        )}
      </div>
    </GlassCard>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(p => p.filter(x => x.id !== id))
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-[fadeUp_0.6s_ease-out]">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? '…' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {isAdmin() && (
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" className="w-8 h-8">
              <path d="M3 7l5-4h8l5 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
              <path d="M8 21V12h8v9"/>
            </svg>
          </div>
          <h3 className="font-display font-semibold text-lg text-white">No projects yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            {isAdmin() ? 'Create your first project to start organizing tasks.' : 'You haven\'t been added to any projects yet.'}
          </p>
          {isAdmin() && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-5 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              isAdmin={isAdmin()}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={p => setProjects(prev => [p, ...prev])}
      />
    </div>
  )
}
