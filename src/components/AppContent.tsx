import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCurrentUser, selectUser } from '../store/slices/auth'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAppSelector(selectUser)
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Close sidebar when route changes
  useEffect(() => {
    closeSidebar()
  }, [location.pathname])

  // If user is not authenticated and not on login page, redirect to login
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  // If user is authenticated and on login page, redirect to dashboard
  if (user && location.pathname === '/login') {
    return <Navigate to="/" replace />
  }

  // If user is not authenticated, only show login page
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    )
  }

  // If user is authenticated, show full app with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onSidebarToggle={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <main className="lg:ml-64">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default AppContent
