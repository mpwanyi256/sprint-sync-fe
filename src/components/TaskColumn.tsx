import { useEffect, useState, useCallback, useRef } from 'react'
import { Task, TaskStatus } from '@/types/task'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTasks } from '@/store/slices/task'
import { selectTasksByStatus, selectColumnPagination } from '@/store/slices/task/taskSelectors'
import TaskCard from './TaskCard'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskColumnProps {
  status: TaskStatus
  title: string
  onViewTaskDetails: (task: Task) => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
}

const TaskColumn = ({ 
  status, 
  title, 
  onViewTaskDetails, 
  onStatusChange 
}: TaskColumnProps) => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(state => selectTasksByStatus(state, status))
  const pagination = useAppSelector(state => selectColumnPagination(state, status))
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement>(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      await dispatch(fetchTasks({ status, page, limit: 10 })).unwrap()
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [dispatch, status, page])

  useEffect(() => {
    loadTasks()
  }, [status]) // Only depend on status, not loadTasks function

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasNextPage) {
      const nextPage = page + 1
      setPage(nextPage)
      loadTasks()
    }
  }, [loading, pagination.hasNextPage, page, loadTasks])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore, pagination.hasNextPage, loading])

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'border-gray-200 bg-gray-50'
      case 'IN_PROGRESS':
        return 'border-blue-200 bg-blue-50'
      case 'DONE':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-full min-h-[600px] border-2 rounded-lg",
      getColumnColor(status)
    )}>
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">{tasks.length} tasks</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onViewDetails={onViewTaskDetails}
          />
        ))}
        
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        
        {pagination.hasNextPage && (
          <div ref={observerRef} className="h-4" />
        )}
        
        {!pagination.hasNextPage && tasks.length > 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            No more tasks
          </div>
        )}
        
        {!loading && tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskColumn
