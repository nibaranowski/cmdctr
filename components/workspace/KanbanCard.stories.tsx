import type { Meta, StoryObj } from '@storybook/react';
// import { within, userEvent, expect } from '@storybook/test';

import { KanbanCard } from './KanbanCard';
import { KanbanCard as KanbanCardType } from './types';

const meta: Meta<typeof KanbanCard> = {
  title: 'Components/Workspace/KanbanCard',
  component: KanbanCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    card: { control: 'object' },
    isSelected: { control: 'boolean' },
    isFocused: { control: 'boolean' },
    isDragging: { control: 'boolean' },
    onSelect: { action: 'selected' },
    onUpdate: { action: 'updated' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseCard: KanbanCardType = {
  id: 'card-1',
  title: 'Implement User Authentication',
  columnId: 'col-1',
  priority: 'high',
  description: 'Set up JWT authentication with email/password.',
  tags: ['auth', 'backend'],
  assignee: 'Nico',
  dueDate: new Date('2024-07-01T23:59:59Z').toISOString(),
};

export const Default: Story = {
  args: {
    card: baseCard,
    isSelected: false,
    isFocused: false,
    isDragging: false,
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const Focused: Story = {
    args: {
      ...Default.args,
      isFocused: true,
    },
  };

export const Dragging: Story = {
    args: {
        ...Default.args,
        isDragging: true,
    },
};

export const Editing: Story = {
    args: {
        ...Default.args,
    },
//     play: async ({ canvasElement }) => {
//         const canvas = within(canvasElement);
//         const card = canvas.getByRole('button');
//         
//         await userEvent.dblClick(card);
// 
//         const textarea = canvas.getByRole('textbox');
//         await expect(textarea).toBeInTheDocument();
//         await expect(textarea).toHaveValue(baseCard.title);
//     },
}; 