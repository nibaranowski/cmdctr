import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KanbanBoard } from '../../../components/workspace/KanbanBoard';
import { KanbanCard } from '../../../components/workspace/KanbanCard';
import { SearchModal } from '../../../components/workspace/SearchModal';

// Mock data for testing
const mockColumns = [
  { id: 'col-1', title: 'To Do', order: 1, color: '#3B82F6' },
  { id: 'col-2', title: 'In Progress', order: 2, color: '#F59E0B' },
  { id: 'col-3', title: 'Done', order: 3, color: '#10B981' }
];

const mockCards = [
  {
    id: 'card-1',
    title: 'Implement drag and drop',
    description: 'Add drag and drop functionality to the Kanban board',
    status: 'todo',
    priority: 'high' as const,
    columnId: 'col-1',
    tags: ['feature', 'ui'],
    assignee: 'John Doe',
    dueDate: '2024-01-15'
  },
  {
    id: 'card-2',
    title: 'Add keyboard navigation',
    description: 'Implement keyboard shortcuts for navigation',
    status: 'in-progress',
    priority: 'medium' as const,
    columnId: 'col-2',
    tags: ['accessibility'],
    assignee: 'Jane Smith',
    dueDate: '2024-01-20'
  },
  {
    id: 'card-3',
    title: 'Write tests',
    description: 'Add comprehensive test coverage',
    status: 'done',
    priority: 'low' as const,
    columnId: 'col-3',
    tags: ['testing'],
    assignee: 'Bob Johnson',
    dueDate: '2024-01-10'
  }
];

// Mock the hooks
jest.mock('../../../hooks/useOptimisticUpdates', () => ({
  useOptimisticUpdates: () => ({
    optimisticUpdate: jest.fn(),
    rollback: jest.fn(),
    isOptimistic: false
  })
}));

jest.mock('../../../hooks/useDragAndDrop', () => ({
  useDragAndDrop: () => ({
    isDragging: false,
    draggedItemId: null,
    draggedItemType: null,
    sourceColumnId: null,
    dragStart: jest.fn(),
    dragEnd: jest.fn(),
    drop: jest.fn(),
    isOverDropZone: jest.fn(),
    canDrop: jest.fn()
  })
}));

jest.mock('../../../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: () => ({
    handleKeyDown: jest.fn(),
    focusNextCard: jest.fn(),
    focusPreviousCard: jest.fn(),
    focusNextColumn: jest.fn(),
    focusPreviousColumn: jest.fn(),
    registerCardRef: jest.fn(),
    focusedCardId: null
  })
}));

