import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchCurrentUser, logoutUser } from '@/store/slices/auth'
import { selectUser, selectIsAuthenticated } from '@/store/slices/auth'
import { useEffect } from 'react'

const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

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
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SprintSync</h1>
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {getUserDisplayName()}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
