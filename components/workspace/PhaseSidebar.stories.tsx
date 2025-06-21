import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PhaseSidebar } from './PhaseSidebar';
import { Phase } from './WorkspaceLayout';

const meta: Meta<typeof PhaseSidebar> = {
  title: 'Workspace/PhaseSidebar',
  component: PhaseSidebar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    workspaceType: {
      control: { type: 'select' },
      options: ['fundraising', 'hiring', 'marketing', 'product', 'selling'],
      description: 'Type of workspace',
    },
    onAddPhase: {
      action: 'add phase',
      description: 'Callback when adding a new phase',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPhases: Phase[] = [
  {
    id: '1',
    name: 'Research & Discovery',
    status: 'completed',
    agents: [
      {
        id: '1',
        name: 'Alice',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        role: 'Research Agent',
      },
      {
        id: '2',
        name: 'Bob',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        status: 'busy',
        role: 'Analysis Agent',
      },
    ],
    metrics: {
      totalItems: 25,
      completedItems: 25,
      inProgressItems: 0,
      blockedItems: 0,
    },
    quickActions: [
      {
        id: '1',
        name: 'View Report',
        icon: '📊',
        action: () => console.log('View report'),
      },
      {
        id: '2',
        name: 'Export Data',
        icon: '📤',
        action: () => console.log('Export data'),
      },
    ],
  },
  {
    id: '2',
    name: 'Strategy Development',
    status: 'active',
    agents: [
      {
        id: '3',
        name: 'Carol',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        role: 'Strategy Agent',
      },
      {
        id: '4',
        name: 'David',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        status: 'offline',
        role: 'Planning Agent',
      },
    ],
    metrics: {
      totalItems: 15,
      completedItems: 8,
      inProgressItems: 5,
      blockedItems: 2,
    },
    quickActions: [
      {
        id: '3',
        name: 'Review Strategy',
        icon: '📋',
        action: () => console.log('Review strategy'),
      },
      {
        id: '4',
        name: 'Schedule Meeting',
        icon: '📅',
        action: () => console.log('Schedule meeting'),
      },
    ],
  },
  {
    id: '3',
    name: 'Execution & Implementation',
    status: 'pending',
    agents: [
      {
        id: '5',
        name: 'Eve',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
        status: 'busy',
        role: 'Execution Agent',
      },
    ],
    metrics: {
      totalItems: 30,
      completedItems: 0,
      inProgressItems: 0,
      blockedItems: 0,
    },
    quickActions: [
      {
        id: '5',
        name: 'Start Phase',
        icon: '▶️',
        action: () => console.log('Start phase'),
      },
    ],
  },
];

const fundraisingPhases: Phase[] = [
  {
    id: '1',
    name: 'Investor Research',
    status: 'completed',
    agents: [
      {
        id: '1',
        name: 'Research Agent',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        role: 'Research Agent',
      },
    ],
    metrics: {
      totalItems: 50,
      completedItems: 50,
      inProgressItems: 0,
      blockedItems: 0,
    },
    quickActions: [
      {
        id: '1',
        name: 'View Report',
        icon: '📊',
        action: () => console.log('View report'),
      },
    ],
  },
  {
    id: '2',
    name: 'Outreach & Networking',
    status: 'active',
    agents: [
      {
        id: '2',
        name: 'Outreach Agent',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        status: 'busy',
        role: 'Outreach Agent',
      },
    ],
    metrics: {
      totalItems: 100,
      completedItems: 35,
      inProgressItems: 45,
      blockedItems: 20,
    },
    quickActions: [
      {
        id: '2',
        name: 'Send Follow-ups',
        icon: '📧',
        action: () => console.log('Send follow-ups'),
      },
    ],
  },
];

const hiringPhases: Phase[] = [
  {
    id: '1',
    name: 'Job Posting & Sourcing',
    status: 'completed',
    agents: [
      {
        id: '1',
        name: 'Sourcing Agent',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        status: 'online',
        role: 'Sourcing Agent',
      },
    ],
    metrics: {
      totalItems: 20,
      completedItems: 20,
      inProgressItems: 0,
      blockedItems: 0,
    },
    quickActions: [
      {
        id: '1',
        name: 'View Candidates',
        icon: '👥',
        action: () => console.log('View candidates'),
      },
    ],
  },
  {
    id: '2',
    name: 'Screening & Interviews',
    status: 'active',
    agents: [
      {
        id: '2',
        name: 'Screening Agent',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        status: 'busy',
        role: 'Screening Agent',
      },
    ],
    metrics: {
      totalItems: 15,
      completedItems: 8,
      inProgressItems: 5,
      blockedItems: 2,
    },
    quickActions: [
      {
        id: '2',
        name: 'Schedule Interview',
        icon: '📅',
        action: () => console.log('Schedule interview'),
      },
    ],
  },
];

export const Default: Story = {
  args: {
    phases: mockPhases,
    workspaceType: 'product',
  },
};

export const Fundraising: Story = {
  args: {
    phases: fundraisingPhases,
    workspaceType: 'fundraising',
  },
};

export const Hiring: Story = {
  args: {
    phases: hiringPhases,
    workspaceType: 'hiring',
  },
};

export const Marketing: Story = {
  args: {
    phases: mockPhases,
    workspaceType: 'marketing',
  },
};

export const Selling: Story = {
  args: {
    phases: mockPhases,
    workspaceType: 'selling',
  },
};

export const Empty: Story = {
  args: {
    phases: [],
    workspaceType: 'product',
  },
};

export const SinglePhase: Story = {
  args: {
    phases: mockPhases.slice(0, 1),
    workspaceType: 'product',
  },
}; 