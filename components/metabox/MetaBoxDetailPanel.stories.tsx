import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MetaBox } from '../../models/MetaBox';

import { MetaBoxDetailPanel } from './MetaBoxDetailPanel';
import { CoreObject } from './types';

const meta: Meta<typeof MetaBoxDetailPanel> = {
  title: 'MetaBox/MetaBoxDetailPanel',
  component: MetaBoxDetailPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    userId: {
      control: 'text',
      description: 'Current user ID',
    },
    canEdit: {
      control: 'boolean',
      description: 'Whether the user can edit the object',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when panel is closed',
    },
    onAgentAssign: {
      action: 'agent assigned',
      description: 'Callback when an agent is assigned/unassigned',
    },
    onObjectUpdate: {
      action: 'object updated',
      description: 'Callback when object is updated',
    },
    'data-testid': {
      control: 'text',
      description: 'Test ID for the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMetaBox = new MetaBox({
  name: 'Product Development',
  company_id: 'company_1',
  description: 'Product development workflow',
  phases: [
    {
      id: 'phase_1',
      name: 'Research',
      order: 1,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_2',
      name: 'Design',
      order: 2,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_3',
      name: 'Development',
      order: 3,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_4',
      name: 'Testing',
      order: 4,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
});

const mockCoreObject: CoreObject = {
  id: '1',
  title: 'UI/UX Design System',
  status: 'active',
  phase: 'Design',
  priority: 'urgent',
  assignee: 'Bob Smith',
  created_at: '2024-01-18T09:00:00Z',
  updated_at: '2024-01-22T11:45:00Z',
};

const completedObject: CoreObject = {
  id: '2',
  title: 'User Research Analysis',
  status: 'completed',
  phase: 'Testing',
  priority: 'high',
  assignee: 'Alice Johnson',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T15:30:00Z',
};

const pendingObject: CoreObject = {
  id: '3',
  title: 'API Integration',
  status: 'pending',
  phase: 'Development',
  priority: 'medium',
  assignee: 'David Wilson',
  created_at: '2024-01-21T08:00:00Z',
  updated_at: '2024-01-21T08:00:00Z',
};

const unassignedObject: CoreObject = {
  id: '4',
  title: 'Documentation Update',
  status: 'pending',
  phase: 'Research',
  priority: 'low',
  created_at: '2024-01-24T11:00:00Z',
  updated_at: '2024-01-24T11:00:00Z',
};

export const Default: Story = {
  args: {
    object: mockCoreObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: ['agent_1', 'agent_2'],
  },
};

export const ReadOnly: Story = {
  args: {
    object: mockCoreObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: false,
    assignedAgents: ['agent_1'],
  },
};

export const CompletedObject: Story = {
  args: {
    object: completedObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: ['agent_3'],
  },
};

export const PendingObject: Story = {
  args: {
    object: pendingObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: [],
  },
};

export const UnassignedObject: Story = {
  args: {
    object: unassignedObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: [],
  },
};

export const ManyAssignedAgents: Story = {
  args: {
    object: mockCoreObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: ['agent_1', 'agent_2', 'agent_3', 'agent_4', 'agent_5'],
  },
};

export const WithTestId: Story = {
  args: {
    object: mockCoreObject,
    metaBox: mockMetaBox,
    userId: 'user_1',
    canEdit: true,
    assignedAgents: ['agent_1'],
    'data-testid': 'metabox-detail-panel-test',
  },
}; 