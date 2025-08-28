import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchCurrentUser, logoutUser } from '@/store/slices/auth'
import { selectUser, selectIsAuthenticated } from '@/store/slices/auth'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  onSidebarToggle: () => void
  sidebarOpen: boolean
}

const Navbar = ({ onSidebarToggle, sidebarOpen }: NavbarProps) => {
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold text-gray-900">SprintSync</h1>
          </div>
          
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
