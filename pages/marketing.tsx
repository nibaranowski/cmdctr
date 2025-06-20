import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  budget: string;
  tags: string[];
  channel: string;
}

export default function Marketing() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns = [
    {
      id: 'planning',
      title: 'Planning',
      color: 'bg-blue-100',
      campaigns: [
        {
          id: '1',
          title: 'Q1 Brand Campaign',
          description: 'Brand awareness campaign across social media',
          status: 'planning',
          priority: 'high' as const,
          assignee: 'AI Strategist',
          budget: '$50K',
          tags: ['Brand', 'Social'],
          channel: 'Multi-channel'
        }
      ]
    },
    {
      id: 'active',
      title: 'Active',
      color: 'bg-green-100',
      campaigns: [
        {
          id: '2',
          title: 'Product Launch',
          description: 'New feature launch campaign',
          status: 'active',
          priority: 'high' as const,
          assignee: 'AI Campaign',
          budget: '$25K',
          tags: ['Launch', 'Product'],
          channel: 'Digital'
        }
      ]
    },
    {
      id: 'optimizing',
      title: 'Optimizing',
      color: 'bg-yellow-100',
      campaigns: [
        {
          id: '3',
          title: 'Lead Generation',
          description: 'B2B lead generation campaign',
          status: 'optimizing',
          priority: 'medium' as const,
          assignee: 'AI Optimizer',
          budget: '$15K',
          tags: ['B2B', 'Leads'],
          channel: 'LinkedIn'
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-gray-100',
      campaigns: [
        {
          id: '4',
          title: 'Holiday Campaign',
          description: 'End of year promotional campaign',
          status: 'completed',
          priority: 'low' as const,
          assignee: 'AI Analyst',
          budget: '$30K',
          tags: ['Holiday', 'Promo'],
          channel: 'Email'
        }
      ]
    }
  ];

  const phases = [
    {
      name: 'Strategy',
      status: 'completed',
      agents: ['AI Strategist', 'AI Researcher'],
      description: 'Campaign strategy and audience research'
    },
    {
      name: 'Creation',
      status: 'in-progress',
      agents: ['AI Creator', 'AI Designer'],
      description: 'Content creation and asset development'
    },
    {
      name: 'Execution',
      status: 'pending',
      agents: ['AI Campaign', 'AI Publisher'],
      description: 'Campaign launch and distribution'
    },
    {
      name: 'Optimization',
      status: 'pending',
      agents: ['AI Optimizer', 'AI Analyst'],
      description: 'Performance optimization and A/B testing'
    },
    {
      name: 'Analysis',
      status: 'pending',
      agents: ['AI Analyst', 'AI Reporter'],
      description: 'Results analysis and reporting'
    }
  ];

  const agents = [
    { name: 'AI Strategist', status: 'active', tasks: 2 },
    { name: 'AI Creator', status: 'active', tasks: 3 },
    { name: 'AI Campaign', status: 'idle', tasks: 1 },
    { name: 'AI Optimizer', status: 'active', tasks: 1 },
    { name: 'AI Analyst', status: 'idle', tasks: 0 }
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
        <title>Marketing - Command Center</title>
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
            <h1 className="text-xl font-semibold text-gray-900">Marketing</h1>
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
              <h2 className="text-2xl font-semibold text-gray-900">Campaign Management</h2>
              <p className="text-sm text-gray-600">Track and manage marketing campaigns</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Add Campaign
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
                      <span className="text-sm text-gray-500">{column.campaigns.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {column.campaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{campaign.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(campaign.priority)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{campaign.description}</p>
                          <p className="text-xs text-gray-500 mb-3">Budget: {campaign.budget}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{campaign.assignee}</span>
                            <div className="flex space-x-1">
                              {campaign.tags.map((tag) => (
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
          <h3 className="text-lg font-semibold text-gray-900">Campaign Phases</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {phases.map((phase, index) => (
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

      {/* Campaign Detail Drawer */}
      {isDrawerOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
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
                  <h4 className="font-medium text-gray-900 mb-2">{selectedCampaign.title}</h4>
                  <p className="text-sm text-gray-600">{selectedCampaign.description}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedCampaign.status}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Budget</h5>
                  <p className="text-sm text-gray-600">{selectedCampaign.budget}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Channel</h5>
                  <p className="text-sm text-gray-600">{selectedCampaign.channel}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assignee</h5>
                  <p className="text-sm text-gray-600">{selectedCampaign.assignee}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.tags.map((tag) => (
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