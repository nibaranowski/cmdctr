import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MetaBox } from '../../models/MetaBox';


import { MetaBoxDetailPanel } from './MetaBoxDetailPanel';
import { MetaBoxHeader } from './MetaBoxHeader';
import { MetaBoxKanbanView } from './MetaBoxKanbanView';
import { MetaBoxListView } from './MetaBoxListView';
import { CoreObject } from './types';
import { ViewToggle } from './ViewToggle';

interface MetaBoxWorkspaceProps {
  metaBox: MetaBox;
  userId: string;
  onSave: (metaBox: MetaBox) => Promise<void>;
  coreObjects?: CoreObject[];
  onObjectUpdate?: (objectId: string, updates: Partial<CoreObject>) => Promise<void>;
  onObjectCreate?: (object: Omit<CoreObject, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onObjectDelete?: (objectId: string) => Promise<void>;
}

type ViewMode = 'kanban' | 'list';

export const MetaBoxWorkspace: React.FC<MetaBoxWorkspaceProps> = ({
  metaBox,
  userId,
  onSave,
  coreObjects = [],
  onObjectUpdate,
  onObjectCreate,
  onObjectDelete
}) => {
  // View state management with persistence
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    `metabox-${metaBox.id}-view-mode`,
    'kanban'
  );

  // Selection state
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // Drag and drop state
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Agent state
  const [assignedAgents, setAssignedAgents] = useState<Record<string, string[]>>({});

  // Check permissions
  const canEdit = metaBox.canEdit(userId);
  const canAccess = metaBox.canAccess(userId);

  // Handle object selection
  const handleObjectSelect = useCallback((objectId: string) => {
    setSelectedObjectId(objectId);
    setIsDetailPanelOpen(true);
  }, []);

  // Handle view toggle
  const handleViewToggle = useCallback((newView: ViewMode) => {
    setViewMode(newView);
  }, [setViewMode]);

  // Handle drag and drop
  const handleDragStart = useCallback((objectId: string) => {
    if (!canEdit) return;
    
    setDraggedObjectId(objectId);
    setIsDragging(true);
  }, [canEdit]);

  const handleDragEnd = useCallback(() => {
    setDraggedObjectId(null);
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (targetPhase: string) => {
    if (!draggedObjectId || !onObjectUpdate) return;

    try {
      await onObjectUpdate(draggedObjectId, { phase: targetPhase });
    } catch (error) {
      console.error('Failed to update object phase:', error);
    } finally {
      setDraggedObjectId(null);
      setIsDragging(false);
    }
  }, [draggedObjectId, onObjectUpdate]);

  // Handle agent assignment
  const handleAgentAssign = useCallback(async (objectId: string, agentId: string) => {
    if (!canEdit) return;

    const currentAgents = assignedAgents[objectId] || [];
    const newAgents = currentAgents.includes(agentId)
      ? currentAgents.filter(id => id !== agentId)
      : [...currentAgents, agentId];

    setAssignedAgents(prev => ({
      ...prev,
      [objectId]: newAgents
    }));
  }, [assignedAgents, canEdit]);

  // Close detail panel when no object is selected
  useEffect(() => {
    if (!selectedObjectId) {
      setIsDetailPanelOpen(false);
    }
  }, [selectedObjectId]);

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view this meta box.</p>
        </div>
      </div>
    );
  }

  const selectedObject = coreObjects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Unified Header - Consistent across all meta box types */}
      <MetaBoxHeader
        metaBox={metaBox}
        userId={userId}
        onSave={onSave}
        canEdit={canEdit}
        viewMode={viewMode}
        onViewToggle={handleViewToggle}
        data-testid="metabox-header"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden" data-testid="main-content">
        {/* Main View - Kanban or List */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'kanban' ? (
            <MetaBoxKanbanView
              metaBox={metaBox}
              coreObjects={coreObjects}
              selectedObjectId={selectedObjectId}
              draggedObjectId={draggedObjectId}
              isDragging={isDragging}
              canEdit={canEdit}
              onObjectSelect={handleObjectSelect}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              data-testid="kanban-view"
            />
          ) : (
            <MetaBoxListView
              metaBox={metaBox}
              coreObjects={coreObjects}
              selectedObjectId={selectedObjectId}
              canEdit={canEdit}
              onObjectSelect={handleObjectSelect}
              onObjectUpdate={onObjectUpdate}
              onObjectDelete={onObjectDelete}
              data-testid="list-view"
            />
          )}
        </div>

        {/* Right-Side Detail Panel - Consistent structure */}
        {isDetailPanelOpen && selectedObject && (
          <MetaBoxDetailPanel
            object={selectedObject}
            metaBox={metaBox}
            userId={userId}
            canEdit={canEdit}
            assignedAgents={assignedAgents[selectedObject.id] || []}
            onClose={() => {
              setSelectedObjectId(null);
              setIsDetailPanelOpen(false);
            }}
            onAgentAssign={(agentId: string) => handleAgentAssign(selectedObject.id, agentId)}
            onObjectUpdate={onObjectUpdate}
            data-testid="detail-panel"
          />
        )}
      </div>

      {/* View Toggle - Always accessible */}
      <ViewToggle
        currentView={viewMode}
        onViewChange={handleViewToggle}
        className="fixed bottom-6 right-6 z-10"
      />
    </div>
  );
}; 