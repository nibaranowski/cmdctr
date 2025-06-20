import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { AgentActivityFeed } from '../components/workspace/AgentActivityFeed';
import { AgentDashboard } from '../components/workspace/AgentDashboard';

interface Card {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  tags: string[];
}

export default function Fundraising() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'activity'>('agents');

  const columns = [
    {
      id: 'identify',
      title: 'Identify Investors',
      color: 'bg-gray-100',
      cards: [
        {
          id: '1',
          title: 'Sequoia Capital',
          description: 'Series A lead investor, $10M target',
          status: 'identify',
          priority: 'high' as const,
          assignee: 'AI Scout',
          dueDate: '2024-02-15',
          tags: ['Series A', 'Lead']
        },
        {
          id: '2',
          title: 'Andreessen Horowitz',
          description: 'Follow-on investment opportunity',
          status: 'identify',
          priority: 'medium' as const,
          assignee: 'AI Scout',
          dueDate: '2024-02-20',
          tags: ['Series A', 'Follow-on']
        }
      ]
    },
    {
      id: 'conflict',
      title: 'Conflict Check',
      color: 'bg-yellow-100',
      cards: [
        {
          id: '3',
          title: 'Benchmark Capital',
          description: 'Portfolio conflict analysis needed',
          status: 'conflict',
          priority: 'high' as const,
          assignee: 'AI Legal',
          dueDate: '2024-02-18',
          tags: ['Legal', 'Conflict']
        }
      ]
    },
    {
      id: 'outreach',
      title: 'Intro/Outreach',
      color: 'bg-blue-100',
      cards: [
        {
          id: '4',
          title: 'First Round Capital',
          description: 'Initial outreach and pitch deck sent',
          status: 'outreach',
          priority: 'medium' as const,
          assignee: 'AI Outreach',
          dueDate: '2024-02-22',
          tags: ['Outreach', 'Pitch']
        }
      ]
    },
    {
      id: 'meeting',
      title: 'Meeting Scheduled',
      color: 'bg-purple-100',
      cards: [
        {
          id: '5',
          title: 'Kleiner Perkins',
          description: 'Partner meeting scheduled for next week',
          status: 'meeting',
          priority: 'high' as const,
          assignee: 'AI Scheduler',
          dueDate: '2024-02-25',
          tags: ['Meeting', 'Partner']
        }
      ]
    },
    {
      id: 'negotiation',
      title: 'Negotiation',
      color: 'bg-orange-100',
      cards: [
        {
          id: '6',
          title: 'Accel Partners',
          description: 'Term sheet under review',
          status: 'negotiation',
          priority: 'high' as const,
          assignee: 'AI Negotiator',
          dueDate: '2024-03-01',
          tags: ['Term Sheet', 'Review']
        }
      ]
    },
    {
      id: 'closed',
      title: 'Closed',
      color: 'bg-green-100',
      cards: [
        {
          id: '7',
          title: 'Index Ventures',
          description: 'Deal closed successfully',
          status: 'closed',
          priority: 'low' as const,
          assignee: 'AI Closer',
          dueDate: '2024-01-30',
          tags: ['Closed', 'Success']
        }
      ]
    }
  ];

  const phases = [
    {
      name: 'Discovery',
      status: 'completed',
      agents: ['AI Scout', 'AI Researcher'],
      description: 'Identify and research potential investors'
    },
    {
      name: 'Validation',
      status: 'in-progress',
      agents: ['AI Legal', 'AI Compliance'],
      description: 'Conflict checks and due diligence'
    },
    {
      name: 'Engagement',
      status: 'pending',
      agents: ['AI Outreach', 'AI Scheduler'],
      description: 'Initial contact and meeting scheduling'
    },
    {
      name: 'Negotiation',
      status: 'pending',
      agents: ['AI Negotiator', 'AI Legal'],
      description: 'Term sheet negotiation and legal review'
    },
    {
      name: 'Closing',
      status: 'pending',
      agents: ['AI Closer', 'AI Finance'],
      description: 'Final documentation and fund transfer'
    }
  ];

  const agents = [
    { name: 'AI Scout', status: 'active', tasks: 3 },
    { name: 'AI Legal', status: 'active', tasks: 2 },
    { name: 'AI Outreach', status: 'idle', tasks: 1 },
    { name: 'AI Negotiator', status: 'active', tasks: 1 },
    { name: 'AI Scheduler', status: 'idle', tasks: 0 }
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
        <title>Fundraising - Command Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Left Sidebar - Agent Stack */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Fundraising</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🤖 Agents
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Activity
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'agents' ? (
            <div className="p-4">
              <AgentDashboard
                companyId="demo-company"
                metaboxId="fundraising"
                phaseId="fundraising-phase"
              />
            </div>
          ) : (
            <div className="p-4">
              <AgentActivityFeed
                companyId="demo-company"
                metaboxId="fundraising"
                phaseId="fundraising-phase"
                maxItems={20}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Kanban Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Investor Pipeline</h2>
              <p className="text-sm text-gray-600">Track and manage your fundraising process with AI agents</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Add Investor
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
                      <span className="text-sm text-gray-500">{column.cards.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {column.cards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                          onClick={() => {
                            setSelectedCard(card);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(card.priority)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{card.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{card.assignee}</span>
                            <div className="flex space-x-1">
                              {card.tags.map((tag) => (
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
          <h3 className="text-lg font-semibold text-gray-900">Fundraising Phases</h3>
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

      {/* Card Detail Drawer */}
      {isDrawerOpen && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Investor Details</h3>
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
                  <h4 className="font-medium text-gray-900 mb-2">{selectedCard.title}</h4>
                  <p className="text-sm text-gray-600">{selectedCard.description}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedCard.status}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assignee</h5>
                  <p className="text-sm text-gray-600">{selectedCard.assignee}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Due Date</h5>
                  <p className="text-sm text-gray-600">{selectedCard.dueDate}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.tags.map((tag) => (
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