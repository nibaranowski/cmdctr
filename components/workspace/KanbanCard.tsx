import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useCallback, useRef } from 'react';

import { KanbanCard as KanbanCardType } from './types';

interface KanbanCardProps {
  card: KanbanCardType;
  isSelected: boolean;
  isFocused: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onUpdate?: (cardId: string, updates: Partial<KanbanCardType>) => Promise<void>;
  onDelete?: (cardId: string) => Promise<void>;
  'data-testid'?: string;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  isSelected,
  isFocused,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onUpdate,
  onDelete,
  'data-testid': dataTestId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getPriorityColor = (priority: KanbanCardType['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const handleClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
    onDragStart();
  }, [card.id, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditedTitle(card.title);
  }, [card.title]);

  const handleTitleSave = useCallback(async () => {
    if (!editedTitle.trim() || editedTitle === card.title) {
      setIsEditing(false);
      setEditedTitle(card.title);
      return;
    }

    if (onUpdate) {
      try {
        await onUpdate(card.id, { title: editedTitle.trim() });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update card title:', error);
        setEditedTitle(card.title);
      }
    }
  }, [editedTitle, card.title, card.id, onUpdate]);

  const handleTitleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedTitle(card.title);
  }, [card.title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditing) {
        handleTitleSave();
      } else {
        onSelect();
      }
    } else if (e.key === 'Escape') {
      if (isEditing) {
        handleTitleCancel();
      }
    } else if (e.key === 'Delete' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onDelete?.(card.id);
    }
  }, [isEditing, handleTitleSave, handleTitleCancel, onSelect, onDelete, card.id]);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      try {
        await onDelete(card.id);
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  }, [card.id, onDelete]);

  return (
    <div
      ref={cardRef}
      className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50 scale-105' : ''} ${isFocused ? 'ring-2 ring-blue-300' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${card.title} card`}
      data-testid={dataTestId}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleTitleSave}
              className="w-full text-sm font-medium text-gray-900 bg-transparent border-none resize-none focus:outline-none focus:ring-0"
              rows={2}
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {card.title}
            </h3>
          )}
        </div>
        
        {/* Priority indicator */}
        <div 
          className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${getPriorityColor(card.priority)}`}
          title={`Priority: ${card.priority}`}
        />
      </div>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Assignee */}
          {card.assignee && (
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {card.assignee.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Due date */}
          {card.dueDate && (
            <span className="text-xs text-gray-500">
              {new Date(card.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Edit"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Focus indicator for accessibility */}
      {isFocused && (
        <div className="absolute inset-0 ring-2 ring-blue-500 ring-inset rounded-lg pointer-events-none" />
      )}
    </div>
  );
}; 