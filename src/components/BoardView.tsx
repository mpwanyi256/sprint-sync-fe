'use client';

import { useAppSelector } from '@/store/hooks';
import { selectViewFormat } from '@/store/slices/ui';
import TaskColumn from './TaskColumn';
import TaskListView from './TaskListView';
import { Task } from '@/types/task';

interface BoardViewProps {
  onViewTaskDetails: (task: Task) => void;
}

const BoardView = ({ onViewTaskDetails }: BoardViewProps) => {
  const viewFormat = useAppSelector(selectViewFormat);

  if (viewFormat === 'list') {
    return <TaskListView onViewTaskDetails={onViewTaskDetails} />;
  }

  // Default Kanban view with columns and drag and drop
  return (
    <div className='flex overflow-x-auto pb-4 gap-6 items-start h-full'>
      <div id='BACKLOG' className='min-w-[320px] max-w-[320px]'>
        <TaskColumn
          title='Backlog'
          status='BACKLOG'
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
      <div id='TODO' className='min-w-[320px] max-w-[320px]'>
        <TaskColumn
          title='To Do'
          status='TODO'
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
      <div id='IN_PROGRESS' className='min-w-[320px] max-w-[320px]'>
        <TaskColumn
          title='In Progress'
          status='IN_PROGRESS'
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
      <div id='DONE' className='min-w-[320px] max-w-[320px]'>
        <TaskColumn
          title='Done'
          status='DONE'
          onViewTaskDetails={onViewTaskDetails}
        />
      </div>
    </div>
  );
};

export default BoardView;
