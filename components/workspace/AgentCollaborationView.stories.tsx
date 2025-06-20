import type { Meta, StoryObj } from '@storybook/nextjs';

import { AgentCollaborationView } from './AgentCollaborationView';

const meta: Meta<typeof AgentCollaborationView> = {
  title: 'Workspace/AgentCollaborationView',
  component: AgentCollaborationView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    companyId: {
      control: 'text',
      description: 'Company ID to filter collaboration data',
    },
    metaboxId: {
      control: 'text',
      description: 'Optional MetaBox ID to filter collaboration data',
    },
    phaseId: {
      control: 'text',
      description: 'Optional Phase ID to filter collaboration data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companyId: 'company_1',
  },
};

export const WithMetaBoxFilter: Story = {
  args: {
    companyId: 'company_1',
    metaboxId: 'metabox_1',
  },
};

export const WithPhaseFilter: Story = {
  args: {
    companyId: 'company_1',
    metaboxId: 'metabox_1',
    phaseId: 'phase_1',
  },
};

export const LargeCompany: Story = {
  args: {
    companyId: 'large_company_1',
  },
};

export const FundraisingWorkflow: Story = {
  args: {
    companyId: 'fundraising_company_1',
    metaboxId: 'fundraising_metabox_1',
  },
};

export const ProductDevelopment: Story = {
  args: {
    companyId: 'product_company_1',
    metaboxId: 'product_metabox_1',
  },
}; 