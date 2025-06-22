import React from 'react';
import { MetaBoxManifest } from '../../types/metaBoxManifest';

interface CoreObject {
  id: string;
  name: string;
  currentPhase: string;
  status: string;
  assignedAgent?: string;
  priority?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface MetaBoxCoreObjectCardProps {
  coreObject: CoreObject;
  manifest: MetaBoxManifest;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

const MetaBoxCoreObjectCard: React.FC<MetaBoxCoreObjectCardProps> = ({
  coreObject,
  manifest,
  isSelected = false,
  onClick,
  onDragStart,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'complete':
      case 'done':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
      case 'stuck':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedAgent = () => {
    if (!coreObject.assignedAgent) return null;
    return manifest.agents.find(agent => agent.id === coreObject.assignedAgent);
  };

  const agent = getAssignedAgent();

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      data-testid={`core-object-card-${coreObject.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {coreObject.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            ID: {coreObject.id.slice(-8)}
          </p>
        </div>
        
        {/* Status and Priority Badges */}
        <div className="flex flex-col items-end space-y-1 ml-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coreObject.status)}`}>
            {coreObject.status}
          </span>
          {coreObject.priority && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(coreObject.priority)}`}>
              {coreObject.priority}
            </span>
          )}
        </div>
      </div>

      {/* Agent Assignment */}
      {agent && (
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-blue-700">
              {agent.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-600">{agent.name}</span>
        </div>
      )}

      {/* Dynamic Fields */}
      <div className="space-y-2">
        {manifest.fields.slice(0, 3).map((field) => {
          const value = coreObject[field.key];
          if (!value) return null;

          return (
            <div key={field.key} className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{field.label}:</span>
              <span className="text-xs text-gray-900 font-medium truncate ml-2">
                {field.type === 'date' && value 
                  ? new Date(value).toLocaleDateString()
                  : field.type === 'number' && typeof value === 'number'
                  ? value.toLocaleString()
                  : String(value)
                }
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {coreObject.updatedAt 
            ? `Updated ${new Date(coreObject.updatedAt).toLocaleDateString()}`
            : 'Recently updated'
          }
        </span>
        
        {/* Phase indicator */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600">
            {manifest.phases.find(p => p.id === coreObject.currentPhase)?.name || coreObject.currentPhase}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetaBoxCoreObjectCard; 