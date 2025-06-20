import React, { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  health: {
    lastCheck: Date;
    isAlive: boolean;
    errorCount: number;
  };
  logs: Array<{
    timestamp: Date;
    action: string;
    message: string;
    level: 'info' | 'warn' | 'error';
  }>;
}

interface AgentPanelProps {
  className?: string;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ className = '' }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAgents = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAgents: Agent[] = [
        {
          id: 'agent_1',
          name: 'Data Processing Agent',
          status: 'idle',
          health: {
            lastCheck: new Date(),
            isAlive: true,
            errorCount: 0,
          },
          logs: [
            {
              timestamp: new Date(Date.now() - 60000),
              action: 'register',
              message: 'Agent registered successfully',
              level: 'info',
            },
          ],
        },
        {
          id: 'agent_2',
          name: 'Email Agent',
          status: 'busy',
          health: {
            lastCheck: new Date(),
            isAlive: true,
            errorCount: 2,
          },
          logs: [
            {
              timestamp: new Date(Date.now() - 30000),
              action: 'assign',
              message: 'Assigned email processing task',
              level: 'info',
            },
          ],
        },
        {
          id: 'agent_3',
          name: 'Analytics Agent',
          status: 'error',
          health: {
            lastCheck: new Date(Date.now() - 120000),
            isAlive: false,
            errorCount: 5,
          },
          logs: [
            {
              timestamp: new Date(Date.now() - 60000),
              action: 'error',
              message: 'Failed to process analytics data',
              level: 'error',
            },
          ],
        },
      ];
      
      setAgents(mockAgents);
      setLoading(false);
    } catch (err) {
      setError('Failed to load agents');
      setLoading(false);
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'idle':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'idle':
        return 'Idle';
      case 'busy':
        return 'Busy';
      case 'error':
        return 'Error';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const handleQuickAction = async (agentId: string, action: string) => {
    try {
      // TODO: Implement actual API calls
      console.log(`Performing ${action} on agent ${agentId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh agents after action
      await loadAgents();
    } catch (err) {
      setError(`Failed to perform ${action} on agent`);
    }
  };

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-medium">Error Loading Agents</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={loadAgents}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Agent Management</h2>
        <p className="text-sm text-gray-500">Monitor and manage your agents</p>
      </div>

      <div className="flex">
        {/* Agent List */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-3">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent === agent.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        agent.status
                      )}`}
                    >
                      {getStatusText(agent.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Errors: {agent.health.errorCount}
                    </span>
                    <span>
                      Last check: {agent.health.lastCheck.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAction(agent.id, 'restart');
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Restart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAction(agent.id, 'assign');
                      }}
                      disabled={agent.status === 'busy'}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Assign Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Details */}
        <div className="w-1/2">
          {selectedAgentData ? (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedAgentData.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>ID: {selectedAgentData.id}</span>
                  <span
                    className={`px-2 py-1 rounded-full border ${getStatusColor(
                      selectedAgentData.status
                    )}`}
                  >
                    {getStatusText(selectedAgentData.status)}
                  </span>
                </div>
              </div>

              {/* Health Status */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Health Status</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 ${selectedAgentData.health.isAlive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedAgentData.health.isAlive ? 'Healthy' : 'Unhealthy'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Error Count:</span>
                      <span className="ml-2">{selectedAgentData.health.errorCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Check:</span>
                      <span className="ml-2">{selectedAgentData.health.lastCheck.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Logs</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {selectedAgentData.logs.slice(-10).reverse().map((log, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              log.level === 'error'
                                ? 'bg-red-100 text-red-800'
                                : log.level === 'warn'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-gray-700 mt-1">
                          <span className="font-medium">{log.action}:</span> {log.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>Select an agent to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPanel; 