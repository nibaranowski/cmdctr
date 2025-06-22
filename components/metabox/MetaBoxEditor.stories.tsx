import type { Meta, StoryObj } from '@storybook/react';
import { MetaBoxEditor } from './MetaBoxEditor';
import { MetaBox } from '../../models/MetaBox';

const meta: Meta<typeof MetaBoxEditor> = {
  title: 'MetaBox/MetaBoxEditor',
  component: MetaBoxEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: { action: 'saved' },
    onCancel: { action: 'cancelled' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const createMockMetaBox = (overrides = {}) => {
  return new MetaBox({
    name: 'Test Meta Box',
    description: 'A comprehensive test meta box with multiple phases',
    company_id: 'company_001',
    owner_id: 'user_001',
    phases: [
      {
        id: 'phase_1',
        name: 'Discovery',
        order: 1,
        description: 'Initial research and planning phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'phase_2',
        name: 'Development',
        order: 2,
        description: 'Building and implementation phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'phase_3',
        name: 'Testing',
        order: 3,
        description: 'Quality assurance and testing phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'phase_4',
        name: 'Deployment',
        order: 4,
        description: 'Final deployment and launch phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    ...overrides
  });
};

export const Default: Story = {
  args: {
    metaBox: createMockMetaBox(),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const EmptyMetaBox: Story = {
  args: {
    metaBox: createMockMetaBox({ phases: [] }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const ReadOnlyAccess: Story = {
  args: {
    metaBox: createMockMetaBox({ 
      owner_id: 'other_user',
      shared_with: ['user_001']
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const NoAccess: Story = {
  args: {
    metaBox: createMockMetaBox({ 
      owner_id: 'other_user',
      shared_with: []
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const FundraisingTemplate: Story = {
  args: {
    metaBox: createMockMetaBox({
      name: 'Fundraising Pipeline',
      description: 'Complete fundraising workflow with investor research and outreach',
      phases: [
        {
          id: 'phase_1',
          name: 'Target List',
          order: 1,
          description: 'Research and identify potential investors',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_2',
          name: 'Outreach',
          order: 2,
          description: 'Initial contact and relationship building',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_3',
          name: 'Scheduling',
          order: 3,
          description: 'Arrange meetings and calls',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_4',
          name: 'Negotiation',
          order: 4,
          description: 'Deal terms and investment discussions',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_5',
          name: 'Closing',
          order: 5,
          description: 'Finalize investment and legal documentation',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const HiringTemplate: Story = {
  args: {
    metaBox: createMockMetaBox({
      name: 'Hiring Pipeline',
      description: 'End-to-end hiring process from sourcing to onboarding',
      phases: [
        {
          id: 'phase_1',
          name: 'Sourcing',
          order: 1,
          description: 'Find and attract potential candidates',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_2',
          name: 'Screening',
          order: 2,
          description: 'Review resumes and initial assessments',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_3',
          name: 'Interviews',
          order: 3,
          description: 'Conduct technical and cultural interviews',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_4',
          name: 'Offer',
          order: 4,
          description: 'Extend offer and negotiate terms',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_5',
          name: 'Onboarding',
          order: 5,
          description: 'Welcome and integrate new team member',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const SalesTemplate: Story = {
  args: {
    metaBox: createMockMetaBox({
      name: 'Sales Pipeline',
      description: 'Sales pipeline with lead qualification and deal management',
      phases: [
        {
          id: 'phase_1',
          name: 'Lead Generation',
          order: 1,
          description: 'Identify and generate new leads',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_2',
          name: 'Qualification',
          order: 2,
          description: 'Assess lead fit and potential',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_3',
          name: 'Proposal',
          order: 3,
          description: 'Create and present proposals',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_4',
          name: 'Negotiation',
          order: 4,
          description: 'Negotiate terms and pricing',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_5',
          name: 'Closing',
          order: 5,
          description: 'Finalize deal and close sale',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const LongDescription: Story = {
  args: {
    metaBox: createMockMetaBox({
      name: 'Complex Workflow',
      description: 'This is a very long description that demonstrates how the MetaBox editor handles lengthy text content. It includes multiple sentences and should wrap properly within the UI components. The description provides detailed information about the workflow, its purpose, and how it should be used by team members.',
      phases: [
        {
          id: 'phase_1',
          name: 'Phase with Very Long Name That Might Overflow',
          order: 1,
          description: 'This phase also has a very long description that should wrap properly and not break the layout. It includes detailed information about what happens during this phase and what team members should expect.',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'phase_2',
          name: 'Short Phase',
          order: 2,
          description: 'Brief description',
          metabox_id: 'metabox_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
};

export const ManyPhases: Story = {
  args: {
    metaBox: createMockMetaBox({
      name: 'Enterprise Workflow',
      description: 'Complex workflow with many phases',
      phases: Array.from({ length: 12 }, (_, i) => ({
        id: `phase_${i + 1}`,
        name: `Phase ${i + 1}`,
        order: i + 1,
        description: `Description for phase ${i + 1}`,
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    }),
    companyId: 'company_001',
    userId: 'user_001',
  },
}; 