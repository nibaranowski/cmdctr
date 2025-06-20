import type { Meta, StoryObj } from '@storybook/nextjs';

import { MetaBox } from '../../models/MetaBox';

import { MetaBoxEditor } from './MetaBoxEditor';

const meta: Meta<typeof MetaBoxEditor> = {
  title: 'MetaBox/MetaBoxEditor',
  component: MetaBoxEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: {
      action: 'saved',
      description: 'Callback when MetaBox is saved',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback when editing is cancelled',
    },
    companyId: {
      control: 'text',
      description: 'Company ID',
    },
    userId: {
      control: 'text',
      description: 'User ID for permissions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

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

const emptyMetaBox = new MetaBox({
  id: 'metabox_2',
  name: 'New Project',
  description: 'Start with a blank slate',
  company_id: 'company_1',
  owner_id: 'user_1',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  phases: [],
});

const productMetaBox = new MetaBox({
  id: 'metabox_3',
  name: 'Product Development',
  description: 'Product development lifecycle',
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
      metabox_id: 'metabox_3',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_2',
      name: 'Design',
      order: 2,
      description: 'Create user experience and technical design',
      metabox_id: 'metabox_3',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_3',
      name: 'Development',
      order: 3,
      description: 'Build the product features',
      metabox_id: 'metabox_3',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_4',
      name: 'Testing',
      order: 4,
      description: 'Quality assurance and user testing',
      metabox_id: 'metabox_3',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'phase_5',
      name: 'Launch',
      order: 5,
      description: 'Release to production',
      metabox_id: 'metabox_3',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ],
});

export const Default: Story = {
  args: {
    metaBox: mockMetaBox,
    companyId: 'company_1',
    userId: 'user_1',
  },
};

export const EmptyMetaBox: Story = {
  args: {
    metaBox: emptyMetaBox,
    companyId: 'company_1',
    userId: 'user_1',
  },
};

export const ProductDevelopment: Story = {
  args: {
    metaBox: productMetaBox,
    companyId: 'company_1',
    userId: 'user_1',
  },
};

export const ReadOnly: Story = {
  args: {
    metaBox: mockMetaBox,
    companyId: 'company_1',
    userId: 'user_2', // Different user with read-only access
  },
};

export const MarketingCampaign: Story = {
  args: {
    metaBox: new MetaBox({
      id: 'metabox_4',
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
          metabox_id: 'metabox_4',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_2',
          name: 'Content Creation',
          order: 2,
          description: 'Create marketing materials and content',
          metabox_id: 'metabox_4',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_3',
          name: 'Execution',
          order: 3,
          description: 'Launch and monitor campaign',
          metabox_id: 'metabox_4',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_4',
          name: 'Analysis',
          order: 4,
          description: 'Analyze results and optimize',
          metabox_id: 'metabox_4',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ],
    }),
    companyId: 'company_1',
    userId: 'user_1',
  },
};

export const HiringPipeline: Story = {
  args: {
    metaBox: new MetaBox({
      id: 'metabox_5',
      name: 'Hiring Pipeline',
      description: 'Recruitment and hiring process',
      company_id: 'company_1',
      owner_id: 'user_1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      phases: [
        {
          id: 'phase_1',
          name: 'Sourcing',
          order: 1,
          description: 'Find and attract candidates',
          metabox_id: 'metabox_5',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_2',
          name: 'Screening',
          order: 2,
          description: 'Review resumes and initial screening',
          metabox_id: 'metabox_5',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_3',
          name: 'Interview',
          order: 3,
          description: 'Conduct interviews and assessments',
          metabox_id: 'metabox_5',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_4',
          name: 'Offer',
          order: 4,
          description: 'Make offers and negotiate',
          metabox_id: 'metabox_5',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 'phase_5',
          name: 'Onboarding',
          order: 5,
          description: 'Welcome and integrate new hires',
          metabox_id: 'metabox_5',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ],
    }),
    companyId: 'company_1',
    userId: 'user_1',
  },
}; 