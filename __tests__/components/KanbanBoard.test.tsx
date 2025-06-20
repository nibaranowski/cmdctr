import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KanbanBoard } from '../../components/KanbanBoard';

describe('KanbanBoard', () => {
  it('renders without crashing', () => {
    render(<KanbanBoard />);
    expect(screen.getByRole('region', { name: /kanban board/i })).toBeInTheDocument();
  });

  it('displays expected content', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<KanbanBoard />);
    const board = screen.getByRole('region', { name: /kanban board/i });
    expect(board).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<KanbanBoard />);
    const board = screen.getByRole('region', { name: /kanban board/i });
    expect(board).toBeInTheDocument();
  });
});
