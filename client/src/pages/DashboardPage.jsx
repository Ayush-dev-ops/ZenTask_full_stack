import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardChart from '../components/dashboard/DashboardChart';
import DashboardProjects from '../components/dashboard/DashboardProjects';
import DashboardTasks from '../components/dashboard/DashboardTasks';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tasks/stats'),
      api.get('/tasks'),
      api.get('/projects'),
    ]).then(([statsRes, tasksRes, projRes]) => {
      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setProjects(projRes.data.slice(0, 4));
    }).catch(() => {
      setStats({ total: 0, byStatus: [], overdue: 0 });
      setTasks([]);
      setProjects([]);
    }).finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeUp_0.6s_ease-out]">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Good {greeting()},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {firstName}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">{currentDate}</p>
        </div>
        <Link to="/projects" className="btn-primary flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Stats Row */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Main Grid: Chart + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardChart tasks={tasks} />
        <DashboardProjects projects={projects} loading={loading} />
      </div>

      {/* Recent Tasks */}
      <DashboardTasks tasks={tasks} loading={loading} />
    </div>
  );
}

