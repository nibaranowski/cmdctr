import type { Meta, StoryObj } from '@storybook/nextjs';

import { AgentActivityFeed } from './AgentActivityFeed';

const meta: Meta<typeof AgentActivityFeed> = {
  title: 'Workspace/AgentActivityFeed',
  component: AgentActivityFeed,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    companyId: {
      control: 'text',
      description: 'Company ID to filter activities',
    },
    metaboxId: {
      control: 'text',
      description: 'Optional MetaBox ID to filter activities',
    },
    phaseId: {
      control: 'text',
      description: 'Optional Phase ID to filter activities',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of activities to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companyId: 'company_1',
    maxItems: 50,
  },
};

export const WithMetaBoxFilter: Story = {
  args: {
    companyId: 'company_1',
    metaboxId: 'metabox_1',
    maxItems: 30,
  },
};

export const WithPhaseFilter: Story = {
  args: {
    companyId: 'company_1',
    metaboxId: 'metabox_1',
    phaseId: 'phase_1',
    maxItems: 20,
  },
};

export const LimitedItems: Story = {
  args: {
    companyId: 'company_1',
    maxItems: 10,
  },
};

export const LargeCompany: Story = {
  args: {
    companyId: 'large_company_1',
    maxItems: 100,
  },
}; 