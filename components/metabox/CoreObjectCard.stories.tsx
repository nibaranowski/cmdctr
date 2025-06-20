import type { Meta, StoryObj } from '@storybook/nextjs';

import { CoreObjectCard } from './CoreObjectCard';
import { CoreObject } from './types';

const meta: Meta<typeof CoreObjectCard> = {
  title: 'Components/MetaBox/CoreObjectCard',
  component: CoreObjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    object: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseObject: CoreObject = {
  id: 'obj-1',
  title: 'Develop new feature',
  status: 'active',
  phase: 'In Progress',
  priority: 'high',
  assignee: 'Nico',
  created_at: new Date('2023-10-26T10:00:00Z').toISOString(),
  updated_at: new Date('2023-10-26T11:00:00Z').toISOString(),
};

export const Default: Story = {
  args: {
    object: baseObject,
  },
};

export const Pending: Story = {
  args: {
    object: {
      ...baseObject,
      id: 'obj-2',
      status: 'pending',
      assignee: undefined,
    },
  },
};

export const Completed: Story = {
  args: {
    object: {
      ...baseObject,
      id: 'obj-3',
      status: 'completed',
      priority: 'low',
    },
  },
};

export const Archived: Story = {
  args: {
    object: {
      ...baseObject,
      id: 'obj-4',
      status: 'archived',
      assignee: undefined,
    },
  },
};

export const LongTitle: Story = {
    args: {
      object: {
        ...baseObject,
        id: 'obj-5',
        title: 'This is a very long title for an object to see how the card handles text overflow and wrapping behavior.',
      },
    },
  }; 