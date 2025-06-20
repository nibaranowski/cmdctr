import React, { useState } from 'react';

import { KanbanCard } from './KanbanCard';
import { KanbanColumnHeader } from './KanbanColumnHeader';
import { KanbanColumn, KanbanItem, Agent } from './WorkspaceLayout';

interface KanbanBoardProps {
  title: string;
  columns: KanbanColumn[];
  workspaceType: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  title,
  columns,
  workspaceType,
}) => {
  const [boardColumns, setBoardColumns] = useState<KanbanColumn[]>(columns);
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);

  const handleDragStart = (item: KanbanItem) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (columnId: string, item: KanbanItem) => {
    if (!draggedItem) return;

    setBoardColumns(prev => {
      const newColumns = prev.map(col => {
        // Remove from source column
        if (col.items.find(i => i.id === draggedItem.id)) {
          return {
            ...col,
            items: col.items.filter(i => i.id !== draggedItem.id)
          };
        }
        // Add to target column
        if (col.id === columnId) {
          return {
            ...col,
            items: [...col.items, draggedItem]
          };
        }
        return col;
      });
      return newColumns;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full capitalize">
            {workspaceType}
          </span>
        </div>
        
        {/* Board Actions */}
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full p-4 space-x-4 min-w-max">
          {boardColumns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedItem) {
                  handleDrop(column.id, draggedItem);
                }
              }}
            >
              <KanbanColumnHeader 
                title={column.title}
                itemCount={column.items.length}
                phaseId={column.phaseId}
              />
              
              <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {column.items.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onDragStart={() => handleDragStart(item)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
                
                {/* Add Item Button */}
                <button className="w-full p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors">
                  + Add item
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Column Button */}
          <div className="flex-shrink-0 w-80 flex items-center justify-center">
            <button className="w-full p-4 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Column
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 