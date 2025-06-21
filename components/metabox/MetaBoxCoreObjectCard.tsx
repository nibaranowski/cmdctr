import React from 'react';
import { MetaBoxManifest, MetaBoxCoreObjectField } from '../../types/metaBoxManifest';

interface CoreObject {
  id: string;
  [key: string]: any;
}

interface MetaBoxCoreObjectCardProps {
  coreObject: CoreObject;
  manifest: MetaBoxManifest;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

const MetaBoxCoreObjectCard: React.FC<MetaBoxCoreObjectCardProps> = ({
  coreObject,
  manifest,
  isSelected = false,
  onClick,
  onDragStart,
  className = '',
}) => {
  const getFieldValue = (field: MetaBoxCoreObjectField) => {
    const value = coreObject[field.key];
    
    switch (field.type) {
      case 'status':
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'complete' ? 'bg-blue-100 text-blue-800' :
            value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value}
          </span>
        );
      
      case 'agent':
        const agent = manifest.agents.find(a => a.id === value);
        return agent ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
              {agent.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-900">{agent.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Unassigned</span>
        );
      
      case 'date':
        return (
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString()}
          </span>
        );
      
      case 'number':
        return (
          <span className="text-sm font-medium text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        );
      
      default:
        return (
          <span className="text-sm text-gray-900 truncate">
            {value || '-'}
          </span>
        );
    }
  };

  // Filter out the name field since it's already in the header
  const displayFields = manifest.fields.filter(field => field.key !== 'name').slice(0, 3);

  return (
    <div
      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      } ${className}`}
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      data-testid={`core-object-${coreObject.id}`}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {coreObject.name || coreObject.title || `#${coreObject.id}`}
        </h3>
        {coreObject.priority && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            coreObject.priority === 'high' ? 'bg-red-100 text-red-800' :
            coreObject.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {coreObject.priority}
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-2">
        {displayFields.map((field) => (
          <div key={field.key} className="flex items-center justify-between">
            <span className="text-xs text-gray-500 capitalize">
              {field.label}:
            </span>
            <div className="flex-1 ml-2 text-right">
              {getFieldValue(field)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {coreObject.assignedAgent && (
            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
              {coreObject.assignedAgent.charAt(0)}
            </div>
          )}
          <span className="text-xs text-gray-500">
            {coreObject.currentPhase || 'No phase'}
          </span>
        </div>
        
        {coreObject.updatedAt && (
          <span className="text-xs text-gray-400">
            {new Date(coreObject.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetaBoxCoreObjectCard; 