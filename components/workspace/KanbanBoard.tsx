import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useOptimisticUpdates } from '../../hooks/useOptimisticUpdates';

import { KanbanColumn } from './KanbanColumn';
import { SearchModal } from './SearchModal';
import { KanbanCard } from './types';


export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  color: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardMove?: (cardId: string, targetColumnId: string, position: number) => Promise<void>;
  onColumnReorder?: (columnId: string, newOrder: number) => Promise<void>;
  onCardSelect?: (cardId: string) => void;
  onCardCreate?: (columnId: string, card: Omit<KanbanCard, 'id'>) => Promise<void>;
  onCardUpdate?: (cardId: string, updates: Partial<KanbanCard>) => Promise<void>;
  onCardDelete?: (cardId: string) => Promise<void>;
  selectedCardId?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  cards,
  onCardMove,
  onColumnReorder,
  onCardSelect,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  selectedCardId,
  isLoading = false,
  error = null
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Custom hooks for functionality
  const { optimisticData, applyOptimisticUpdate, revertOptimisticUpdate } = useOptimisticUpdates(cards);
  const { isDragging, dragStart, dragEnd, drop } = useDragAndDrop();
  const { handleKeyDown, focusNextCard, focusPreviousCard } = useKeyboardNavigation(cards, focusedCardId, setFocusedCardId);

  // Handle Cmd+K search
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle card movement
  const handleCardMove = useCallback(async (cardId: string, targetColumnId: string, position: number) => {
    if (!onCardMove) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || (card && card.columnId === targetColumnId)) return;

    // Apply optimistic update
    applyOptimisticUpdate(cardId, { columnId: targetColumnId });

    try {
      await onCardMove(cardId, targetColumnId, position);
    } catch (error) {
      // Revert on error
      revertOptimisticUpdate(cardId);
      console.error('Failed to move card:', error);
    }
  }, [cards, onCardMove, applyOptimisticUpdate, revertOptimisticUpdate]);

  // Handle column reordering
  const handleColumnReorder = useCallback(async (columnId: string, newOrder: number) => {
    if (!onColumnReorder) return;

    try {
      await onColumnReorder(columnId, newOrder);
    } catch (error) {
      console.error('Failed to reorder column:', error);
    }
  }, [onColumnReorder]);

  // Handle card selection
  const handleCardSelect = useCallback((cardId: string) => {
    setFocusedCardId(cardId);
    onCardSelect?.(cardId);
  }, [onCardSelect]);

  // Handle drag start
  const handleDragStart = useCallback((cardId: string, columnId: string) => {
    setDraggedCardId(cardId);
    setDraggedColumnId(columnId);
    dragStart();
  }, [dragStart]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedCardId(null);
    setDraggedColumnId(null);
    dragEnd();
  }, [dragEnd]);

  // Handle drop
  const handleDrop = useCallback((targetColumnId: string, position: number) => {
    if (draggedCardId) {
      handleCardMove(draggedCardId, targetColumnId, position);
    }
    handleDragEnd();
  }, [draggedCardId, handleCardMove, handleDragEnd]);

  // Group cards by column
  const cardsByColumn = (optimisticData || []).reduce((acc, card) => {
    if (!acc[card.columnId]) {
      acc[card.columnId] = [];
    }
    acc[card.columnId].push(card);
    return acc;
  }, {} as Record<string, KanbanCard[]>);

  // Sort columns by order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Board</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={boardRef}
      className="flex flex-col h-full bg-gray-50"
      role="region"
      aria-label="Kanban board"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid="kanban-board"
    >
      {/* Board Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Kanban Board</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
            <span className="ml-2 text-xs text-gray-500">⌘K</span>
          </button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex space-x-4 min-w-max">
          <AnimatePresence>
            {sortedColumns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <KanbanColumn
                  column={column}
                  cards={cardsByColumn[column.id] || []}
                  isDragging={isDragging}
                  draggedCardId={draggedCardId}
                  focusedCardId={focusedCardId}
                  selectedCardId={selectedCardId}
                  onCardSelect={handleCardSelect}
                  onCardMove={handleCardMove}
                  onCardCreate={onCardCreate}
                  onCardUpdate={onCardUpdate}
                  onCardDelete={onCardDelete}
                  onDragStart={(cardId) => handleDragStart(cardId, column.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={(position) => handleDrop(column.id, position)}
                  onColumnReorder={handleColumnReorder}
                  data-testid={`kanban-column-${column.id}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            cards={cards}
            onCardSelect={handleCardSelect}
            onClose={() => setIsSearchOpen(false)}
            data-testid="search-modal"
          />
        )}
      </AnimatePresence>

      {/* Mobile Layout Indicator */}
      <div className="hidden md:block" data-testid="desktop-layout" />
      <div className="md:hidden" data-testid="mobile-layout" />
    </div>
  );
}; 