import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  value: string;
  tags: string[];
  source: string;
}

export default function Selling() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns = [
    {
      id: 'prospecting',
      title: 'Prospecting',
      color: 'bg-blue-100',
      leads: [
        {
          id: '1',
          company: 'TechCorp Inc',
          contact: 'John Smith',
          status: 'prospecting',
          priority: 'high' as const,
          assignee: 'AI SDR',
          value: '$50K',
          tags: ['Enterprise', 'SaaS'],
          source: 'LinkedIn'
        }
      ]
    },
    {
      id: 'qualified',
      title: 'Qualified',
      color: 'bg-green-100',
      leads: [
        {
          id: '2',
          company: 'StartupXYZ',
          contact: 'Sarah Johnson',
          status: 'qualified',
          priority: 'medium' as const,
          assignee: 'AI Qualifier',
          value: '$25K',
          tags: ['Startup', 'B2B'],
          source: 'Website'
        }
      ]
    },
    {
      id: 'proposal',
      title: 'Proposal',
      color: 'bg-purple-100',
      leads: [
        {
          id: '3',
          company: 'Enterprise Ltd',
          contact: 'Mike Chen',
          status: 'proposal',
          priority: 'high' as const,
          assignee: 'AI Sales',
          value: '$100K',
          tags: ['Enterprise', 'Custom'],
          source: 'Referral'
        }
      ]
    },
    {
      id: 'negotiation',
      title: 'Negotiation',
      color: 'bg-orange-100',
      leads: [
        {
          id: '4',
          company: 'Growth Co',
          contact: 'Lisa Wang',
          status: 'negotiation',
          priority: 'high' as const,
          assignee: 'AI Negotiator',
          value: '$75K',
          tags: ['Growth', 'Mid-market'],
          source: 'Cold Email'
        }
      ]
    },
    {
      id: 'closed',
      title: 'Closed Won',
      color: 'bg-green-100',
      leads: [
        {
          id: '5',
          company: 'Success Inc',
          contact: 'David Kim',
          status: 'closed',
          priority: 'low' as const,
          assignee: 'AI Closer',
          value: '$200K',
          tags: ['Enterprise', 'Success'],
          source: 'Partner'
        }
      ]
    }
  ];

  const phases = [
    {
      name: 'Lead Generation',
      status: 'completed',
      agents: ['AI SDR', 'AI Researcher'],
      description: 'Identify and reach out to potential customers'
    },
    {
      name: 'Qualification',
      status: 'in-progress',
      agents: ['AI Qualifier', 'AI BDR'],
      description: 'Assess fit and budget qualification'
    },
    {
      name: 'Discovery',
      status: 'pending',
      agents: ['AI Sales', 'AI Demo'],
      description: 'Deep dive into customer needs'
    },
    {
      name: 'Proposal',
      status: 'pending',
      agents: ['AI Sales', 'AI Pricing'],
      description: 'Create and present proposals'
    },
    {
      name: 'Closing',
      status: 'pending',
      agents: ['AI Negotiator', 'AI Closer'],
      description: 'Final negotiation and contract signing'
    }
  ];

  const agents = [
    { name: 'AI SDR', status: 'active', tasks: 5 },
    { name: 'AI Qualifier', status: 'active', tasks: 3 },
    { name: 'AI Sales', status: 'idle', tasks: 2 },
    { name: 'AI Negotiator', status: 'active', tasks: 1 },
    { name: 'AI Closer', status: 'idle', tasks: 0 }
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
        <title>Selling - Command Center</title>
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
            <h1 className="text-xl font-semibold text-gray-900">Selling</h1>
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
              <h2 className="text-2xl font-semibold text-gray-900">Sales Pipeline</h2>
              <p className="text-sm text-gray-600">Track and manage your sales process</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Add Lead
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
                      <span className="text-sm text-gray-500">{column.leads.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {column.leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{lead.company}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{lead.contact}</p>
                          <p className="text-xs text-gray-500 mb-3">Value: {lead.value}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{lead.assignee}</span>
                            <div className="flex space-x-1">
                              {lead.tags.map((tag) => (
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
          <h3 className="text-lg font-semibold text-gray-900">Sales Phases</h3>
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

      {/* Lead Detail Drawer */}
      {isDrawerOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
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
                  <h4 className="font-medium text-gray-900 mb-2">{selectedLead.company}</h4>
                  <p className="text-sm text-gray-600">{selectedLead.contact}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedLead.status}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Value</h5>
                  <p className="text-sm text-gray-600">{selectedLead.value}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assignee</h5>
                  <p className="text-sm text-gray-600">{selectedLead.assignee}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Source</h5>
                  <p className="text-sm text-gray-600">{selectedLead.source}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.tags.map((tag) => (
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