import type { Meta, StoryObj } from '@storybook/react';
// import { within, userEvent, expect } from '@storybook/test';

import { MetaBoxPhase } from '../../models/MetaBox';

import { MetaBoxPhaseCard } from './MetaBoxPhaseCard';

const meta = {
  title: 'Components/MetaBox/MetaBoxPhaseCard',
  component: MetaBoxPhaseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetaBoxPhaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockPhase: MetaBoxPhase = {
  id: 'phase-1',
  name: 'Research & Discovery',
  order: 1,
  description: 'Initial research phase to understand market opportunities and user needs.',
  agent_id: 'agent-123',
  metabox_id: 'metabox-1',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
  update: () => {},
};

const mockPhaseWithoutAgent: MetaBoxPhase = {
  id: 'phase-2',
  name: 'Design & Prototyping',
  order: 2,
  description: 'Create wireframes and interactive prototypes.',
  metabox_id: 'metabox-1',
  created_at: '2024-01-15T11:00:00Z',
  updated_at: '2024-01-15T11:00:00Z',
  update: () => {},
};

const mockPhaseWithoutDescription: MetaBoxPhase = {
  id: 'phase-3',
  name: 'Development',
  order: 3,
  metabox_id: 'metabox-1',
  created_at: '2024-01-15T12:00:00Z',
  updated_at: '2024-01-15T12:00:00Z',
  update: () => {},
};

export const Default: Story = {
  args: {
    phase: mockPhase,
    isSelected: false,
    canEdit: true,
    onUpdate: (updates) => {
      console.log('Updating phase:', updates);
    },
    onDelete: () => {
      console.log('Deleting phase');
    },
    onSelect: () => {
      console.log('Selecting phase');
    },
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    canEdit: false,
  },
};

export const WithoutAgent: Story = {
  args: {
    ...Default.args,
    phase: mockPhaseWithoutAgent,
  },
};

export const WithoutDescription: Story = {
  args: {
    ...Default.args,
    phase: mockPhaseWithoutDescription,
  },
};

export const EditInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const editButton = canvas.getByTitle('Edit phase');
//     
//     await expect(editButton).toBeInTheDocument();
//     await userEvent.click(editButton);
//     
//     // Should show edit form
//     const nameInput = canvas.getByLabelText('Phase Name');
//     const descriptionTextarea = canvas.getByLabelText('Description');
//     
//     await expect(nameInput).toBeInTheDocument();
//     await expect(descriptionTextarea).toBeInTheDocument();
//     await expect(nameInput).toHaveValue('Research & Discovery');
//   },
};

export const DeleteInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const deleteButton = canvas.getByTitle('Delete phase');
//     
//     await expect(deleteButton).toBeInTheDocument();
//     await userEvent.click(deleteButton);
//     
//     // Should trigger confirmation dialog
//     // Note: window.confirm is mocked in Storybook
//   },
}; 