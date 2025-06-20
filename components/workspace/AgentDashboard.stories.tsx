import type { Meta, StoryObj } from '@storybook/nextjs';

import { AgentDashboard } from './AgentDashboard';

const meta: Meta<typeof AgentDashboard> = {
  title: 'Workspace/AgentDashboard',
  component: AgentDashboard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    companyId: {
      control: 'text',
      description: 'Company ID to filter agents',
    },
    metaboxId: {
      control: 'text',
      description: 'Optional MetaBox ID to filter agents',
    },
    phaseId: {
      control: 'text',
      description: 'Optional Phase ID to filter agents',
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

export const FundraisingTeam: Story = {
  args: {
    companyId: 'fundraising_company_1',
    metaboxId: 'fundraising_metabox_1',
  },
};

export const ProductTeam: Story = {
  args: {
    companyId: 'product_company_1',
    metaboxId: 'product_metabox_1',
  },
};

export const LargeOrganization: Story = {
  args: {
    companyId: 'large_org_1',
  },
}; 