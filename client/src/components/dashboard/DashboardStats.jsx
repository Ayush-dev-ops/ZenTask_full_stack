import React from 'react';
import GlassCard from '../common/GlassCard';
import useCountUp from '../../hooks/useCountUp';
import ShimmerSkeleton from '../common/ShimmerSkeleton';

function StatCard({ label, value, sub, icon, colorClass, borderClass, delay }) {
  const animatedValue = useCountUp(value, 1500);

  return (
    <GlassCard 
      className={`relative flex flex-col gap-4 p-5 glass-hover overflow-hidden stagger-card border-b-2`}
      style={{ '--delay': delay, borderBottomColor: borderClass }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="font-display font-bold text-3xl text-white">{animatedValue}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </GlassCard>
  );
}

export default function DashboardStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerSkeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const getCount = (status) => stats?.byStatus?.find(s => s.status === status)?.count || 0;
  
  const total = stats?.total || 0;
  const completed = getCount('done');
  const inProgress = getCount('in_progress');
  const overdue = stats?.overdue || 0;
  
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Tasks"
        value={total}
        sub="Across all projects"
        delay="0ms"
        borderClass="#6366f1"
        colorClass="text-indigo-400"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
      />
      <StatCard
        label="Completed"
        value={completed}
        sub={`${progressPct}% completion rate`}
        delay="100ms"
        borderClass="#22c55e"
        colorClass="text-emerald-400"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>}
      />
      <StatCard
        label="In Progress"
        value={inProgress}
        sub="Active right now"
        delay="200ms"
        borderClass="#f59e0b"
        colorClass="text-amber-400"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      />
      <StatCard
        label="Overdue"
        value={overdue}
        sub="Need immediate attention"
        delay="300ms"
        borderClass="#ef4444"
        colorClass="text-red-400"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      />
    </div>
  );
}
