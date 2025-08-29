'use client'

import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/auth'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const user = useAppSelector(selectUser)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleCreateTask = () => {
    setIsCreateModalOpen(true)
  }

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onSidebarToggle={toggleSidebar}
        sidebarOpen={sidebarOpen}
        onCreateTask={handleCreateTask}
        onSearch={handleSearch}
      />
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <main className="lg:ml-64 pt-16">
        <Dashboard />
      </main>
    </div>
  )
}

export default AppContent
