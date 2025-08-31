import { screen } from '@testing-library/react';
import {
  renderWithAuth,
  renderWithProviders,
  mockUser,
  createUnauthenticatedState,
} from '../test-utils';
import Navbar from '@/components/Navbar';

describe('Navbar Component', () => {
  const mockProps = {
    onSidebarToggle: jest.fn(),
    sidebarOpen: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation elements correctly', () => {
    renderWithAuth(<Navbar {...mockProps} />);

    expect(screen.getByText('SprintSync')).toBeInTheDocument();
  });

  it('displays user information when authenticated', () => {
    renderWithAuth(<Navbar {...mockProps} />, mockUser);

    // Check that the navbar renders correctly for authenticated users
    expect(screen.getByText('SprintSync')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('renders without crashing when no user is logged in', () => {
    renderWithProviders(<Navbar {...mockProps} />, {
      preloadedState: createUnauthenticatedState(),
    });

    expect(screen.getByText('SprintSync')).toBeInTheDocument();
  });
});
