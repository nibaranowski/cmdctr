import React, { useState, useEffect } from 'react';

import { AgentOrchestrator, AgentCollaboration } from '../../lib/agents/orchestrator';
import { AgentRegistry } from '../../lib/agents/registry';

interface AgentCollaborationViewProps {
  companyId: string;
  metaboxId?: string;
  phaseId?: string;
}

interface CollaborationNode {
  id: string;
  name: string;
  type: 'agent' | 'task' | 'collaboration';
  status: string;
  position: { x: number; y: number };
  connections: string[];
  metadata?: Record<string, any>;
}

interface CollaborationEdge {
  id: string;
  source: string;
  target: string;
  type: 'task_assignment' | 'collaboration' | 'handoff' | 'dependency';
  strength: number;
  metadata?: Record<string, any>;
}

export const AgentCollaborationView: React.FC<AgentCollaborationViewProps> = ({
  companyId,
  metaboxId,
  phaseId
}) => {
  const [nodes, setNodes] = useState<CollaborationNode[]>([]);
  const [edges, setEdges] = useState<CollaborationEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CollaborationNode | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'timeline' | 'matrix'>('network');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborationData();
    const interval = setInterval(loadCollaborationData, 5000);
    return () => clearInterval(interval);
  }, [companyId, metaboxId, phaseId]);

  const loadCollaborationData = async () => {
    try {
      const orchestrator = AgentOrchestrator.getInstance();
      const registry = AgentRegistry.getInstance();
      
      const collaborationNodes: CollaborationNode[] = [];
      const collaborationEdges: CollaborationEdge[] = [];

      // Load agents
      const agents = registry.findAgentsByFilter({
        company_id: companyId,
        ...(metaboxId && { metabox_id: metaboxId }),
        ...(phaseId && { phase_id: phaseId })
      });

      agents.forEach((agent, index) => {
        const angle = (index / agents.length) * 2 * Math.PI;
        const radius = 200;
        const x = Math.cos(angle) * radius + 300;
        const y = Math.sin(angle) * radius + 300;

        collaborationNodes.push({
          id: `agent_${agent.id}`,
          name: agent.name,
          type: 'agent',
          status: agent.status,
          position: { x, y },
          connections: [],
          metadata: {
            agent_type: agent.agent_type,
            capabilities: agent.capabilities,
            performance: agent.performance_metrics
          }
        });
      });

      // Load tasks and create connections
      const tasks = orchestrator.getTasksByCompany(companyId);
      tasks.forEach((task, index) => {
        if (metaboxId && task.metabox_id !== metaboxId) return;
        if (phaseId && task.phase_id !== phaseId) return;

        const taskX = 300 + (index % 3) * 150;
        const taskY = 100 + Math.floor(index / 3) * 100;

        collaborationNodes.push({
          id: `task_${task.id}`,
          name: task.type,
          type: 'task',
          status: task.status,
          position: { x: taskX, y: taskY },
          connections: [],
          metadata: {
            priority: task.priority,
            assigned_agent: task.assigned_agent_id,
            created_at: task.created_at,
            updated_at: task.updated_at
          }
        });

        // Create task assignment edge
        if (task.assigned_agent_id) {
          collaborationEdges.push({
            id: `assignment_${task.id}`,
            source: `agent_${task.assigned_agent_id}`,
            target: `task_${task.id}`,
            type: 'task_assignment',
            strength: 1,
            metadata: {
              assigned_at: task.updated_at,
              priority: task.priority
            }
          });
        }
      });

      // Load collaborations
      const collaborations = Array.from(orchestrator['collaborations'].values())
        .filter(collab => {
          const task = orchestrator.getTask(collab.task_id);
          return task && task.company_id === companyId &&
                 (!metaboxId || task.metabox_id === metaboxId) &&
                 (!phaseId || task.phase_id === phaseId);
        });

      collaborations.forEach((collab, index) => {
        const collabX = 600 + (index % 2) * 200;
        const collabY = 200 + Math.floor(index / 2) * 150;

        collaborationNodes.push({
          id: `collab_${collab.task_id}`,
          name: `Collaboration ${index + 1}`,
          type: 'collaboration',
          status: collab.status,
          position: { x: collabX, y: collabY },
          connections: [],
          metadata: {
            collaboration_type: collab.collaboration_type,
            agent_count: collab.collaborating_agents.length,
            created_at: collab.created_at,
            completed_at: collab.completed_at
          }
        });

        // Create collaboration edges
        collab.collaborating_agents.forEach(agentId => {
          collaborationEdges.push({
            id: `collab_${collab.task_id}_${agentId}`,
            source: `agent_${agentId}`,
            target: `collab_${collab.task_id}`,
            type: 'collaboration',
            strength: 0.8,
            metadata: {
              collaboration_type: collab.collaboration_type,
              role: 'participant'
            }
          });
        });

        // Connect collaboration to task
        collaborationEdges.push({
          id: `collab_task_${collab.task_id}`,
          source: `collab_${collab.task_id}`,
          target: `task_${collab.task_id}`,
          type: 'dependency',
          strength: 0.6,
          metadata: {
            relationship: 'collaboration_for_task'
          }
        });
      });

      setNodes(collaborationNodes);
      setEdges(collaborationEdges);
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNodeColor = (node: CollaborationNode) => {
    switch (node.type) {
      case 'agent':
        switch (node.status) {
          case 'active': return '#10B981'; // green
          case 'busy': return '#F59E0B'; // yellow
          case 'idle': return '#6B7280'; // gray
          case 'error': return '#EF4444'; // red
          default: return '#6B7280';
        }
      case 'task':
        switch (node.status) {
          case 'completed': return '#10B981';
          case 'in_progress': return '#3B82F6';
          case 'pending': return '#F59E0B';
          case 'failed': return '#EF4444';
          default: return '#6B7280';
        }
      case 'collaboration':
        switch (node.status) {
          case 'completed': return '#8B5CF6'; // purple
          case 'active': return '#3B82F6';
          case 'pending': return '#F59E0B';
          default: return '#6B7280';
        }
      default:
        return '#6B7280';
    }
  };

  const getNodeSize = (node: CollaborationNode) => {
    switch (node.type) {
      case 'agent': return 40;
      case 'task': return 30;
      case 'collaboration': return 35;
      default: return 25;
    }
  };

  const getNodeIcon = (node: CollaborationNode) => {
    switch (node.type) {
      case 'agent': return '🤖';
      case 'task': return '📋';
      case 'collaboration': return '🤝';
      default: return '●';
    }
  };

  const getEdgeColor = (edge: CollaborationEdge) => {
    switch (edge.type) {
      case 'task_assignment': return '#3B82F6'; // blue
      case 'collaboration': return '#8B5CF6'; // purple
      case 'handoff': return '#F59E0B'; // yellow
      case 'dependency': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  const getEdgeWidth = (edge: CollaborationEdge) => {
    return Math.max(1, edge.strength * 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agent Collaboration Network</h3>
          <p className="text-sm text-gray-600">Visualize agent interactions and task relationships</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'network', label: 'Network', icon: '🕸️' },
            { key: 'timeline', label: 'Timeline', icon: '📅' },
            { key: 'matrix', label: 'Matrix', icon: '📊' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Network View */}
      {viewMode === 'network' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="relative w-full h-96 overflow-hidden">
            {/* SVG Canvas */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              className="absolute inset-0"
            >
              {/* Edges */}
              {edges.map((edge) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;

                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={getEdgeColor(edge)}
                    strokeWidth={getEdgeWidth(edge)}
                    strokeOpacity={0.6}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}

              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6B7280"
                  />
                </marker>
              </defs>

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={getNodeSize(node)}
                    fill={getNodeColor(node)}
                    stroke={selectedNode?.id === node.id ? '#3B82F6' : '#E5E7EB'}
                    strokeWidth={selectedNode?.id === node.id ? 3 : 2}
                    className="cursor-pointer hover:stroke-blue-400 transition-colors"
                    onClick={() => setSelectedNode(node)}
                  />
                  <text
                    x={node.position.x}
                    y={node.position.y + 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-white pointer-events-none"
                  >
                    {getNodeIcon(node)}
                  </text>
                  <text
                    x={node.position.x}
                    y={node.position.y + getNodeSize(node) + 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {nodes
              .filter(node => node.type === 'task' || node.type === 'collaboration')
              .sort((a, b) => new Date(a.metadata?.created_at || 0).getTime() - new Date(b.metadata?.created_at || 0).getTime())
              .map((node, index) => (
                <div key={node.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getNodeIcon(node)}</span>
                      <h4 className="font-medium text-gray-900">{node.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        node.status === 'completed' ? 'bg-green-100 text-green-800' :
                        node.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        node.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    {node.metadata?.created_at && (
                      <p className="text-sm text-gray-600">
                        Created: {new Date(node.metadata.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent / Task
                  </th>
                  {nodes
                    .filter(node => node.type === 'task')
                    .map(task => (
                      <th key={task.id} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {task.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {nodes
                  .filter(node => node.type === 'agent')
                  .map(agent => (
                    <tr key={agent.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span>{getNodeIcon(agent)}</span>
                          <span>{agent.name}</span>
                        </div>
                      </td>
                      {nodes
                        .filter(node => node.type === 'task')
                        .map(task => {
                          const edge = edges.find(e => 
                            e.source === agent.id && e.target === task.id
                          );
                          
                          return (
                            <td key={task.id} className="px-4 py-2 text-center border-t border-gray-200">
                              {edge ? (
                                <div className="flex items-center justify-center">
                                  <div className={`w-3 h-3 rounded-full ${
                                    edge.type === 'task_assignment' ? 'bg-blue-500' :
                                    edge.type === 'collaboration' ? 'bg-purple-500' :
                                    'bg-gray-400'
                                  }`}></div>
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Node Details</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{selectedNode.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-gray-900 capitalize">{selectedNode.type}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="text-gray-900 capitalize">{selectedNode.status}</p>
            </div>
            
            {selectedNode.metadata && Object.entries(selectedNode.metadata).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <p className="text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 