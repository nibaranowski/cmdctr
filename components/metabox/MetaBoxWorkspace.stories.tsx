import type { Meta, StoryObj } from '@storybook/react';

import { MetaBox } from '../../models/MetaBox';
import { fundraisingManifest } from '../../types/metaBoxManifest';

import { MetaBoxWorkspace } from './MetaBoxWorkspace';
import { CoreObject } from './types';

const meta: Meta<typeof MetaBoxWorkspace> = {
  title: 'MetaBox/MetaBoxWorkspace',
  component: MetaBoxWorkspace,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Universal meta box workspace shell with three-panel layout, schema-driven for all meta box types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: {
      action: 'saved',
      description: 'Callback when MetaBox is saved',
    },
    onObjectUpdate: {
      action: 'objectUpdated',
      description: 'Callback when a core object is updated',
    },
    onObjectCreate: {
      action: 'objectCreated',
      description: 'Callback when a new core object is created',
    },
    onObjectDelete: {
      action: 'objectDeleted',
      description: 'Callback when a core object is deleted',
    },
    userId: {
      control: 'text',
      description: 'User ID for permissions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetaBoxWorkspace>;

// Mock data
const mockMetaBox = new MetaBox({
  id: 'metabox_1',
  name: 'Fundraising Campaign',
  description: 'Complete fundraising campaign management',
  company_id: 'company_1',
  owner_id: 'user_1',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  phases: [
    {
      id: 'phase_1',
      name: 'Research & Discovery',
      order: 1,
      description: 'Identify potential investors and research market',
      metabox_id: 'metabox_1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_2',
      name: 'Outreach & Engagement',
      order: 2,
      description: 'Contact and engage with potential investors',
      metabox_id: 'metabox_1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_3',
      name: 'Negotiation & Closing',
      order: 3,
      description: 'Finalize deals and close investments',
      metabox_id: 'metabox_1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ],
});

const mockCoreObjects: CoreObject[] = [
  {
    id: 'object_1',
    title: 'Sequoia Capital Research',
    description: 'Research on Sequoia Capital investment thesis and portfolio',
    type: 'investor',
    phase: 'phase_1',
    priority: 'high',
    status: 'in_progress',
    tags: ['venture_capital', 'series_a'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T11:30:00Z',
    metadata: {
      company_size: '500-1000',
      investment_stage: 'Series A',
      check_size: '$5M-$10M',
    },
  },
  {
    id: 'object_2',
    title: 'Andreessen Horowitz Analysis',
    description: 'Deep dive into a16z investment patterns and thesis',
    type: 'investor',
    phase: 'phase_1',
    priority: 'high',
    status: 'completed',
    tags: ['venture_capital', 'series_a'],
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-15T14:20:00Z',
    metadata: {
      company_size: '100-500',
      investment_stage: 'Series A',
      check_size: '$3M-$8M',
    },
  },
  {
    id: 'object_3',
    title: 'Initial Outreach - Sequoia',
    description: 'First contact email to Sequoia Capital partners',
    type: 'task',
    phase: 'phase_2',
    priority: 'urgent',
    status: 'pending',
    tags: ['outreach', 'email'],
    created_at: '2024-01-15T12:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    metadata: {
      contact_person: 'Michael Moritz',
      email: 'mmoritz@sequoia.com',
      follow_up_date: '2024-01-20',
    },
  },
  {
    id: 'object_4',
    title: 'Pitch Deck Review',
    description: 'Review and refine pitch deck for investor meetings',
    type: 'task',
    phase: 'phase_2',
    priority: 'high',
    status: 'in_progress',
    tags: ['pitch', 'deck'],
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T16:45:00Z',
    metadata: {
      slides_count: 15,
      target_audience: 'Series A investors',
      review_status: 'in_progress',
    },
  },
  {
    id: 'object_5',
    title: 'Term Sheet Negotiation',
    description: 'Negotiate term sheet with interested investors',
    type: 'task',
    phase: 'phase_3',
    priority: 'urgent',
    status: 'pending',
    tags: ['negotiation', 'terms'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    metadata: {
      investor_name: 'Sequoia Capital',
      valuation: '$50M',
      equity_offered: '15%',
    },
  },
];

const productMetaBox = new MetaBox({
  id: 'metabox_2',
  name: 'Product Development',
  description: 'Product development lifecycle management',
  company_id: 'company_1',
  owner_id: 'user_1',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  phases: [
    {
      id: 'phase_1',
      name: 'Discovery',
      order: 1,
      description: 'Understand user needs and market opportunities',
      metabox_id: 'metabox_2',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_2',
      name: 'Design',
      order: 2,
      description: 'Create user experience and technical design',
      metabox_id: 'metabox_2',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_3',
      name: 'Development',
      order: 3,
      description: 'Build the product features',
      metabox_id: 'metabox_2',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ],
});

const productCoreObjects: CoreObject[] = [
  {
    id: 'feature_1',
    title: 'User Authentication System',
    description: 'Implement secure user authentication with OAuth',
    type: 'feature',
    phase: 'phase_3',
    priority: 'high',
    status: 'in_progress',
    tags: ['authentication', 'security'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T16:00:00Z',
    metadata: {
      complexity: 'medium',
      estimated_hours: 40,
      assigned_developer: 'John Doe',
    },
  },
  {
    id: 'feature_2',
    title: 'Dashboard Analytics',
    description: 'Create comprehensive analytics dashboard',
    type: 'feature',
    phase: 'phase_2',
    priority: 'medium',
    status: 'completed',
    tags: ['analytics', 'dashboard'],
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    metadata: {
      complexity: 'high',
      estimated_hours: 60,
      assigned_developer: 'Jane Smith',
    },
  },
];

export const Default: Story = {
  args: {
    manifest: fundraisingManifest,
  },
};

export const Loading: Story = {
  render: () => <div className="flex h-screen items-center justify-center text-gray-500 text-lg">Loading workspace...</div>,
};

export const Error: Story = {
  render: () => <div className="flex h-screen items-center justify-center text-red-600 text-lg">Failed to load workspace</div>,
};

export const Empty: Story = {
  args: {
    manifest: { ...fundraisingManifest, phases: [], agents: [], fields: [] },
  },
};

export const KanbanView: Story = {
  args: {
    manifest: fundraisingManifest,
  },
  render: (args) => <MetaBoxWorkspace {...args} />,
};

export const ListView: Story = {
  args: {
    manifest: fundraisingManifest,
  },
  render: (args) => {
    // Simulate list view by default
    return <MetaBoxWorkspace {...args} />;
  },
};

export const DetailPanelOpen: Story = {
  args: {
    manifest: fundraisingManifest,
  },
  render: (args) => {
    // Simulate detail panel open by setting selectedCoreObject
    // This is a placeholder; real implementation will wire up selection state
    return (
      <div className="relative">
        <MetaBoxWorkspace {...args} />
        <div className="absolute top-0 right-0 w-[420px] h-full bg-white border-l border-gray-200 shadow-xl flex items-center justify-center text-gray-700">Detail/Activity Panel (mock)</div>
      </div>
    );
  },
};

export const ProductDevelopment: Story = {
  args: {
    metaBox: productMetaBox,
    coreObjects: productCoreObjects,
    userId: 'user_1',
  },
};

export const EmptyWorkspace: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: [],
    userId: 'user_1',
  },
};

export const ReadOnly: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    userId: 'user_2', // Different user with read-only access
  },
};

export const MarketingCampaign: Story = {
  args: {
    metaBox: new MetaBox({
      id: 'metabox_3',
      name: 'Marketing Campaign',
      description: 'Digital marketing campaign management',
      company_id: 'company_1',
      owner_id: 'user_1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      phases: [
        {
          id: 'phase_1',
          name: 'Strategy',
          order: 1,
          description: 'Define campaign strategy and goals',
          metabox_id: 'metabox_3',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_2',
          name: 'Content Creation',
          order: 2,
          description: 'Create marketing materials and content',
          metabox_id: 'metabox_3',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_3',
          name: 'Execution',
          order: 3,
          description: 'Launch and monitor campaign',
          metabox_id: 'metabox_3',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ],
    }),
    coreObjects: [
      {
        id: 'campaign_1',
        title: 'Social Media Campaign',
        description: 'Launch social media campaign across platforms',
        type: 'campaign',
        phase: 'phase_3',
        priority: 'high',
        status: 'in_progress',
        tags: ['social_media', 'digital'],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T16:00:00Z',
        metadata: {
          platforms: ['Facebook', 'Instagram', 'LinkedIn'],
          budget: '$5000',
          target_audience: 'B2B professionals',
        },
      },
      {
        id: 'content_1',
        title: 'Blog Post Series',
        description: 'Create educational blog post series',
        type: 'content',
        phase: 'phase_2',
        priority: 'medium',
        status: 'completed',
        tags: ['content', 'blog'],
        created_at: '2024-01-14T09:00:00Z',
        updated_at: '2024-01-15T12:00:00Z',
        metadata: {
          post_count: 5,
          word_count: 2500,
          author: 'Marketing Team',
        },
      },
    ],
    userId: 'user_1',
  },
}; 