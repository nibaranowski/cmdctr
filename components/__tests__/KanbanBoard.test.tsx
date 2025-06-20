import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { KanbanBoard } from '../KanbanBoard';

describe('KanbanBoard', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', description: 'Description 1', status: 'todo' as const },
    { id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' as const }
  ];

  it('renders the kanban board', () => {
    render(<KanbanBoard tasks={mockTasks} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders cards in columns', () => {
    render(<KanbanBoard tasks={mockTasks} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('displays card descriptions', () => {
    render(<KanbanBoard tasks={mockTasks} />);
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });
}); 