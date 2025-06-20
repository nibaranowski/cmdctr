import React from 'react';

import { KanbanItem } from './WorkspaceLayout';

interface KanbanCardProps {
  item: KanbanItem;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  item,
  onDragStart,
  onDragEnd,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔥';
      case 'high':
        return '⚡';
      case 'medium':
        return '📌';
      case 'low':
        return '💡';
      default:
        return '📋';
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center space-x-1">
          <span className={`px-1.5 py-0.5 text-xs font-medium rounded border ${getPriorityColor(item.priority)}`}>
            {getPriorityIcon(item.priority)}
          </span>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        {item.assignee && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img
                src={item.assignee.avatar}
                alt={item.assignee.name}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                item.assignee.status === 'online' ? 'bg-green-400' :
                item.assignee.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
              }`} />
            </div>
            <span className="text-xs text-gray-600">{item.assignee.name}</span>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500">
          {new Date(item.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500 capitalize">
          {item.status}
        </span>
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs text-gray-400">View</span>
        </div>
      </div>
    </div>
  );
}; 