'use client'

import { useAppSelector } from '@/store/hooks'
import { selectViewFormat } from '@/store/slices/ui'
import TaskColumn from './TaskColumn'
import TaskListView from './TaskListView'
import { Task } from '@/types/task'

interface BoardViewProps {
  onViewTaskDetails: (task: Task) => void
}

const BoardView = ({ onViewTaskDetails }: BoardViewProps) => {
  const viewFormat = useAppSelector(selectViewFormat)

  if (viewFormat === 'list') {
    return <TaskListView onViewTaskDetails={onViewTaskDetails} />
  }

  // Default Kanban view with columns and drag and drop
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
      <div id="TODO">
        <TaskColumn
          title="To Do"
          status="TODO"
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
      <div id="IN_PROGRESS">
        <TaskColumn
          title="In Progress"
          status="IN_PROGRESS"
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
      <div id="DONE">
        <TaskColumn
          title="Done"
          status="DONE"
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
    </div>
  )
}

export default BoardView
