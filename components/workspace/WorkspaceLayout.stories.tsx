import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WorkspaceLayout, Phase, KanbanColumn, Agent } from './WorkspaceLayout';

const meta: Meta<typeof WorkspaceLayout> = {
  title: 'Workspace/WorkspaceLayout',
  component: WorkspaceLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    workspaceType: {
      control: 'select',
      options: ['fundraising', 'hiring', 'marketing', 'product', 'selling'],
      description: 'Type of workspace to display',
    },
    title: {
      control: 'text',
      description: 'Workspace title',
    },
    onAddPhase: {
      action: 'addPhase',
      description: 'Callback when adding a new phase',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockAgents: Agent[] = [
  {
    id: 'agent_1',
    name: 'AI Research Agent',
    avatar: '🤖',
    status: 'online',
    role: 'Research Specialist',
  },
  {
    id: 'agent_2',
    name: 'Outreach Agent',
    avatar: '📧',
    status: 'busy',
    role: 'Communication',
  },
  {
    id: 'agent_3',
    name: 'Analytics Agent',
    avatar: '📊',
    status: 'online',
    role: 'Data Analyst',
  },
];

const mockPhases: Phase[] = [
  {
    id: 'phase_1',
    name: 'Research & Discovery',
    status: 'completed',
    agents: [mockAgents[0]!],
    metrics: {
      totalItems: 15,
      completedItems: 15,
      inProgressItems: 0,
      blockedItems: 0,
    },
    quickActions: [
      {
        id: 'action_1',
        name: 'Export Data',
        icon: '📤',
        action: () => console.log('Export data'),
      },
    ],
  },
  {
    id: 'phase_2',
    name: 'Outreach & Engagement',
    status: 'active',
    agents: [mockAgents[1]!, mockAgents[2]!],
    metrics: {
      totalItems: 25,
      completedItems: 12,
      inProgressItems: 8,
      blockedItems: 5,
    },
    quickActions: [
      {
        id: 'action_2',
        name: 'Send Follow-ups',
        icon: '📨',
        action: () => console.log('Send follow-ups'),
      },
    ],
  },
  {
    id: 'phase_3',
    name: 'Negotiation & Closing',
    status: 'pending',
    agents: [],
    metrics: {
      totalItems: 8,
      completedItems: 0,
      inProgressItems: 0,
      blockedItems: 8,
    },
    quickActions: [
      {
        id: 'action_3',
        name: 'Schedule Meeting',
        icon: '📅',
        action: () => console.log('Schedule meeting'),
      },
    ],
  },
];

const mockColumns: KanbanColumn[] = [
  {
    id: 'col_1',
    title: 'To Do',
    phaseId: 'phase_2',
    items: [
      {
        id: 'item_1',
        title: 'Research potential investors',
        description: 'Identify and research 50 potential investors in the fintech space',
        status: 'pending',
        priority: 'high',
        assignee: mockAgents[0]!,
        tags: ['research', 'investors'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'item_2',
        title: 'Prepare pitch deck',
        description: 'Create comprehensive pitch deck for Series A funding',
        status: 'pending',
        priority: 'urgent',
        assignee: mockAgents[2]!,
        tags: ['pitch', 'deck'],
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
      },
    ],
  },
  {
    id: 'col_2',
    title: 'In Progress',
    phaseId: 'phase_2',
    items: [
      {
        id: 'item_3',
        title: 'Send initial outreach emails',
        description: 'Send personalized outreach emails to 20 selected investors',
        status: 'in_progress',
        priority: 'high',
        assignee: mockAgents[1]!,
        tags: ['outreach', 'email'],
        createdAt: '2024-01-13T11:00:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
      },
    ],
  },
  {
    id: 'col_3',
    title: 'Done',
    phaseId: 'phase_2',
    items: [
      {
        id: 'item_4',
        title: 'Market analysis report',
        description: 'Complete comprehensive market analysis for fintech sector',
        status: 'completed',
        priority: 'medium',
        assignee: mockAgents[0]!,
        tags: ['analysis', 'market'],
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
      },
    ],
  },
];

export const Fundraising: Story = {
  args: {
    workspaceType: 'fundraising',
    title: 'Fundraising Campaign',
    phases: mockPhases,
    columns: mockColumns,
  },
};

export const Hiring: Story = {
  args: {
    workspaceType: 'hiring',
    title: 'Hiring Pipeline',
    phases: [
      {
        id: 'phase_1',
        name: 'Sourcing',
        status: 'completed',
        agents: [mockAgents[0]!],
        metrics: {
          totalItems: 15,
          completedItems: 15,
          inProgressItems: 0,
          blockedItems: 0,
        },
        quickActions: [
          {
            id: 'action_1',
            name: 'Post Job',
            icon: '📝',
            action: () => console.log('Post job'),
          },
        ],
      },
      {
        id: 'phase_2',
        name: 'Screening',
        status: 'active',
        agents: [mockAgents[1]!, mockAgents[2]!],
        metrics: {
          totalItems: 25,
          completedItems: 12,
          inProgressItems: 8,
          blockedItems: 5,
        },
        quickActions: [
          {
            id: 'action_2',
            name: 'Schedule Interview',
            icon: '📅',
            action: () => console.log('Schedule interview'),
          },
        ],
      },
      {
        id: 'phase_3',
        name: 'Interview',
        status: 'pending',
        agents: [],
        metrics: {
          totalItems: 8,
          completedItems: 0,
          inProgressItems: 0,
          blockedItems: 8,
        },
        quickActions: [
          {
            id: 'action_3',
            name: 'Send Offer',
            icon: '📄',
            action: () => console.log('Send offer'),
          },
        ],
      },
    ],
    columns: [
      {
        id: 'col_1',
        title: 'Candidates',
        phaseId: 'phase_2',
        items: [
          {
            id: 'candidate_1',
            title: 'John Doe - Senior Developer',
            description: 'Full-stack developer with 8 years experience',
            status: 'pending',
            priority: 'high',
            assignee: mockAgents[0]!,
            tags: ['developer', 'senior'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ],
      },
      {
        id: 'col_2',
        title: 'Screening',
        phaseId: 'phase_2',
        items: [],
      },
      {
        id: 'col_3',
        title: 'Hired',
        phaseId: 'phase_2',
        items: [],
      },
    ],
  },
};

export const Marketing: Story = {
  args: {
    workspaceType: 'marketing',
    title: 'Marketing Campaign',
    phases: [
      {
        id: 'phase_1',
        name: 'Planning',
        status: 'completed',
        agents: [mockAgents[0]!],
        metrics: {
          totalItems: 15,
          completedItems: 15,
          inProgressItems: 0,
          blockedItems: 0,
        },
        quickActions: [
          {
            id: 'action_1',
            name: 'Export Data',
            icon: '📤',
            action: () => console.log('Export data'),
          },
        ],
      },
      {
        id: 'phase_2',
        name: 'Execution',
        status: 'active',
        agents: [mockAgents[1]!, mockAgents[2]!],
        metrics: {
          totalItems: 25,
          completedItems: 12,
          inProgressItems: 8,
          blockedItems: 5,
        },
        quickActions: [
          {
            id: 'action_2',
            name: 'Send Follow-ups',
            icon: '📨',
            action: () => console.log('Send follow-ups'),
          },
        ],
      },
      {
        id: 'phase_3',
        name: 'Analysis',
        status: 'pending',
        agents: [],
        metrics: {
          totalItems: 8,
          completedItems: 0,
          inProgressItems: 0,
          blockedItems: 8,
        },
        quickActions: [
          {
            id: 'action_3',
            name: 'Schedule Meeting',
            icon: '📅',
            action: () => console.log('Schedule meeting'),
          },
        ],
      },
    ],
    columns: mockColumns,
  },
};

export const Product: Story = {
  args: {
    workspaceType: 'product',
    title: 'Product Development',
    phases: [
      {
        id: 'phase_1',
        name: 'Discovery',
        status: 'completed',
        agents: [mockAgents[0]!],
        metrics: {
          totalItems: 15,
          completedItems: 15,
          inProgressItems: 0,
          blockedItems: 0,
        },
        quickActions: [
          {
            id: 'action_1',
            name: 'Export Data',
            icon: '📤',
            action: () => console.log('Export data'),
          },
        ],
      },
      {
        id: 'phase_2',
        name: 'Development',
        status: 'active',
        agents: [mockAgents[1]!, mockAgents[2]!],
        metrics: {
          totalItems: 25,
          completedItems: 12,
          inProgressItems: 8,
          blockedItems: 5,
        },
        quickActions: [
          {
            id: 'action_2',
            name: 'Send Follow-ups',
            icon: '📨',
            action: () => console.log('Send follow-ups'),
          },
        ],
      },
      {
        id: 'phase_3',
        name: 'Launch',
        status: 'pending',
        agents: [],
        metrics: {
          totalItems: 8,
          completedItems: 0,
          inProgressItems: 0,
          blockedItems: 8,
        },
        quickActions: [
          {
            id: 'action_3',
            name: 'Schedule Meeting',
            icon: '📅',
            action: () => console.log('Schedule meeting'),
          },
        ],
      },
    ],
    columns: mockColumns,
  },
};

export const Selling: Story = {
  args: {
    workspaceType: 'selling',
    title: 'Sales Pipeline',
    phases: [
      {
        id: 'phase_1',
        name: 'Prospecting',
        status: 'completed',
        agents: [mockAgents[0]!],
        metrics: {
          totalItems: 15,
          completedItems: 15,
          inProgressItems: 0,
          blockedItems: 0,
        },
        quickActions: [
          {
            id: 'action_1',
            name: 'Export Data',
            icon: '📤',
            action: () => console.log('Export data'),
          },
        ],
      },
      {
        id: 'phase_2',
        name: 'Qualification',
        status: 'active',
        agents: [mockAgents[1]!, mockAgents[2]!],
        metrics: {
          totalItems: 25,
          completedItems: 12,
          inProgressItems: 8,
          blockedItems: 5,
        },
        quickActions: [
          {
            id: 'action_2',
            name: 'Send Follow-ups',
            icon: '📨',
            action: () => console.log('Send follow-ups'),
          },
        ],
      },
      {
        id: 'phase_3',
        name: 'Closing',
        status: 'pending',
        agents: [],
        metrics: {
          totalItems: 8,
          completedItems: 0,
          inProgressItems: 0,
          blockedItems: 8,
        },
        quickActions: [
          {
            id: 'action_3',
            name: 'Schedule Meeting',
            icon: '📅',
            action: () => console.log('Schedule meeting'),
          },
        ],
      },
    ],
    columns: mockColumns,
  },
}; 