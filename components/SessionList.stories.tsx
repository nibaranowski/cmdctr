import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import SessionList from './SessionList';

const meta = {
  title: 'Authentication/SessionList',
  component: SessionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRevoke: { action: 'session revoked' },
  },
} satisfies Meta<typeof SessionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sessions: [
      {
        id: '1',
        device: 'MacBook Pro',
        lastActive: '2 hours ago',
        current: true,
      },
      {
        id: '2',
        device: 'iPhone 15',
        lastActive: '1 day ago',
        current: false,
      },
      {
        id: '3',
        device: 'Chrome on Windows',
        lastActive: '3 days ago',
        current: false,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    sessions: [],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    sessions: [],
  },
};

export const WithError: Story = {
  args: {
    error: 'Failed to load sessions.',
    sessions: [],
  },
};

export const SingleSession: Story = {
  args: {
    sessions: [
      {
        id: '1',
        device: 'MacBook Pro',
        lastActive: '2 hours ago',
        current: true,
      },
    ],
  },
};

export const RevokeInteraction: Story = {
  args: {
    sessions: [
      {
        id: '1',
        device: 'MacBook Pro',
        lastActive: '2 hours ago',
        current: true,
      },
      {
        id: '2',
        device: 'iPhone 15',
        lastActive: '1 day ago',
        current: false,
      },
    ],
    onRevoke: (id: string) => {
      console.log('Revoking session:', id);
    },
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const revokeButtons = canvas.getAllByRole('button', { name: /Revoke/ });
//     
//     await expect(revokeButtons).toHaveLength(2);
//     if (revokeButtons[1]) {
//       await userEvent.click(revokeButtons[1]); // Click the second revoke button
//     }
//   },
}; 