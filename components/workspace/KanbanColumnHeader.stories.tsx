import type { Meta, StoryObj } from '@storybook/react';

import { KanbanColumnHeader } from './KanbanColumnHeader';

const meta = {
  title: 'Components/Workspace/KanbanColumnHeader',
  component: KanbanColumnHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KanbanColumnHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'To Do',
    itemCount: 5,
  },
};

export const WithPhase: Story = {
  args: {
    title: 'In Progress',
    itemCount: 3,
    phaseId: '2',
  },
};

export const SingleItem: Story = {
  args: {
    title: 'Done',
    itemCount: 1,
  },
};

export const EmptyColumn: Story = {
  args: {
    title: 'Backlog',
    itemCount: 0,
  },
}; 