import type { Meta, StoryObj } from '@storybook/react';
// import { within, userEvent, expect } from '@storybook/test';

import { KanbanColumn } from './KanbanColumn';
import { KanbanCard as KanbanCardType } from './types';

const meta = {
  title: 'Components/Workspace/KanbanColumn',
  component: KanbanColumn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KanbanColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockColumn = {
  id: 'col-1',
  title: 'To Do',
  order: 1,
  color: '#3B82F6',
};

const mockCards: KanbanCardType[] = [
  {
    id: 'card-1',
    title: 'Implement user authentication',
    columnId: 'col-1',
    priority: 'high',
    description: 'Set up JWT authentication with email/password',
    tags: ['auth', 'backend'],
    assignee: 'Nico',
    dueDate: new Date('2024-07-01').toISOString(),
  },
  {
    id: 'card-2',
    title: 'Design landing page',
    columnId: 'col-1',
    priority: 'medium',
    description: 'Create wireframes and mockups',
    tags: ['design', 'frontend'],
    assignee: 'Sarah',
  },
  {
    id: 'card-3',
    title: 'Setup CI/CD pipeline',
    columnId: 'col-1',
    priority: 'low',
    description: 'Configure GitHub Actions for automated deployment',
    tags: ['devops'],
  },
];

export const Default: Story = {
  args: {
    column: mockColumn,
    cards: mockCards,
    isDragging: false,
    draggedCardId: null,
    focusedCardId: null,
    selectedCardId: null,
    onCardSelect: () => {},
    onCardMove: async () => {},
    onDragStart: () => {},
    onDragEnd: () => {},
    onDrop: () => {},
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    cards: [],
  },
};

export const Dragging: Story = {
  args: {
    ...Default.args,
    isDragging: true,
    draggedCardId: 'card-1',
  },
};

export const WithSelectedCard: Story = {
  args: {
    ...Default.args,
    selectedCardId: 'card-2',
  },
};

export const WithFocusedCard: Story = {
  args: {
    ...Default.args,
    focusedCardId: 'card-3',
  },
};

export const AddCardInteraction: Story = {
  args: {
    ...Default.args,
    onCardCreate: async (columnId, card) => {
      console.log('Creating card:', { columnId, card });
    },
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const addButton = canvas.getByTitle('Add card');
//     
//     await expect(addButton).toBeInTheDocument();
//     await userEvent.click(addButton);
//     
//     // Should show the add card form
//     const textarea = canvas.getByPlaceholderText('Enter card title...');
//     await expect(textarea).toBeInTheDocument();
//   },
}; 