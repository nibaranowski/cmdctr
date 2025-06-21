import React, { useState } from 'react';
import { MetaBoxManifest, MetaBoxPhase, MetaBoxAgent } from '../../types/metaBoxManifest';

interface PhasePanelProps {
  manifest: MetaBoxManifest;
  onPhaseAction?: ((phaseId: string, action: 'complete' | 'revert' | 'trigger') => void) | undefined;
  onAgentMessage?: ((phaseId: string, message: string) => void) | undefined;
}

const PhasePanel: React.FC<PhasePanelProps> = ({ 
  manifest, 
  onPhaseAction, 
  onAgentMessage 
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Record<string, string>>({});

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const handleMessageSubmit = (phaseId: string) => {
    const message = messages[phaseId];
    if (message?.trim() && onAgentMessage) {
      onAgentMessage(phaseId, message.trim());
      setMessages(prev => ({ ...prev, [phaseId]: '' }));
    }
  };

  const getAgentById = (agentId: string): MetaBoxAgent | undefined => {
    return manifest.agents.find(agent => agent.id === agentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'complete': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {manifest.name} Pipeline
        </h2>
        <p className="text-sm text-gray-600">
          {manifest.phases.length} phases • {manifest.agents.length} agents
        </p>
      </div>

      {/* Phases List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-4">
          {manifest.phases.map((phase) => {
            const agent = getAgentById(phase.agentId);
            const isExpanded = expandedPhases.has(phase.id);
            
            return (
              <div
                key={phase.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                data-testid={`phase-${phase.id}`}
              >
                {/* Phase Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="flex items-center space-x-2 text-left hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${phase.name} phase`}
                      >
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">{phase.name}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Phase Status */}
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(phase.status)}`} />
                      
                      {/* Agent Avatar */}
                      {agent && (
                        <div className="relative">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                            {agent.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getAgentStatusColor(agent.status)}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                    {/* Agent Info */}
                    {agent && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{agent.status}</p>
                        </div>
                      </div>
                    )}

                    {/* Phase Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onPhaseAction?.(phase.id, 'complete')}
                        className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        disabled={phase.status === 'complete'}
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => onPhaseAction?.(phase.id, 'revert')}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={phase.status === 'pending'}
                      >
                        Revert
                      </button>
                      <button
                        onClick={() => onPhaseAction?.(phase.id, 'trigger')}
                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Trigger Agent
                      </button>
                    </div>

                    {/* Agent Messaging */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Message Agent
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={messages[phase.id] || ''}
                          onChange={(e) => setMessages(prev => ({ ...prev, [phase.id]: e.target.value }))}
                          placeholder="Ask agent for help..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleMessageSubmit(phase.id)}
                        />
                        <button
                          onClick={() => handleMessageSubmit(phase.id)}
                          className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhasePanel; 