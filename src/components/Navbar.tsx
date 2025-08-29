import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchCurrentUser, logoutUser } from '@/store/slices/auth'
import { selectUser, selectIsAuthenticated } from '@/store/slices/auth'
import { Menu, X, Search, Grid3X3, List, Star, Rocket, MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NavbarProps {
  onSidebarToggle: () => void
  sidebarOpen: boolean
  onCreateTask?: () => void
  onSearch?: (query: string) => void
}

const Navbar = ({ onSidebarToggle, sidebarOpen, onCreateTask, onSearch }: NavbarProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, []) // Remove dispatch dependency to prevent infinite loop

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const getUserDisplayName = () => {
    if (user) {
      return `${user.firstName} ${user.lastName}`
    }
    return 'User'
  }

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">SprintSync</h1>
            </div>
          </div>

          {/* Center - Search and controls */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-center max-w-2xl">
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
            {onCreateTask && (
              <Button
                onClick={onCreateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}

            {/* More options */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Right side - User info and logout */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">Welcome, {getUserDisplayName()}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
