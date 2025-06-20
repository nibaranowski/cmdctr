import React from 'react';

interface KanbanColumnHeaderProps {
  title: string;
  itemCount: number;
  phaseId?: string;
}

export const KanbanColumnHeader: React.FC<KanbanColumnHeaderProps> = ({
  title,
  itemCount,
  phaseId,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {phaseId && (
          <span className="px-1.5 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded">
            Phase {phaseId}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 