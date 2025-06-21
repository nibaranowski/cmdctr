import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import AgentPanel from './AgentPanel';

const meta: Meta<typeof AgentPanel> = {
  title: 'Workspace/AgentPanel',
  component: AgentPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'max-w-4xl mx-auto',
  },
};

export const Compact: Story = {
  args: {
    className: 'max-w-2xl',
  },
};

export const FullWidth: Story = {
  args: {
    className: 'w-full',
  },
}; 