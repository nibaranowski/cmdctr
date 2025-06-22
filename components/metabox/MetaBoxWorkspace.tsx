import React, { useState } from 'react';

import { MetaBoxManifest } from '../../types/metaBoxManifest';

import MetaBoxKanbanView from './MetaBoxKanbanView';
import MetaBoxListView from './MetaBoxListView';
import PhasePanel from './PhasePanel';

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

interface MetaBoxWorkspaceProps {
  manifest: MetaBoxManifest;
  onPhaseAction?: (phaseId: string, action: 'complete' | 'revert' | 'trigger') => void;
  onAgentMessage?: (phaseId: string, message: string) => void;
  onObjectSelect?: (objectId: string) => void;
  onObjectMove?: (objectId: string, fromPhase: string, toPhase: string) => void;
}

export const MetaBoxWorkspace: React.FC<MetaBoxWorkspaceProps> = ({
  manifest,
  onPhaseAction,
  onAgentMessage,
  onObjectSelect,
  onObjectMove,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Mock core objects data
  const mockCoreObjects: CoreObject[] = [
    {
      id: '1',
      name: 'Sequoia Capital',
      currentPhase: 'sourcing',
      status: 'active',
      assignedAgent: 'ai-research',
      priority: 'high',
      updatedAt: '2024-01-15',
      investmentSize: '$10M',
      sector: 'SaaS',
    },
    {
      id: '2',
      name: 'Andreessen Horowitz',
      currentPhase: 'outreach',
      status: 'pending',
      assignedAgent: 'ai-outreach',
      priority: 'medium',
      updatedAt: '2024-01-14',
      investmentSize: '$5M',
      sector: 'Fintech',
    },
    {
      id: '3',
      name: 'Kleiner Perkins',
      currentPhase: 'negotiation',
      status: 'active',
      assignedAgent: 'ai-negotiator',
      priority: 'high',
      updatedAt: '2024-01-13',
      investmentSize: '$15M',
      sector: 'AI/ML',
    },
    {
      id: '4',
      name: 'Benchmark Capital',
      currentPhase: 'closed',
      status: 'complete',
      assignedAgent: 'ai-admin',
      priority: 'low',
      updatedAt: '2024-01-12',
      investmentSize: '$8M',
      sector: 'E-commerce',
    },
  ];

  const handleObjectSelect = (objectId: string) => {
    setSelectedItem(objectId);
    onObjectSelect?.(objectId);
  };

  const handleObjectMove = (objectId: string, fromPhase: string, toPhase: string) => {
    onObjectMove?.(objectId, fromPhase, toPhase);
    // In a real app, this would update the backend
    console.log(`Moved object ${objectId} from ${fromPhase} to ${toPhase}`);
  };

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
        <div className="flex-1 overflow-hidden">
          {viewMode === 'kanban' ? (
            <MetaBoxKanbanView
              manifest={manifest}
              coreObjects={mockCoreObjects}
              selectedObjectId={selectedItem}
              onObjectSelect={handleObjectSelect}
              onObjectMove={handleObjectMove}
            />
          ) : (
            <div className="p-6">
              <MetaBoxListView
                manifest={manifest}
                coreObjects={mockCoreObjects}
                selectedObjectId={selectedItem}
                onObjectSelect={handleObjectSelect}
              />
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