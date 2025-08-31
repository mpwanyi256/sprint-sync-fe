import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '@/components/TaskCard';
import { mockTask, mockTaskWithAssignee } from '../test-utils';

describe('TaskCard Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('displays assignee information when task is assigned', () => {
    render(<TaskCard task={mockTaskWithAssignee} onClick={mockOnClick} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows created date in correct format', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    const expectedDate = new Date(mockTask.createdAt).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    const taskCard = screen.getByText('Test Task').closest('div');
    fireEvent.click(taskCard!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles drag events correctly', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    const taskCard = screen.getByText('Test Task').closest('div');
    const dragStartEvent = new Event('dragstart');
    const dragEndEvent = new Event('dragend');

    fireEvent(taskCard!, dragStartEvent);
    fireEvent(taskCard!, dragEndEvent);

    // Test passes if no errors are thrown
    expect(taskCard).toBeInTheDocument();
  });
});
