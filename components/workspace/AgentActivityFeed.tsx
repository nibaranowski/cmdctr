import React, { useState, useEffect } from 'react';

import { AgentRegistry } from '../../lib/agents/registry';

interface AgentActivityFeedProps {
  companyId: string;
  metaboxId?: string;
  phaseId?: string;
  maxItems?: number;
}

interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_assigned' | 'task_completed' | 'task_failed' | 'collaboration_started' | 'collaboration_completed' | 'agent_status_changed' | 'agent_created';
  title: string;
  description: string;
  timestamp: string;
  agentId?: string | undefined;
  agentName?: string | undefined;
  taskId?: string | undefined;
  collaborationId?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  metadata?: Record<string, any> | undefined;
}

export const AgentActivityFeed: React.FC<AgentActivityFeedProps> = ({
  companyId,
  metaboxId,
  phaseId,
  maxItems = 50
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tasks' | 'collaborations' | 'agents'>('all');

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [companyId, metaboxId, phaseId]);

  const loadActivities = async () => {
    try {
      const orchestrator = AgentOrchestrator.getInstance();
      const registry = AgentRegistry.getInstance();
      
      const allActivities: ActivityItem[] = [];

      // Load tasks
      const tasks = orchestrator.getTasksByCompany(companyId);
      tasks.forEach(task => {
        if (metaboxId && task.metabox_id !== metaboxId) return;
        if (phaseId && task.phase_id !== phaseId) return;

        const agent = task.assigned_agent_id ? registry.getAgent(task.assigned_agent_id) : null;
        
        allActivities.push({
          id: `task_${task.id}`,
          type: task.status === 'completed' ? 'task_completed' : 
                task.status === 'failed' ? 'task_failed' :
                task.assigned_agent_id ? 'task_assigned' : 'task_created',
          title: `${task.type} Task`,
          description: `Task "${task.type}" ${task.status === 'completed' ? 'completed successfully' : 
                       task.status === 'failed' ? 'failed' :
                       task.assigned_agent_id ? `assigned to ${agent?.name || 'agent'}` : 'created'}`,
          timestamp: task.assigned_agent_id ? task.updated_at : task.created_at,
          agentId: task.assigned_agent_id,
          agentName: agent?.name,
          taskId: task.id,
          status: task.status,
          priority: task.priority,
          metadata: task.metadata
        });
      });

      // Load collaborations
      const collaborations = Array.from(orchestrator['collaborations'].values())
        .filter(collab => {
          const task = orchestrator.getTask(collab.task_id);
          return task && task.company_id === companyId &&
                 (!metaboxId || task.metabox_id === metaboxId) &&
                 (!phaseId || task.phase_id === phaseId);
        });

      collaborations.forEach(collab => {
        const task = orchestrator.getTask(collab.task_id);
        if (!task) return;

        allActivities.push({
          id: `collab_${collab.task_id}`,
          type: collab.status === 'completed' ? 'collaboration_completed' : 'collaboration_started',
          title: 'Agent Collaboration',
          description: `${collab.collaborating_agents.length} agents collaborating on ${task.type} task`,
          timestamp: collab.status === 'completed' ? collab.completed_at! : collab.created_at,
          taskId: collab.task_id,
          collaborationId: collab.task_id,
          status: collab.status,
          metadata: {
            collaboration_type: collab.collaboration_type,
            agent_count: collab.collaborating_agents.length
          }
        });
      });

      // Load agent status changes (simulated from agent activities)
      const agents = registry.findAgentsByFilter({
        company_id: companyId,
        ...(metaboxId && { metabox_id: metaboxId }),
        ...(phaseId && { phase_id: phaseId })
      });

      agents.forEach(agent => {
        // Simulate agent status changes based on last activity
        const lastActivity = new Date(agent.performance_metrics.last_activity);
        const now = new Date();
        const timeDiff = now.getTime() - lastActivity.getTime();
        
        if (timeDiff < 60000) { // Within last minute
          allActivities.push({
            id: `agent_activity_${agent.id}_${lastActivity.getTime()}`,
            type: 'agent_status_changed',
            title: 'Agent Activity',
            description: `${agent.name} completed a task successfully`,
            timestamp: agent.performance_metrics.last_activity,
            agentId: agent.id,
            agentName: agent.name,
            status: agent.status,
            metadata: {
              tasks_completed: agent.performance_metrics.tasks_completed,
              success_rate: agent.performance_metrics.success_rate
            }
          });
        }
      });

      // Sort by timestamp (newest first) and limit
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(allActivities.slice(0, maxItems));
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task_created': return '📋';
      case 'task_assigned': return '👤';
      case 'task_completed': return '✅';
      case 'task_failed': return '❌';
      case 'collaboration_started': return '🤝';
      case 'collaboration_completed': return '🎉';
      case 'agent_status_changed': return '⚡';
      case 'agent_created': return '🤖';
      default: return '📝';
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task_completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'task_failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'collaboration_completed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'agent_status_changed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'tasks') return activity.type.includes('task');
    if (filter === 'collaborations') return activity.type.includes('collaboration');
    if (filter === 'agents') return activity.type.includes('agent');
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
          <p className="text-sm text-gray-600">Real-time agent activities and task progress</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: '📊' },
            { key: 'tasks', label: 'Tasks', icon: '📋' },
            { key: 'collaborations', label: 'Collaborations', icon: '🤝' },
            { key: 'agents', label: 'Agents', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-600">No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border ${getActivityColor(activity.type)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                  
                  {/* Metadata */}
                  <div className="flex items-center space-x-2 mt-2">
                    {activity.agentName && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🤖 {activity.agentName}
                      </span>
                    )}
                    
                    {activity.priority && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                        {activity.priority.toUpperCase()}
                      </span>
                    )}
                    
                    {activity.status && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {activity.status}
                      </span>
                    )}
                    
                    {activity.metadata?.collaboration_type && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {activity.metadata.collaboration_type}
                      </span>
                    )}
                    
                    {activity.metadata?.agent_count && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {activity.metadata.agent_count} agents
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadActivities}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh Activity Feed
        </button>
      </div>
    </div>
  );
}; 