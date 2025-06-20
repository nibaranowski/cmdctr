import React, { useState } from 'react';

import { MetaBoxPhase } from '../../models/MetaBox';

interface MetaBoxPhaseCardProps {
  phase: MetaBoxPhase;
  isSelected: boolean;
  canEdit: boolean;
  onUpdate: (updates: Partial<MetaBoxPhase>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const MetaBoxPhaseCard: React.FC<MetaBoxPhaseCardProps> = ({
  phase,
  isSelected,
  canEdit,
  onUpdate,
  onDelete,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(phase.name);
  const [editDescription, setEditDescription] = useState(phase.description || '');

  const handleSave = () => {
    onUpdate({
      name: editName,
      description: editDescription || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(phase.name);
    setEditDescription(phase.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this phase?')) {
      onDelete();
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="phase-name" className="block text-sm font-medium text-gray-700 mb-1">
                Phase Name
              </label>
              <input
                id="phase-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phase name"
              />
            </div>
            <div>
              <label htmlFor="phase-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="phase-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phase description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editName.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {phase.order}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900">{phase.name}</h3>
                </div>
                {phase.description && (
                  <p className="text-gray-600 mt-1">{phase.description}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Edit phase"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete phase"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {phase.agent_id && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Agent assigned
                  </span>
                )}
                <span>Created {new Date(phase.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  ID: {phase.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 