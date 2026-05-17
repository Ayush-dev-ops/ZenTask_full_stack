import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../common/GlassCard';
import ShimmerSkeleton from '../common/ShimmerSkeleton';
import Avatar from '../ui/Avatar';

const PRIORITY_COLORS = { 
  high: 'bg-red-500/20 text-red-400 border-red-500/30', 
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30', 
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
};

const STATUS_COLORS = {
  todo: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  in_progress: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  done: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

export default function DashboardTasks({ tasks, loading }) {
  return (
    <GlassCard className="p-5 mt-4 stagger-card" style={{ '--delay': '300ms' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base text-white">Recent Tasks</h3>
        <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          View all &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs text-slate-400">
              <th className="pb-3 font-medium px-2">Task</th>
              <th className="pb-3 font-medium px-2">Project</th>
              <th className="pb-3 font-medium px-2 hidden sm:table-cell">Assignee</th>
              <th className="pb-3 font-medium px-2">Priority</th>
              <th className="pb-3 font-medium px-2 hidden md:table-cell">Due Date</th>
              <th className="pb-3 font-medium px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan="6" className="py-2"><ShimmerSkeleton className="h-10 w-full" /></td>
                </tr>
              ))
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-sm text-slate-400">
                  No tasks assigned yet.
                </td>
              </tr>
            ) : (
              tasks.slice(0, 6).map((task) => (
                <tr 
                  key={task.id} 
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group relative"
                >
                  {/* Left Indigo Border on Hover */}
                  <td className="absolute left-0 top-0 bottom-0 w-0 bg-indigo-500 transition-all duration-200 group-hover:w-[3px]" />
                  
                  <td className="py-3 px-2 text-sm font-medium text-white max-w-[150px] truncate">
                    {task.title}
                  </td>
                  <td className="py-3 px-2 text-sm text-slate-400 truncate">
                    {task.project_name || 'No project'}
                  </td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    {task.assigned_name ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assigned_name} size="xs" />
                        <span className="text-xs text-slate-300">{task.assigned_name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${PRIORITY_COLORS[task.priority] || 'bg-slate-500 text-white'}`}>
                      {task.priority?.toUpperCase() || 'NONE'}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell text-xs text-slate-400">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[task.status] || 'bg-slate-500 text-white'}`}>
                      {STATUS_LABELS[task.status] || task.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
