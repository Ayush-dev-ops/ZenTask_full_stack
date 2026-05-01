import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../common/GlassCard';

/**
 * Custom Tooltip for Recharts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 text-xs shadow-lg border border-white/10">
      <p className="font-medium text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function DashboardChart({ tasks }) {
  // Aggregate tasks by day of week
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dataMap = {
      Sun: { name: 'Sun', tasks: 0 },
      Mon: { name: 'Mon', tasks: 0 },
      Tue: { name: 'Tue', tasks: 0 },
      Wed: { name: 'Wed', tasks: 0 },
      Thu: { name: 'Thu', tasks: 0 },
      Fri: { name: 'Fri', tasks: 0 },
      Sat: { name: 'Sat', tasks: 0 },
    };

    tasks.forEach(task => {
      if (task.due_date) {
        const date = new Date(task.due_date);
        const dayName = days[date.getDay()];
        dataMap[dayName].tasks += 1;
      }
    });

    // Reorder starting from today - 6 days
    const todayIndex = new Date().getDay();
    const orderedData = [];
    for (let i = 6; i >= 0; i--) {
      let index = todayIndex - i;
      if (index < 0) index += 7;
      orderedData.push(dataMap[days[index]]);
    }

    return orderedData;
  }, [tasks]);

  return (
    <GlassCard 
      className="p-5 lg:col-span-2 relative opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_both]"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-base text-white">Task Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Tasks due by day</p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Area 
              type="monotone" 
              dataKey="tasks" 
              name="Due Tasks"
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTasks)" 
              activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
