import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import KanbanPage from './pages/KanbanPage'
import SettingsPage from './pages/SettingsPage'
import PageTransition from './components/common/PageTransition'
import ShimmerSkeleton from './components/common/ShimmerSkeleton'

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-[#0A0A12] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
          <span className="text-3xl text-white">⚡</span>
        </div>
        <ShimmerSkeleton className="w-48 h-6 rounded-full" />
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={
          <PageTransition key="dashboard"><DashboardPage /></PageTransition>
        } />
        <Route path="projects" element={
          <PageTransition key="projects"><ProjectsPage /></PageTransition>
        } />
        <Route path="projects/:id" element={
          <PageTransition key="project-detail"><ProjectDetailPage /></PageTransition>
        } />
        <Route path="projects/:id/kanban" element={
          <PageTransition key="kanban"><KanbanPage /></PageTransition>
        } />
        <Route path="settings" element={
          <PageTransition key="settings"><SettingsPage /></PageTransition>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
