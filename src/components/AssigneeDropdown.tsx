'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hooks'
import { assignTaskToUser } from '@/store/slices/task'
import { apiSuccess, apiError } from '@/util/toast'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface AssigneeDropdownProps {
  taskId: string
  currentAssignee?: User | null
  onClose: () => void
  onAssigneeChange: (user: User) => void
}

export const AssigneeDropdown = ({ 
  taskId, 
  currentAssignee, 
  onClose, 
  onAssigneeChange 
}: AssigneeDropdownProps) => {
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  const fetchUsers = useCallback(async (search = '', pageNum = 1) => {
    try {
      setLoading(true)
      // Mock API call - replace with your actual users endpoint
      const response = await fetch(`/api/users?search=${search}&page=${pageNum}&limit=20`)
      const data = await response.json()
      
      if (pageNum === 1) {
        setUsers(data.users || [])
      } else {
        setUsers(prev => [...prev, ...(data.users || [])])
      }
      
      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(searchQuery, 1)
    setPage(1)
  }, [searchQuery, fetchUsers])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchUsers(searchQuery, nextPage)
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, page, searchQuery, fetchUsers])

  const handleUserSelect = async (user: User) => {
    try {
      await dispatch(assignTaskToUser({ taskId, assignedTo: user.id })).unwrap()
      onAssigneeChange(user)
      apiSuccess('Task assigned successfully')
      onClose()
    } catch (error) {
      console.error('Failed to assign task:', error)
      apiError('Failed to assign task')
    }
  }

  const handleRemoveAssignee = async () => {
    try {
      await dispatch(assignTaskToUser({ taskId, assignedTo: '' })).unwrap()
      onAssigneeChange(null as any)
      apiSuccess('Assignee removed successfully')
      onClose()
    } catch (error) {
      console.error('Failed to remove assignee:', error)
      apiError('Failed to remove assignee')
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Select Assignee</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Current Assignee */}
      {currentAssignee && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Assignee</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-700">
                  {getInitials(currentAssignee.firstName, currentAssignee.lastName)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentAssignee.firstName} {currentAssignee.lastName}
                </p>
                <p className="text-xs text-gray-500">{currentAssignee.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAssignee}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="max-h-64 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            onClick={() => handleUserSelect(user)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
        
        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={observerRef} className="h-4" />
        )}
      </div>
    </div>
  )
}
