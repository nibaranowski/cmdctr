import React, { useState } from 'react';

import { MetaBox } from '../../models/MetaBox';

import { CoreObject } from './types';

interface MetaBoxDetailPanelProps {
  object: CoreObject;
  metaBox: MetaBox;
  userId: string;
  canEdit: boolean;
  assignedAgents: string[];
  onClose: () => void;
  onAgentAssign: (agentId: string) => void;
  onObjectUpdate?: (objectId: string, updates: Partial<CoreObject>) => Promise<void>;
  'data-testid'?: string;
}

export const MetaBoxDetailPanel: React.FC<MetaBoxDetailPanelProps> = ({
  object,
  metaBox,
  userId,
  canEdit,
  assignedAgents,
  onClose,
  onAgentAssign,
  onObjectUpdate,
  'data-testid': dataTestId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedObject, setEditedObject] = useState<Partial<CoreObject>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get current phase index for progress calculation
  const currentPhaseIndex = metaBox.phases.findIndex(phase => phase.name === object.phase);
  const progressPercentage = ((currentPhaseIndex + 1) / metaBox.phases.length) * 100;

  const handleSave = async () => {
    if (!onObjectUpdate) return;
    
    setIsSaving(true);
    try {
      await onObjectUpdate(object.id, editedObject);
      setIsEditing(false);
      setEditedObject({});
    } catch (error) {
      console.error('Failed to update object:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedObject({});
  };

  return (
    <div 
      className="w-96 bg-white border-l border-gray-200 flex flex-col"
      data-testid={dataTestId}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Object Details</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Object Details Section */}
        <div className="p-4 border-b border-gray-200" data-testid="object-details">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Object Details</h3>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editedObject.title || object.title}
                  onChange={(e) => setEditedObject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editedObject.status || object.status}
                  onChange={(e) => setEditedObject(prev => ({ ...prev, status: e.target.value as CoreObject['status'] }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phase</label>
                <select
                  value={editedObject.phase || object.phase}
                  onChange={(e) => setEditedObject(prev => ({ ...prev, phase: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {metaBox.phases.map((phase) => (
                    <option key={phase.id} value={phase.name}>{phase.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <p className="text-sm text-gray-900">{object.title}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  object.status === 'active' ? 'bg-green-100 text-green-800' :
                  object.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  object.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {object.status}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phase</label>
                <p className="text-sm text-gray-900">{object.phase}</p>
              </div>

              {object.assignee && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assignee</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {object.assignee.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{object.assignee}</span>
                  </div>
                </div>
              )}

              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Details
                </button>
              )}
            </div>
          )}
        </div>

        {/* Phase Progress Section */}
        <div className="p-4 border-b border-gray-200" data-testid="phase-progress">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Pipeline Progress</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {metaBox.phases.map((phase, index) => (
              <div
                key={phase.id}
                className={`flex items-center space-x-2 text-sm ${
                  index <= currentPhaseIndex ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  index < currentPhaseIndex ? 'bg-green-500' :
                  index === currentPhaseIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className={index === currentPhaseIndex ? 'font-medium' : ''}>
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Actions Section */}
        <div className="p-4" data-testid="agent-actions">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Agent Actions</h3>
          
          <div className="space-y-3">
            {/* Assigned Agents */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Assigned Agents</label>
              {assignedAgents.length > 0 ? (
                <div className="space-y-2">
                  {assignedAgents.map((agentId) => (
                    <div key={agentId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-900">{agentId}</span>
                      {canEdit && (
                        <button
                          onClick={() => onAgentAssign(agentId)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No agents assigned</p>
              )}
            </div>

            {/* Agent Assignment */}
            {canEdit && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Assign Agent</label>
                <div className="flex space-x-2">
                  <select className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select an agent...</option>
                    <option value="agent_1">Fundraising Agent</option>
                    <option value="agent_2">Research Agent</option>
                    <option value="agent_3">Outreach Agent</option>
                  </select>
                  <button
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}

            {/* Agent History */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Agent History</label>
              <button
                className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Agent History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 