import React from 'react';

import { Phase } from './WorkspaceLayout';

interface PhaseSidebarProps {
  phases: Phase[];
  workspaceType: string;
  onAddPhase?: () => void;
}

export const PhaseSidebar: React.FC<PhaseSidebarProps> = ({
  phases,
  workspaceType,
  onAddPhase,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '▶️';
      case 'completed':
        return '✅';
      case 'pending':
        return '⏸️';
      default:
        return '⏸️';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Phases</h2>
        <p className="text-sm text-gray-600 capitalize">{workspaceType} workflow</p>
      </div>

      {/* Phases List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    Phase {index + 1}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(phase.status)}`}>
                    {getStatusIcon(phase.status)} {phase.status}
                  </span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center space-x-1">
                  {phase.quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title={action.name}
                    >
                      <span className="text-sm">{action.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase Name */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {phase.name}
              </h3>

              {/* Agents */}
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-600 mb-2">Agents</h4>
                <div className="flex flex-wrap gap-1">
                  {phase.agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center space-x-1 px-2 py-1 bg-white rounded border border-gray-200"
                    >
                      <div className="relative">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-4 h-4 rounded-full"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white ${
                          agent.status === 'online' ? 'bg-green-400' :
                          agent.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <span className="text-xs text-gray-700">{agent.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-600 mb-2">Progress</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">
                      {phase.metrics.totalItems}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-semibold text-green-600">
                      {phase.metrics.completedItems}
                    </div>
                    <div className="text-xs text-gray-600">Done</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-semibold text-blue-600">
                      {phase.metrics.inProgressItems}
                    </div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm font-semibold text-red-600">
                      {phase.metrics.blockedItems}
                    </div>
                    <div className="text-xs text-gray-600">Blocked</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {phase.metrics.totalItems > 0 
                      ? Math.round((phase.metrics.completedItems / phase.metrics.totalItems) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${phase.metrics.totalItems > 0 
                        ? (phase.metrics.completedItems / phase.metrics.totalItems) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Phase Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                  View Details
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          onClick={onAddPhase}
        >
          + Add Phase
        </button>
      </div>
    </div>
  );
}; 