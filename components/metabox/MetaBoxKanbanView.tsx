import React, { useState, useRef } from 'react';
import { MetaBoxManifest } from '../../types/metaBoxManifest';
import MetaBoxCoreObjectCard from './MetaBoxCoreObjectCard';

interface CoreObject {
  id: string;
  currentPhase: string;
  [key: string]: any;
}

interface MetaBoxKanbanViewProps {
  manifest: MetaBoxManifest;
  coreObjects: CoreObject[];
  selectedObjectId?: string | null;
  onObjectSelect?: (objectId: string) => void;
  onObjectMove?: (objectId: string, fromPhase: string, toPhase: string) => void;
}

const MetaBoxKanbanView: React.FC<MetaBoxKanbanViewProps> = ({
  manifest,
  coreObjects,
  selectedObjectId,
  onObjectSelect,
  onObjectMove,
}) => {
  const [draggedObject, setDraggedObject] = useState<string | null>(null);
  const [dragOverPhase, setDragOverPhase] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, objectId: string) => {
    setDraggedObject(objectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', objectId);
  };

  const handleDragOver = (e: React.DragEvent, phaseId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPhase(phaseId);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverPhase(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetPhaseId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverPhase(null);
    
    if (draggedObject && onObjectMove) {
      const draggedObjectData = coreObjects.find(obj => obj.id === draggedObject);
      if (draggedObjectData && draggedObjectData.currentPhase !== targetPhaseId) {
        onObjectMove(draggedObject, draggedObjectData.currentPhase, targetPhaseId);
      }
    }
    setDraggedObject(null);
  };

  const getObjectsForPhase = (phaseId: string) => {
    return coreObjects.filter(obj => obj.currentPhase === phaseId);
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'complete': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex space-x-6 h-full overflow-x-auto p-4">
      {manifest.phases.map((phase) => {
        const phaseObjects = getObjectsForPhase(phase.id);
        const isDragOver = dragOverPhase === phase.id;
        
        return (
          <div
            key={phase.id}
            className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg border-2 border-dashed transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-200'
            }`}
            onDragOver={(e) => handleDragOver(e, phase.id)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, phase.id)}
            data-testid={`kanban-phase-${phase.id}`}
          >
            {/* Phase Header */}
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPhaseStatusColor(phase.status)}`} />
                  <h3 className="font-medium text-gray-900">{phase.name}</h3>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {phaseObjects.length}
                </span>
              </div>
            </div>

            {/* Phase Content */}
            <div className="p-4 space-y-3 min-h-[400px]">
              {phaseObjects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">No items</p>
                </div>
              ) : (
                phaseObjects.map((coreObject) => (
                  <div
                    key={coreObject.id}
                    className={`transition-transform duration-200 ${
                      draggedObject === coreObject.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <MetaBoxCoreObjectCard
                      coreObject={coreObject}
                      manifest={manifest}
                      isSelected={selectedObjectId === coreObject.id}
                      onClick={() => onObjectSelect?.(coreObject.id)}
                      onDragStart={(e) => handleDragStart(e, coreObject.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetaBoxKanbanView; 