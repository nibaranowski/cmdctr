import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useCallback } from 'react';

import { KanbanCard } from './KanbanCard';
import { KanbanCard as KanbanCardType } from './types';

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    order: number;
    color: string;
  };
  cards: KanbanCardType[];
  isDragging: boolean;
  draggedCardId: string | null;
  focusedCardId: string | null;
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardMove: (cardId: string, targetColumnId: string, position: number) => Promise<void>;
  onCardCreate?: (columnId: string, card: Omit<KanbanCardType, 'id'>) => Promise<void>;
  onCardUpdate?: (cardId: string, updates: Partial<KanbanCardType>) => Promise<void>;
  onCardDelete?: (cardId: string) => Promise<void>;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onDrop: (position: number) => void;
  onColumnReorder?: (columnId: string, newOrder: number) => Promise<void>;
  'data-testid'?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  isDragging,
  draggedCardId,
  focusedCardId,
  selectedCardId,
  onCardSelect,
  onCardMove,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  onDragStart,
  onDragEnd,
  onDrop,
  onColumnReorder,
  'data-testid': dataTestId
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    
    const rect = e.currentTarget.getBoundingClientRect();
    const dropY = e.clientY - rect.top;
    const cardHeight = 80; // Approximate card height
    const position = Math.floor(dropY / cardHeight);
    
    onDrop(position);
  }, [onDrop]);

  const handleAddCard = useCallback(async () => {
    if (!newCardTitle.trim() || !onCardCreate) return;

    try {
      await onCardCreate(column.id, {
        title: newCardTitle.trim(),
        columnId: column.id,
        priority: 'medium'
      });
      setNewCardTitle('');
      setIsAddingCard(false);
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  }, [newCardTitle, column.id, onCardCreate]);

  const handleUpdateTitle = useCallback(async () => {
    if (!editedTitle.trim() || editedTitle === column.title) {
      setIsEditingTitle(false);
      setEditedTitle(column.title);
      return;
    }

    try {
      // This would typically update the column title
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update column title:', error);
      setEditedTitle(column.title);
    }
  }, [editedTitle, column.title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isAddingCard) {
        handleAddCard();
      } else if (isEditingTitle) {
        handleUpdateTitle();
      }
    } else if (e.key === 'Escape') {
      if (isAddingCard) {
        setIsAddingCard(false);
        setNewCardTitle('');
      } else if (isEditingTitle) {
        setIsEditingTitle(false);
        setEditedTitle(column.title);
      }
    }
  }, [isAddingCard, isEditingTitle, handleAddCard, handleUpdateTitle, column.title]);

  return (
    <div
      className={`w-80 flex-shrink-0 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 transition-colors ${
        isDragging ? 'border-blue-300 bg-blue-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label={`${column.title} column`}
      data-testid={dataTestId}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleUpdateTitle}
              className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h3 
              className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </h3>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {cards.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsAddingCard(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Add card"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <KanbanCard
                card={card}
                isSelected={selectedCardId === card.id}
                isFocused={focusedCardId === card.id}
                isDragging={draggedCardId === card.id}
                onSelect={() => onCardSelect(card.id)}
                onDragStart={() => onDragStart(card.id)}
                onDragEnd={onDragEnd}
                onUpdate={onCardUpdate || (async () => {})}
                onDelete={onCardDelete || (async () => {})}
                data-testid={`kanban-card-${card.id}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Card Form */}
        <AnimatePresence>
          {isAddingCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-300 rounded-lg p-3"
            >
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter card title..."
                className="w-full text-sm border-none resize-none focus:outline-none focus:ring-0"
                rows={2}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={handleAddCard}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Add Card
                </button>
                <button
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                  }}
                  className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {cards.length === 0 && !isAddingCard && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No cards in this column</p>
            <button
              onClick={() => setIsAddingCard(true)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
            >
              Add card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 