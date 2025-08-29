'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Grid3X3, List, Star, Rocket, MoreHorizontal, User } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  onCreateTask: () => void
  onSearch?: (query: string) => void
  onLogout?: () => void
}

const DashboardHeader = ({ title, subtitle, onCreateTask, onSearch, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and subtitle */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side - Actions and controls */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 w-64"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

          {/* View toggle buttons */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 rounded-md"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 rounded-md bg-white shadow-sm"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Action buttons */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
          >
            <Star className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
          >
            <Rocket className="h-4 w-4" />
          </Button>

          {/* Create task button */}
          <Button
            onClick={onCreateTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>

          {/* More options */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
