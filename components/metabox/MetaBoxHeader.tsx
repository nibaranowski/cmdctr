import React, { useState } from 'react';

import { MetaBox } from '../../models/MetaBox';

import { ViewToggle } from './ViewToggle';

interface MetaBoxHeaderProps {
  metaBox: MetaBox;
  userId: string;
  onSave: (metaBox: MetaBox) => Promise<void>;
  canEdit: boolean;
  viewMode: 'kanban' | 'list';
  onViewToggle: (view: 'kanban' | 'list') => void;
  'data-testid'?: string;
}

export const MetaBoxHeader: React.FC<MetaBoxHeaderProps> = ({
  metaBox,
  userId,
  onSave,
  canEdit,
  viewMode,
  onViewToggle,
  'data-testid': dataTestId
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSave = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      await onSave(metaBox);
    } catch (error) {
      console.error('Failed to save meta box:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header 
      className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200"
      data-testid={dataTestId}
    >
      {/* Left side - Meta box info */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{metaBox.name}</h1>
          {metaBox.description && (
            <p className="text-sm text-gray-600 mt-1">{metaBox.description}</p>
          )}
        </div>
        
        {/* Meta box status indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Active</span>
        </div>
      </div>

      {/* Center - View toggle */}
      <div className="flex items-center space-x-4">
        <ViewToggle
          currentView={viewMode}
          onViewChange={onViewToggle}
        />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Agent overview */}
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Agent Overview"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Agents
        </button>

        {/* Settings */}
        {canEdit && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Settings"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        )}

        {/* Save button */}
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </>
            )}
          </button>
        )}
      </div>

      {/* Settings dropdown */}
      {showSettings && canEdit && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-10">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Box Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Box Name
                </label>
                <input
                  type="text"
                  value={metaBox.name}
                  onChange={(e) => metaBox.update({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={metaBox.description || ''}
                  onChange={(e) => metaBox.update({ description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}; 