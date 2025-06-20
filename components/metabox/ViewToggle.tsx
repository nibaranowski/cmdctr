import React from 'react';

interface ViewToggleProps {
  currentView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <button
        onClick={() => onViewChange('kanban')}
        className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
          currentView === 'kanban'
            ? 'bg-blue-50 text-blue-700 border-r border-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="Kanban View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
          currentView === 'list'
            ? 'bg-blue-50 text-blue-700 border-l border-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="List View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}; 