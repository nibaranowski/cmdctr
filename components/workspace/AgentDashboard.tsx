import React, { useState, useEffect } from 'react';

import { AgentOrchestrator } from '../../lib/agents/orchestrator';
import { AgentRegistry } from '../../lib/agents/registry';
import { Agent } from '../../models/Agent';

interface AgentDashboardProps {
  companyId: string;
  metaboxId?: string;
  phaseId?: string;
}

interface AgentStats {
  total_agents: number;
  active_agents: number;
  agents_by_type: Record<string, number>;
  agents_by_status: Record<string, number>;
  average_performance: number;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  companyId,
  metaboxId,
  phaseId
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [companyId, metaboxId, phaseId]);

  const loadAgents = async () => {
    try {
      const registry = AgentRegistry.getInstance();
      const filter = {
        company_id: companyId,
        metabox_id: metaboxId,
        phase_id: phaseId
      };
      
      const agentInstances = registry.findAgentsByFilter(filter);
      const agentModels = agentInstances.map(agent => agent.toAgentModel());
      setAgents(agentModels);
      
      const agentStats = registry.getAgentStats();
      setStats(agentStats);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (template: string, agentData: any) => {
    try {
      const registry = AgentRegistry.getInstance();
      const newAgent = registry.createAgentFromTemplate(template, {
        ...agentData,
        company_id: companyId,
        metabox_id: metaboxId,
        phase_id: phaseId
      });
      
      if (newAgent) {
        registry.registerAgent(newAgent);
        await loadAgents();
        setIsCreatingAgent(false);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleUpdateAgentStatus = async (agentId: string, status: Agent['status']) => {
    try {
      const registry = AgentRegistry.getInstance();
      const agent = registry.getAgent(agentId);
      if (agent) {
        agent.updateStatus(status);
        await loadAgents();
      }
    } catch (error) {
      console.error('Failed to update agent status:', error);
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      case 'busy': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type: Agent['agent_type']) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'human': return '👤';
      case 'hybrid': return '🔗';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Dashboard</h2>
          <p className="text-gray-600">Manage and monitor your AI agents</p>
        </div>
        <button
          onClick={() => setIsCreatingAgent(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>🤖</span>
          <span>Create Agent</span>
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_agents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_agents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.average_performance.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.agents_by_type.ai || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onSelect={() => setSelectedAgent(agent)}
            onStatusUpdate={handleUpdateAgentStatus}
          />
        ))}
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
          <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
          <button
            onClick={() => setIsCreatingAgent(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Create Agent
          </button>
        </div>
      )}

      {/* Agent Creation Modal */}
      {isCreatingAgent && (
        <AgentCreationModal
          onClose={() => setIsCreatingAgent(false)}
          onCreate={handleCreateAgent}
          companyId={companyId}
          metaboxId={metaboxId}
          phaseId={phaseId}
        />
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onStatusUpdate={handleUpdateAgentStatus}
        />
      )}
    </div>
  );
};

interface AgentCardProps {
  agent: Agent;
  onSelect: () => void;
  onStatusUpdate: (agentId: string, status: Agent['status']) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, onStatusUpdate }) => {
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      case 'busy': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type: Agent['agent_type']) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'human': return '👤';
      case 'hybrid': return '🔗';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="p-6" onClick={onSelect}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getAgentTypeIcon(agent.agent_type)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.agent_type.toUpperCase()}</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
        </div>

        {/* Description */}
        {agent.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.description}</p>
        )}

        {/* Capabilities */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">CAPABILITIES</p>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability) => (
              <span
                key={capability}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {capability}
              </span>
            ))}
            {agent.capabilities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{agent.capabilities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Success Rate</p>
            <p className="font-semibold text-gray-900">
              {agent.performance_metrics.success_rate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">Tasks Completed</p>
            <p className="font-semibold text-gray-900">
              {agent.performance_metrics.tasks_completed}
            </p>
          </div>
        </div>

        {/* Last Activity */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last activity: {new Date(agent.performance_metrics.last_activity).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-4 flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(agent.id, agent.status === 'active' ? 'idle' : 'active');
          }}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
            agent.status === 'active'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {agent.status === 'active' ? 'Pause' : 'Activate'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};

interface AgentCreationModalProps {
  onClose: () => void;
  onCreate: (template: string, agentData: any) => void;
  companyId: string;
  metaboxId?: string;
  phaseId?: string;
}

const AgentCreationModal: React.FC<AgentCreationModalProps> = ({
  onClose,
  onCreate,
  companyId,
  metaboxId,
  phaseId
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');

  const templates = [
    {
      id: 'investor_research',
      name: 'Investor Research Agent',
      description: 'AI agent specialized in investor research and analysis',
      icon: '🔍',
      capabilities: ['investor_research', 'network_analysis', 'financial_analysis']
    },
    {
      id: 'ai_outreach',
      name: 'AI Outreach Agent',
      description: 'AI agent specialized in personalized investor outreach',
      icon: '📧',
      capabilities: ['personalized_outreach', 'email_automation', 'follow_up_sequences']
    }
  ];

  const handleCreate = () => {
    if (!selectedTemplate || !agentName) return;
    
    onCreate(selectedTemplate, {
      name: agentName,
      description: agentDescription,
      company_id: companyId,
      metabox_id: metaboxId,
      phase_id: phaseId,
      agent_type: 'ai' as const
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Agent</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Agent Template
          </label>
          <div className="grid grid-cols-1 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.capabilities.map((capability) => (
                        <span
                          key={capability}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Configuration */}
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter agent description"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!selectedTemplate || !agentName}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Agent
          </button>
        </div>
      </div>
    </div>
  );
};

interface AgentDetailModalProps {
  agent: Agent;
  onClose: () => void;
  onStatusUpdate: (agentId: string, status: Agent['status']) => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onStatusUpdate
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Agent Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{agent.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900">{agent.agent_type.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">{agent.status}</p>
              </div>
              {agent.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{agent.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agent.performance_metrics.success_rate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agent.performance_metrics.tasks_completed}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Tasks Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agent.performance_metrics.tasks_failed}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Avg Completion Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agent.performance_metrics.average_completion_time_hours}h
                </p>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Skills</h4>
            <div className="space-y-2">
              {agent.skills.map((skill) => (
                <div key={skill.name} className="flex justify-between items-center">
                  <span className="text-gray-900">{skill.name}</span>
                  <span className="text-sm text-gray-500 capitalize">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => onStatusUpdate(agent.id, agent.status === 'active' ? 'idle' : 'active')}
            className={`px-4 py-2 rounded-md transition-colors ${
              agent.status === 'active'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 