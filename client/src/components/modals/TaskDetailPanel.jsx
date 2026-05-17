import { useState, useEffect } from 'react'
import api from '../../services/api'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const PRIORITY_STYLES = {
  high:   { badge: 'bg-red-500/15 text-red-400',     dot: 'bg-red-400' },
  medium: { badge: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
  low:    { badge: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
}

const STATUS_STYLES = {
  todo:        { badge: 'bg-slate-500/15 text-slate-400',   label: 'To Do' },
  in_progress: { badge: 'bg-indigo-500/15 text-indigo-400',   label: 'In Progress' },
  done:        { badge: 'bg-emerald-500/15 text-emerald-400', label: 'Done' },
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

export default function TaskDetailPanel({ task, isOpen, onClose, onUpdated, onDeleted, members = [] }) {
  const { isAdmin } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', assigned_to: '', due_date: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        assigned_to: task.assigned_to || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      })
      setDirty(false)
    }
  }, [task])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/tasks/${task.id}`, form)
      toast.success('Task updated')
      onUpdated?.(res.data)
      setDirty(false)
    } catch {
      toast.error('Failed to update task')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/tasks/${task.id}`)
      toast.success('Task deleted')
      onDeleted?.(task.id)
      onClose()
    } catch {
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  const isOverdue = task?.due_date && new Date(task.due_date) < new Date() && task?.status !== 'done'
  const ps = PRIORITY_STYLES[form.priority] || PRIORITY_STYLES.medium
  const ss = STATUS_STYLES[form.status] || STATUS_STYLES.todo

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0A12]/80 backdrop-blur-sm z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-[440px] z-50 flex flex-col glass border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden animate-[slideInRight_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={`badge ${ss.badge}`}>{ss.label}</span>
            {isOverdue && (
              <span className="badge bg-red-500/15 text-red-400">Overdue</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <Field label="Title">
            {isAdmin() ? (
              <input
                className="input-field font-display font-semibold text-base"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Task title"
              />
            ) : (
              <p className="font-display font-semibold text-base text-white">{form.title}</p>
            )}
          </Field>

          {/* Description */}
          <Field label="Description">
            {isAdmin() ? (
              <textarea
                className="input-field resize-none"
                rows={3}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Add a description…"
              />
            ) : (
              <p className="text-sm text-slate-400">{form.description || 'No description.'}</p>
            )}
          </Field>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority">
              {isAdmin() ? (
                <select className="input-field" value={form.priority} onChange={e => set('priority', e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <span className={`badge ${ps.badge} w-fit`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`} />
                  {form.priority}
                </span>
              )}
            </Field>

            <Field label="Status">
              <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </Field>
          </div>

          {/* Assignee */}
          {isAdmin() && (
            <Field label="Assigned To">
              <select className="input-field" value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}>
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </Field>
          )}

          {!isAdmin() && task.assigned_name && (
            <Field label="Assigned To">
              <div className="flex items-center gap-2.5">
                <Avatar name={task.assigned_name} size="sm" />
                <span className="text-sm text-white">{task.assigned_name}</span>
              </div>
            </Field>
          )}

          {/* Due Date */}
          <Field label="Due Date">
            {isAdmin() ? (
              <input
                type="date"
                className="input-field"
                value={form.due_date}
                onChange={e => set('due_date', e.target.value)}
              />
            ) : (
              <span className={`text-sm ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                {form.due_date
                  ? new Date(form.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : 'No due date'}
              </span>
            )}
          </Field>

          {/* Project */}
          {task.project_name && (
            <Field label="Project">
              <span className="text-sm text-white">{task.project_name}</span>
            </Field>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/10 flex-shrink-0 flex items-center gap-3">
          {isAdmin() && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex items-center gap-2"
            >
              {deleting
                ? <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
              }
              Delete
            </button>
          )}
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Save
          </button>
        </div>
      </aside>
    </>
  )
}
