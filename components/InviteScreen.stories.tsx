import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import InviteScreen from './InviteScreen';

const meta: Meta<typeof InviteScreen> = {
  title: 'Authentication/InviteScreen',
  component: InviteScreen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    expired: {
      control: 'boolean',
      description: 'Whether the invite has expired',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Expired: Story = {
  args: {
    expired: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Failed to load invite. Please try again.',
  },
}; 