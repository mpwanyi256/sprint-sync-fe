import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTasks } from '@/store/slices/task'
import { selectTasks, selectTaskLoading } from '@/store/slices/task'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectTasks)
  const loading = useAppSelector(selectTaskLoading)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">To Do</h3>
          <div className="space-y-2">
            {tasks.filter(task => task.status === 'TODO').map(task => (
              <div key={task.id} className="p-3 bg-gray-50 rounded border">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">In Progress</h3>
          <div className="space-y-2">
            {tasks.filter(task => task.status === 'IN_PROGRESS').map(task => (
              <div key={task.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Done</h3>
          <div className="space-y-2">
            {tasks.filter(task => task.status === 'DONE').map(task => (
              <div key={task.id} className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
