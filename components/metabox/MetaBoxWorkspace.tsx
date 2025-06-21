import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MetaBox } from '../../models/MetaBox';


import { MetaBoxDetailPanel } from './MetaBoxDetailPanel';
import { MetaBoxHeader } from './MetaBoxHeader';
import { MetaBoxKanbanView } from './MetaBoxKanbanView';
import { MetaBoxListView } from './MetaBoxListView';
import { CoreObject } from './types';
import { ViewToggle } from './ViewToggle';
import { MetaBoxManifest } from '../../types/metaBoxManifest';
import PhasePanel from './PhasePanel';

interface MetaBoxWorkspaceProps {
  manifest: MetaBoxManifest;
  onPhaseAction?: (phaseId: string, action: 'complete' | 'revert' | 'trigger') => void;
  onAgentMessage?: (phaseId: string, message: string) => void;
}

const MetaBoxWorkspace: React.FC<MetaBoxWorkspaceProps> = ({
  manifest,
  onPhaseAction,
  onAgentMessage,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Phases & Agents */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <PhasePanel
          manifest={manifest}
          onPhaseAction={onPhaseAction}
          onAgentMessage={onAgentMessage}
        />
      </div>

      {/* Main View - Kanban/List Toggle */}
      <div className="flex-1 flex flex-col">
        {/* Header with View Toggle */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {manifest.name} Workspace
            </h1>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {viewMode === 'kanban' ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Kanban View</h2>
              <p className="text-gray-600">
                Kanban board implementation coming soon...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">List View</h2>
              <p className="text-gray-600">
                List view implementation coming soon...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Detail/Activity */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Details & Activity
          </h2>
          <p className="text-sm text-gray-600">
            Select an item to view details
          </p>
        </div>
        
        <div className="flex-1 p-6">
          {selectedItem ? (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Item Details</h3>
              <p className="text-gray-600">
                Detailed view for selected item coming soon...
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-2 text-sm">No item selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaBoxWorkspace; 