import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../common/GlassCard';
import ShimmerSkeleton from '../common/ShimmerSkeleton';
import { AvatarGroup } from '../ui/Avatar';

export default function DashboardProjects({ projects, loading }) {
  // Use state to trigger the animation of the progress bar width
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure the component is rendered before triggering animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GlassCard className="p-5 stagger-card" style={{ '--delay': '200ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-base text-white">Project Progress</h3>
        <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          View all &rarr;
        </Link>
      </div>
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ShimmerSkeleton key={i} className="h-16 w-full" />
          ))
        ) : projects.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">No projects found.</div>
        ) : (
          projects.map((p, i) => {
            const pct = p.task_count > 0 ? Math.round((p.done_count / p.task_count) * 100) : 0;
            // Get random color dot for project based on ID
            const dotColor = `hsl(${(p.id * 47) % 360}, 70%, 60%)`;
            
            return (
              <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor }} />
                    <Link to={`/projects/${p.id}`} className="text-sm font-medium text-white hover:text-indigo-300 transition-colors">
                      {p.name}
                    </Link>
                  </div>
                  {p.members && <AvatarGroup names={p.members.map(m => m.user_name)} max={3} size="xs" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: mounted ? `${pct}%` : '0%',
                        backgroundColor: dotColor,
                        boxShadow: `0 0 10px ${dotColor}`
                      }} 
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}
