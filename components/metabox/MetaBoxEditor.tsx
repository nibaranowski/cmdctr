import React, { useState, useCallback, useRef } from 'react';

import { MetaBox, MetaBoxPhase, MetaBoxTemplate } from '../../models/MetaBox';

import { MetaBoxPhaseCard } from './MetaBoxPhaseCard';
import { MetaBoxTemplateSelector } from './MetaBoxTemplateSelector';
import { MetaBoxToolbar } from './MetaBoxToolbar';
import { UndoRedoManager } from './UndoRedoManager';

interface MetaBoxEditorProps {
  metaBox: MetaBox;
  onSave: (metaBox: MetaBox) => void;
  onCancel: () => void;
  companyId: string;
  userId: string;
}

export const MetaBoxEditor: React.FC<MetaBoxEditorProps> = ({
  metaBox,
  onSave,
  onCancel,
  companyId,
  userId
}) => {
  const [currentMetaBox, setCurrentMetaBox] = useState<MetaBox>(metaBox);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const undoRedoManager = useRef(new UndoRedoManager<MetaBox>());
  const dragRef = useRef<HTMLDivElement>(null);

  // Check permissions
  const canEdit = currentMetaBox.canEdit(userId);
  const canAccess = currentMetaBox.canAccess(userId);

  const handlePhaseAdd = useCallback((phaseData: Omit<MetaBoxPhase, 'id' | 'metabox_id' | 'created_at' | 'updated_at'>) => {
    if (!canEdit) return;

    const newMetaBox = new MetaBox({
      ...currentMetaBox,
      phases: [...currentMetaBox.phases]
    });
    newMetaBox.addPhase(phaseData);
    
    undoRedoManager.current.pushState(currentMetaBox);
    setCurrentMetaBox(newMetaBox);
  }, [currentMetaBox, canEdit]);

  const handlePhaseUpdate = useCallback((phaseId: string, updates: Partial<MetaBoxPhase>) => {
    if (!canEdit) return;

    const newMetaBox = new MetaBox({
      ...currentMetaBox,
      phases: currentMetaBox.phases.map(phase => 
        phase.id === phaseId ? { ...phase, ...updates } : phase
      )
    });
    
    undoRedoManager.current.pushState(currentMetaBox);
    setCurrentMetaBox(newMetaBox);
  }, [currentMetaBox, canEdit]);

  const handlePhaseDelete = useCallback((phaseId: string) => {
    if (!canEdit) return;

    const newMetaBox = new MetaBox({
      ...currentMetaBox,
      phases: [...currentMetaBox.phases]
    });
    newMetaBox.removePhase(phaseId);
    
    undoRedoManager.current.pushState(currentMetaBox);
    setCurrentMetaBox(newMetaBox);
  }, [currentMetaBox, canEdit]);

  const handlePhaseReorder = useCallback((draggedId: string, targetId: string) => {
    if (!canEdit) return;

    const phases = [...currentMetaBox.phases];
    const draggedIndex = phases.findIndex(p => p.id === draggedId);
    const targetIndex = phases.findIndex(p => p.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [draggedPhase] = phases.splice(draggedIndex, 1);
    phases.splice(targetIndex, 0, draggedPhase);
    
    // Update order numbers
    phases.forEach((phase, index) => {
      phase.order = index + 1;
    });
    
    const newMetaBox = new MetaBox({
      ...currentMetaBox,
      phases
    });
    
    undoRedoManager.current.pushState(currentMetaBox);
    setCurrentMetaBox(newMetaBox);
  }, [currentMetaBox, canEdit]);

  const handleUndo = useCallback(() => {
    const previousState = undoRedoManager.current.undo();
    if (previousState) {
      setCurrentMetaBox(previousState);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const nextState = undoRedoManager.current.redo();
    if (nextState) {
      setCurrentMetaBox(nextState);
    }
  }, []);

  const handleTemplateApply = useCallback((template: MetaBoxTemplate) => {
    if (!canEdit) return;

    const newMetaBox = new MetaBox({
      ...currentMetaBox,
      phases: [...currentMetaBox.phases]
    });
    newMetaBox.applyTemplate(template);
    
    undoRedoManager.current.pushState(currentMetaBox);
    setCurrentMetaBox(newMetaBox);
    setShowTemplateSelector(false);
  }, [currentMetaBox, canEdit]);

  const handleSave = useCallback(async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      await onSave(currentMetaBox);
    } catch (error) {
      console.error('Failed to save meta box:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentMetaBox, onSave, canEdit]);

  const handleDragStart = useCallback((e: React.DragEvent, phaseId: string) => {
    if (!canEdit) return;
    
    setIsDragging(true);
    setSelectedPhaseId(phaseId);
    e.dataTransfer.setData('text/plain', phaseId);
  }, [canEdit]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setSelectedPhaseId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetPhaseId: string) => {
    if (!canEdit) return;
    
    e.preventDefault();
    const draggedPhaseId = e.dataTransfer.getData('text/plain');
    
    if (draggedPhaseId && draggedPhaseId !== targetPhaseId) {
      handlePhaseReorder(draggedPhaseId, targetPhaseId);
    }
  }, [canEdit, handlePhaseReorder]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentMetaBox.name}</h1>
            {currentMetaBox.description && (
              <p className="text-gray-600 mt-1">{currentMetaBox.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <MetaBoxToolbar
              canEdit={canEdit}
              canUndo={undoRedoManager.current.canUndo()}
              canRedo={undoRedoManager.current.canRedo()}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onTemplateSelect={() => setShowTemplateSelector(true)}
              onSave={handleSave}
              onCancel={onCancel}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Phases Column */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phases</h2>
              {canEdit && (
                <button
                  onClick={() => handlePhaseAdd({
                    name: 'New Phase',
                    order: currentMetaBox.phases.length + 1,
                    description: ''
                  })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Phase
                </button>
              )}
            </div>

            <div className="space-y-4">
              {currentMetaBox.phases.map((phase, index) => (
                <div
                  key={phase.id}
                  ref={dragRef}
                  draggable={canEdit}
                  onDragStart={(e) => handleDragStart(e, phase.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, phase.id)}
                  onDragOver={handleDragOver}
                  className={`transition-all duration-200 ${
                    isDragging && selectedPhaseId === phase.id ? 'opacity-50' : ''
                  }`}
                >
                  <MetaBoxPhaseCard
                    phase={phase}
                    isSelected={selectedPhaseId === phase.id}
                    canEdit={canEdit}
                    onUpdate={(updates) => handlePhaseUpdate(phase.id, updates)}
                    onDelete={() => handlePhaseDelete(phase.id)}
                    onSelect={() => setSelectedPhaseId(phase.id)}
                  />
                </div>
              ))}
              
              {currentMetaBox.phases.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No phases yet</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first phase or applying a template.</p>
                  {canEdit && (
                    <div className="space-x-3">
                      <button
                        onClick={() => handlePhaseAdd({
                          name: 'First Phase',
                          order: 1,
                          description: 'Start here'
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add First Phase
                      </button>
                      <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Apply Template
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <MetaBoxTemplateSelector
          onSelect={handleTemplateApply}
          onCancel={() => setShowTemplateSelector(false)}
          currentPhases={currentMetaBox.phases}
        />
      )}
    </div>
  );
}; 