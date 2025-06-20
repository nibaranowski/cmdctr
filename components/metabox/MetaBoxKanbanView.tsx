import React, { useCallback } from 'react';

import { MetaBox } from '../../models/MetaBox';

import { CoreObjectCard } from './CoreObjectCard';
import { CoreObject } from './MetaBoxWorkspace';

interface MetaBoxKanbanViewProps {
  metaBox: MetaBox;
  coreObjects: CoreObject[];
  selectedObjectId: string | null;
  draggedObjectId: string | null;
  isDragging: boolean;
  canEdit: boolean;
  onObjectSelect: (objectId: string) => void;
  onDragStart: (objectId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetPhase: string) => void;
  'data-testid'?: string;
}

export const MetaBoxKanbanView: React.FC<MetaBoxKanbanViewProps> = ({
  metaBox,
  coreObjects,
  selectedObjectId,
  draggedObjectId,
  isDragging,
  canEdit,
  onObjectSelect,
  onDragStart,
  onDragEnd,
  onDrop,
  'data-testid': dataTestId
}) => {
  // Group objects by phase
  const objectsByPhase = coreObjects.reduce((acc, obj) => {
    const phase = obj.phase;
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(obj);
    return acc;
  }, {} as Record<string, CoreObject[]>);

  // Handle drag over for drop zones
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, phase: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    onDrop(phase);
  }, [onDrop]);

  // Handle card drag events
  const handleCardDragStart = useCallback((e: React.DragEvent, objectId: string) => {
    onDragStart(objectId);
    e.dataTransfer.effectAllowed = 'move';
  }, [onDragStart]);

  const handleCardDragEnd = useCallback((e: React.DragEvent) => {
    onDragEnd();
  }, [onDragEnd]);

  return (
    <div 
      className="flex-1 overflow-x-auto p-6"
      data-testid={dataTestId}
    >
      <div className="flex space-x-6 min-w-max">
        {metaBox.phases.map((phase) => {
          const phaseObjects = objectsByPhase[phase.name] || [];
          
          return (
            <div
              key={phase.id}
              className="flex-shrink-0 w-80"
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">{phase.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {phaseObjects.length}
                  </span>
                </div>
                
                {canEdit && (
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Add item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Phase Column */}
              <div
                className={`min-h-[calc(100vh-200px)] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors ${
                  isDragging ? 'border-blue-300 bg-blue-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, phase.name)}
              >
                {/* Cards */}
                <div className="space-y-3">
                  {phaseObjects.map((object) => (
                    <CoreObjectCard
                      key={object.id}
                      object={object}
                      isSelected={selectedObjectId === object.id}
                      isDragging={draggedObjectId === object.id}
                      canEdit={canEdit}
                      onSelect={() => onObjectSelect(object.id)}
                      onDragStart={(e) => handleCardDragStart(e, object.id)}
                      onDragEnd={handleCardDragEnd}
                    />
                  ))}
                  
                  {/* Empty state */}
                  {phaseObjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No items in this phase</p>
                      {canEdit && (
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
                          Add item
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 