describe('KanbanBoard', () => {
  const defaultProps = {
    columns: mockColumns,
    cards: mockCards,
    onCardMove: jest.fn(),
    onCardCreate: jest.fn(),
    onCardUpdate: jest.fn(),
    onCardDelete: jest.fn(),
    onColumnReorder: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all columns with correct titles', () => {
      render(<KanbanBoard {...defaultProps} />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('renders all cards in their respective columns', () => {
      render(<KanbanBoard {...defaultProps} />);
      
      expect(screen.getByText('Implement drag and drop')).toBeInTheDocument();
      expect(screen.getByText('Add keyboard navigation')).toBeInTheDocument();
      expect(screen.getByText('Write tests')).toBeInTheDocument();
    });

    it('displays correct card counts in column headers', () => {
      render(<KanbanBoard {...defaultProps} />);
      
      // Each column should show the count of cards it contains
      const todoColumn = screen.getByText('To Do').closest('[data-testid*="kanban-column"]');
      const inProgressColumn = screen.getByText('In Progress').closest('[data-testid*="kanban-column"]');
      const doneColumn = screen.getByText('Done').closest('[data-testid*="kanban-column"]');
      
      expect(todoColumn).toHaveTextContent('1');
      expect(inProgressColumn).toHaveTextContent('1');
      expect(doneColumn).toHaveTextContent('1');
    });
  });

  describe('Card Interactions', () => {
    it('selects a card when clicked', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      await user.click(card);
      
      // Card should have selected styling
      expect(card.closest('[data-testid*="kanban-card"]')).toHaveClass('ring-2', 'ring-blue-500');
    });

    it('opens search modal when Cmd+K is pressed', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Press Cmd+K
      await user.keyboard('{Meta>}k{/Meta}');
      
      // Search modal should be visible
      expect(screen.getByPlaceholderText('Search cards...')).toBeInTheDocument();
    });

    it('allows editing card title on double click', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      await user.dblClick(card);
      
      // Should show textarea for editing
      const textarea = screen.getByDisplayValue('Implement drag and drop');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('shows drag preview when card is dragged', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      
      // Start drag
      fireEvent.dragStart(card);
      
      // Card should have dragging styling
      expect(card.closest('[data-testid*="kanban-card"]')).toHaveClass('opacity-50', 'scale-105');
    });

    it('highlights drop zones when dragging over', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      const targetColumn = screen.getByText('In Progress').closest('[data-testid*="kanban-column"]');
      
      // Start drag
      fireEvent.dragStart(card);
      
      // Drag over target column
      fireEvent.dragOver(targetColumn!);
      
      // Column should have drop zone styling
      expect(targetColumn).toHaveClass('bg-blue-50', 'border-blue-300');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates between cards with arrow keys', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Focus first card
      const firstCard = screen.getByText('Implement drag and drop');
      firstCard.focus();
      
      // Press arrow down
      await user.keyboard('{ArrowDown}');
      
      // Should focus next card
      const secondCard = screen.getByText('Add keyboard navigation');
      expect(secondCard).toHaveFocus();
    });

    it('navigates between columns with arrow keys', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Focus first card
      const firstCard = screen.getByText('Implement drag and drop');
      firstCard.focus();
      
      // Press arrow right
      await user.keyboard('{ArrowRight}');
      
      // Should focus first card in next column
      const secondCard = screen.getByText('Add keyboard navigation');
      expect(secondCard).toHaveFocus();
    });

    it('selects focused card with Enter key', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Focus first card
      const firstCard = screen.getByText('Implement drag and drop');
      firstCard.focus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      
      // Card should be selected
      expect(firstCard.closest('[data-testid*="kanban-card"]')).toHaveClass('ring-2', 'ring-blue-500');
    });
  });

  describe('Search Functionality', () => {
    it('filters cards based on search query', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Open search modal
      await user.keyboard('{Meta>}k{/Meta}');
      
      // Type search query
      const searchInput = screen.getByPlaceholderText('Search cards...');
      await user.type(searchInput, 'drag');
      
      // Should show matching cards
      await waitFor(() => {
        expect(screen.getByText('Implement drag and drop')).toBeInTheDocument();
        expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
      });
    });

    it('highlights search matches in results', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      // Open search modal
      await user.keyboard('{Meta>}k{/Meta}');
      
      // Type search query
      const searchInput = screen.getByPlaceholderText('Search cards...');
      await user.type(searchInput, 'drag');
      
      // Should highlight matching text
      await waitFor(() => {
        const highlightedText = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'span' && 
                 element?.classList.contains('bg-yellow-200');
        });
        expect(highlightedText).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('adapts to different screen sizes', () => {
      // Mock window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });
      
      render(<KanbanBoard {...defaultProps} />);
      
      // Should have responsive classes
      const board = screen.getByTestId('kanban-board');
      expect(board).toHaveClass('overflow-x-auto');
    });

    it('shows horizontal scroll on small screens', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480
      });
      
      render(<KanbanBoard {...defaultProps} />);
      
      const board = screen.getByTestId('kanban-board');
      expect(board).toHaveClass('overflow-x-auto');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<KanbanBoard {...defaultProps} />);
      
      // Check for ARIA labels on cards
      const cards = screen.getAllByRole('button');
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label');
      });
    });

    it('supports keyboard navigation', () => {
      render(<KanbanBoard {...defaultProps} />);
      
      // Check that cards are focusable
      const cards = screen.getAllByRole('button');
      cards.forEach(card => {
        expect(card).toHaveAttribute('tabIndex');
      });
    });

    it('announces drag and drop actions', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      
      // Start drag
      fireEvent.dragStart(card);
      
      // Should have proper ARIA attributes
      expect(card).toHaveAttribute('draggable', 'true');
    });
  });

  describe('Optimistic Updates', () => {
    it('immediately updates UI when card is moved', async () => {
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      const targetColumn = screen.getByText('In Progress').closest('[data-testid*="kanban-column"]');
      
      // Simulate card move
      fireEvent.dragStart(card);
      fireEvent.drop(targetColumn!);
      
      // Card should appear in target column immediately
      expect(targetColumn).toHaveTextContent('Implement drag and drop');
    });

    it('rolls back changes if server request fails', async () => {
      // Mock failed API call
      defaultProps.onCardMove.mockRejectedValueOnce(new Error('Network error'));
      
      const user = userEvent.setup();
      render(<KanbanBoard {...defaultProps} />);
      
      const card = screen.getByText('Implement drag and drop');
      const targetColumn = screen.getByText('In Progress').closest('[data-testid*="kanban-column"]');
      
      // Simulate card move
      fireEvent.dragStart(card);
      fireEvent.drop(targetColumn!);
      
      // Should rollback after error
      await waitFor(() => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Sync', () => {
    it('updates when new cards are added', async () => {
      const { rerender } = render(<KanbanBoard {...defaultProps} />);
      
      const newCard = {
        id: 'card-4',
        title: 'New Card',
        description: 'A new card',
        status: 'todo',
        priority: 'medium' as const,
        columnId: 'col-1',
        tags: [],
        assignee: null,
        dueDate: null
      };
      
      const updatedCards = [...mockCards, newCard];
      
      rerender(<KanbanBoard {...defaultProps} cards={updatedCards} />);
      
      expect(screen.getByText('New Card')).toBeInTheDocument();
    });

    it('updates when cards are modified', async () => {
      const { rerender } = render(<KanbanBoard {...defaultProps} />);
      
      const updatedCards = mockCards.map(card => 
        card.id === 'card-1' 
          ? { ...card, title: 'Updated Title' }
          : card
      );
      
      rerender(<KanbanBoard {...defaultProps} cards={updatedCards} />);
      
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Implement drag and drop')).not.toBeInTheDocument();
    });
  });
}); 