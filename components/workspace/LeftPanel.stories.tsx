import type { Meta, StoryObj } from '@storybook/nextjs';

import { LeftPanel } from './LeftPanel';

const meta: Meta<typeof LeftPanel> = {
  title: 'Workspace/LeftPanel',
  component: LeftPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    workspaceType: {
      control: { type: 'select' },
      options: ['fundraising', 'hiring', 'marketing', 'product', 'selling', 'custom'],
      description: 'Type of workspace to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Fundraising: Story = {
  args: {
    workspaceType: 'fundraising',
  },
};

export const Hiring: Story = {
  args: {
    workspaceType: 'hiring',
  },
};

export const Marketing: Story = {
  args: {
    workspaceType: 'marketing',
  },
};

export const Product: Story = {
  args: {
    workspaceType: 'product',
  },
};

export const Selling: Story = {
  args: {
    workspaceType: 'selling',
  },
};

export const Custom: Story = {
  args: {
    workspaceType: 'custom',
  },
}; 