import { DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

export const taskDetailsTourSteps: DriveStep[] = [
  {
    element: '#task-reporter-section',
    popover: {
      title: 'Task Reporter',
      description: 'You can now see who created this task right here.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '#task-comments-section',
    popover: {
      title: 'Comments',
      description:
        'We have added a new comments section! You can now collaborate and add comments to tasks.',
      side: 'top',
      align: 'start',
    },
  },
];
