import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  sprint: string;
  tags: string[];
  effort: string;
}

export default function Product() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns = [
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'bg-gray-100',
      features: [
        {
          id: '1',
          title: 'AI-powered Analytics',
          description: 'Advanced analytics dashboard with ML insights',
          status: 'backlog',
          priority: 'high' as const,
          assignee: 'AI Product',
          sprint: 'Sprint 5',
          tags: ['Analytics', 'AI'],
          effort: '8 points'
        }
      ]
    },
    {
      id: 'planning',
      title: 'Planning',
      color: 'bg-blue-100',
      features: [
        {
          id: '2',
          title: 'Mobile App',
          description: 'Native mobile application for iOS and Android',
          status: 'planning',
          priority: 'medium' as const,
          assignee: 'AI Architect',
          sprint: 'Sprint 4',
          tags: ['Mobile', 'Native'],
          effort: '13 points'
        }
      ]
    },
    {
      id: 'development',
      title: 'Development',
      color: 'bg-yellow-100',
      features: [
        {
          id: '3',
          title: 'Real-time Notifications',
          description: 'Push notifications and real-time updates',
          status: 'development',
          priority: 'high' as const,
          assignee: 'AI Developer',
          sprint: 'Sprint 3',
          tags: ['Real-time', 'Notifications'],
          effort: '5 points'
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing',
      color: 'bg-purple-100',
      features: [
        {
          id: '4',
          title: 'API Integration',
          description: 'Third-party API integrations and webhooks',
          status: 'testing',
          priority: 'medium' as const,
          assignee: 'AI QA',
          sprint: 'Sprint 2',
          tags: ['API', 'Integration'],
          effort: '3 points'
        }
      ]
    },
    {
      id: 'deployed',
      title: 'Deployed',
      color: 'bg-green-100',
      features: [
        {
          id: '5',
          title: 'User Authentication',
          description: 'Secure user authentication and authorization',
          status: 'deployed',
          priority: 'low' as const,
          assignee: 'AI DevOps',
          sprint: 'Sprint 1',
          tags: ['Auth', 'Security'],
          effort: '8 points'
        }
      ]
    }
  ];

  const phases = [
    {
      name: 'Discovery',
      status: 'completed',
      agents: ['AI Product', 'AI Researcher'],
      description: 'User research and feature ideation'
    },
    {
      name: 'Planning',
      status: 'in-progress',
      agents: ['AI Architect', 'AI Designer'],
      description: 'Technical design and sprint planning'
    },
    {
      name: 'Development',
      status: 'pending',
      agents: ['AI Developer', 'AI Engineer'],
      description: 'Feature development and implementation'
    },
    {
      name: 'Testing',
      status: 'pending',
      agents: ['AI QA', 'AI Tester'],
      description: 'Quality assurance and testing'
    },
    {
      name: 'Deployment',
      status: 'pending',
      agents: ['AI DevOps', 'AI Release'],
      description: 'Production deployment and monitoring'
    }
  ];

  const agents = [
    { name: 'AI Product', status: 'active', tasks: 3 },
    { name: 'AI Architect', status: 'active', tasks: 2 },
    { name: 'AI Developer', status: 'idle', tasks: 1 },
    { name: 'AI QA', status: 'active', tasks: 1 },
    { name: 'AI DevOps', status: 'idle', tasks: 0 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Head>
        <title>Product - Command Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Left Sidebar - Agent Stack */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Product</h1>
          </div>
        </div>

        <div className="flex-1 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">AI Agents</h3>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.name} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{agent.tasks} tasks</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Kanban Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Product Roadmap</h2>
              <p className="text-sm text-gray-600">Track and manage feature development</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Add Feature
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex space-x-6 h-full">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <span className="text-sm text-gray-500">{column.features.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {column.features.map((feature) => (
                        <div
                          key={feature.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                          onClick={() => {
                            setSelectedFeature(feature);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(feature.priority)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{feature.description}</p>
                          <p className="text-xs text-gray-500 mb-3">Effort: {feature.effort}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{feature.assignee}</span>
                            <div className="flex space-x-1">
                              {feature.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Phases */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Development Phases</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {phases.map((phase, _index) => (
              <div key={phase.name} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{phase.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`}></div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                <div className="space-y-2">
                  {phase.agents.map((agent) => (
                    <div key={agent} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-700">{agent}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Detail Drawer */}
      {isDrawerOpen && selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Feature Details</h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedFeature.title}</h4>
                  <p className="text-sm text-gray-600">{selectedFeature.description}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedFeature.status}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Effort</h5>
                  <p className="text-sm text-gray-600">{selectedFeature.effort}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Sprint</h5>
                  <p className="text-sm text-gray-600">{selectedFeature.sprint}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assignee</h5>
                  <p className="text-sm text-gray-600">{selectedFeature.assignee}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeature.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 