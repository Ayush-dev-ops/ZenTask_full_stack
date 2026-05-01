import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import api from '../services/api'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import TaskDetailPanel from '../components/modals/TaskDetailPanel'
import { TaskCardSkeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/common/GlassCard'

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#6b7280', accent: 'from-slate-500/10' },
  { id: 'in_progress', label: 'In Progress',  color: '#6366f1', accent: 'from-indigo-500/10' },
  { id: 'done',        label: 'Done',         color: '#22c55e', accent: 'from-emerald-500/10' },
]

const PRIORITY_COLORS = {
  high:   { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400' },
  medium: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  low:    { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
}

function TaskCard({ task, index, onClick }) {
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={provided.draggableProps.style}>
          <div
            onClick={() => onClick(task)}
            className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 stagger-card ${
              snapshot.isDragging
                ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-[1.02] border-indigo-500/50 rotate-1 z-50'
                : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:border-white/10'
            }`}
            style={{ '--delay': `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-sm font-medium leading-snug text-white flex-1">{task.title}</h3>
              <span className={`badge ${pc.bg} ${pc.text} capitalize flex-shrink-0`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {task.assigned_name ? (
                  <>
                    <Avatar name={task.assigned_name} size="xs" />
                    <span className="text-xs text-slate-400">{task.assigned_name.split(' ')[0]}</span>
                  </>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-slate-500">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>

              {task.due_date && (
                <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

function CreateTaskModal({ isOpen, onClose, onCreated, projectId, members }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Task title required'); return }
    setLoading(true)
    try {
      const res = await api.post('/tasks', { ...form, project_id: projectId })
      onCreated(res.data)
      toast.success('Task created!')
      onClose()
      setForm({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title *</label>
          <input className="input-field" placeholder="Task title" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
          <textarea className="input-field resize-none" rows={2} placeholder="Optional description"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</label>
            <select className="input-field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Column</label>
            <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assign To</label>
            <select className="input-field" value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}>
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Due Date</label>
            <input type="date" className="input-field" value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function KanbanPage() {
  const { id } = useParams()
  const [cols, setCols] = useState({ todo: [], in_progress: [], done: [] })
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get('/tasks', { params: { projectId: id } }),
    ]).then(([pRes, tRes]) => {
      setProject(pRes.data)
      setMembers(pRes.data.members || [])
      const tasks = tRes.data || []
      setCols({
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        done: tasks.filter(t => t.status === 'done'),
      })
    }).catch(() => {
      setProject({ id, name: 'Project Board' })
    }).finally(() => setLoading(false))
  }, [id])

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const from = source.droppableId
    const to = destination.droppableId
    const newCols = { ...cols }
    const [task] = newCols[from].splice(source.index, 1)
    task.status = to
    newCols[to].splice(destination.index, 0, task)
    setCols({ ...newCols })

    try {
      await api.patch(`/tasks/${draggableId}/status`, { status: to })
    } catch {
      setCols(c => {
        const r = { ...c }
        r[to].splice(destination.index, 1)
        task.status = from
        r[from].splice(source.index, 0, task)
        return r
      })
      toast.error('Failed to update task status')
    }
  }

  const handleTaskCreated = (task) => {
    const col = task.status || 'todo'
    setCols(c => ({ ...c, [col]: [...c[col], task] }))
  }

  const handleTaskUpdated = (updated) => {
    setCols(c => {
      const next = { todo: [], in_progress: [], done: [] }
      Object.values(c).flat().forEach(t => {
        const final = t.id === updated.id ? updated : t
        next[final.status] = [...next[final.status], final]
      })
      return next
    })
    setSelectedTask(updated)
  }

  const handleTaskDeleted = (taskId) => {
    setCols(c => {
      const next = {}
      Object.entries(c).forEach(([k, v]) => { next[k] = v.filter(t => t.id !== taskId) })
      return next
    })
  }

  const total = Object.values(cols).flat().length

  return (
    <div className="flex flex-col h-full animate-[fadeUp_0.6s_ease-out]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 glass">
        <div className="flex items-center gap-3">
          <Link to={`/projects/${id}`} className="text-slate-400 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg text-white">{project?.name || 'Kanban Board'}</h1>
            <p className="text-xs text-slate-400">{total} tasks across {COLUMNS.length} columns</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
            {COLUMNS.map(c => (
              <span key={c.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                {cols[c.id]?.length || 0}
              </span>
            ))}
          </div>
          {isAdmin() && (
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm hover:scale-105 active:scale-95 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-6 h-full min-w-[800px]">
            {COLUMNS.map(col => (
              <div key={col.id} className="flex-1 flex flex-col min-w-[280px]">
                {/* Column header */}
                <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-xl bg-gradient-to-r ${col.accent} to-transparent border border-white/5`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: col.color }} />
                    <span className="text-sm font-semibold text-white">{col.label}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                    {cols[col.id]?.length || 0}
                  </span>
                </div>

                {/* Droppable */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 p-3 rounded-2xl transition-all duration-200 min-h-[200px] ${
                        snapshot.isDraggingOver
                          ? 'bg-white/5 border border-dashed border-indigo-500/50'
                          : 'border border-transparent bg-white/[0.02]'
                      }`}
                    >
                      {loading
                        ? Array.from({ length: 2 }).map((_, i) => <TaskCardSkeleton key={i} />)
                        : cols[col.id]?.map((task, i) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={i}
                              onClick={t => { setSelectedTask(t); setPanelOpen(true) }}
                            />
                          ))
                      }
                      {provided.placeholder}

                      {/* Add task button inside column */}
                      {!loading && isAdmin() && (
                        <button
                          onClick={() => setShowCreate(true)}
                          className="w-full py-3 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all border border-dashed border-white/10 hover:border-indigo-500/50 flex items-center justify-center gap-1.5 mt-2"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                          Add task
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleTaskCreated}
        projectId={id}
        members={members}
      />

      <TaskDetailPanel
        task={selectedTask}
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
        members={members}
      />
    </div>
  )
}
