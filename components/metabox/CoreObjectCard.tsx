import React from 'react';

import { CoreObject } from './types';

interface CoreObjectCardProps {
  object: CoreObject;
  isSelected: boolean;
  isDragging: boolean;
  canEdit: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  'data-testid'?: string;
}

export const CoreObjectCard: React.FC<CoreObjectCardProps> = ({
  object,
  isSelected,
  isDragging,
  canEdit,
  onSelect,
  onDragStart,
  onDragEnd,
  'data-testid': dataTestId
}) => {
  const getStatusColor = (status: CoreObject['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: CoreObject['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
      draggable={canEdit}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-testid={dataTestId || 'core-object-card'}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-medium text-gray-900 truncate"
            data-testid="card-title"
          >
            {object.title}
          </h3>
        </div>
        
        {/* Priority indicator */}
        {object.priority && (
          <div 
            className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${getPriorityColor(object.priority)}`}
            title={`Priority: ${object.priority}`}
          />
        )}
      </div>

      {/* Status and Phase */}
      <div className="flex items-center justify-between mb-3">
        <span 
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(object.status)}`}
          data-testid="card-status"
        >
          {object.status}
        </span>
        
        <span 
          className="text-xs text-gray-500"
          data-testid="card-phase"
        >
          {object.phase}
        </span>
      </div>

      {/* Assignee */}
      {object.assignee && (
        <div className="flex items-center mb-3" data-testid="card-assignee">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {object.assignee.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-600 ml-2 truncate">
            {object.assignee}
          </span>
        </div>
      )}

      {/* Footer - Timestamps */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created {new Date(object.created_at).toLocaleDateString()}</span>
        <span>Updated {new Date(object.updated_at).toLocaleDateString()}</span>
      </div>

      {/* Hover actions */}
      {canEdit && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
            title="Edit"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}; 