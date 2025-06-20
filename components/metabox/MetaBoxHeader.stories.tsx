import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import { MetaBox } from '../../models/MetaBox';

import { MetaBoxHeader } from './MetaBoxHeader';

const meta = {
  title: 'Components/MetaBox/MetaBoxHeader',
  component: MetaBoxHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetaBoxHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockMetaBox: MetaBox = {
  id: 'metabox-1',
  name: 'Product Launch Strategy',
  description: 'Comprehensive strategy for launching our new product line',
  company_id: 'company-1',
  owner_id: 'user-1',
  shared_with: ['user-2', 'user-3'],
  phases: [],
  templates: [],
  version: 1,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
  metadata: {},
  update: () => {},
  addPhase: () => {},
  removePhase: () => false,
  createTemplate: () => ({ id: 'template-1', name: 'Template', description: 'Template', phases: [], created_at: '', updated_at: '', version: 1, update: () => {} }),
  applyTemplate: () => {},
  canAccess: () => true,
  canEdit: () => true,
  detectConflict: () => ({ hasConflict: false }),
};

const mockMetaBoxWithoutDescription: MetaBox = {
  id: 'metabox-2',
  name: 'Simple Meta Box',
  company_id: 'company-1',
  owner_id: 'user-1',
  shared_with: ['user-2'],
  phases: [],
  templates: [],
  version: 1,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
  metadata: {},
  update: () => {},
  addPhase: () => {},
  removePhase: () => false,
  createTemplate: () => ({ id: 'template-1', name: 'Template', description: 'Template', phases: [], created_at: '', updated_at: '', version: 1, update: () => {} }),
  applyTemplate: () => {},
  canAccess: () => true,
  canEdit: () => true,
  detectConflict: () => ({ hasConflict: false }),
};

export const Default: Story = {
  args: {
    metaBox: mockMetaBox,
    userId: 'user-1',
    canEdit: true,
    viewMode: 'kanban',
    onSave: async (metaBox) => {
      console.log('Saving meta box:', metaBox);
    },
    onViewToggle: (view) => {
      console.log('View toggled to:', view);
    },
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    canEdit: false,
  },
};

export const WithoutDescription: Story = {
  args: {
    ...Default.args,
    metaBox: mockMetaBoxWithoutDescription,
  },
};

export const ListView: Story = {
  args: {
    ...Default.args,
    viewMode: 'list',
  },
};

export const ViewToggleInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const listButton = canvas.getByRole('button', { name: /list/i });
//     
//     await expect(listButton).toBeInTheDocument();
//     await userEvent.click(listButton);
//   },
};

export const SettingsInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const settingsButton = canvas.getByTitle('Settings');
//     
//     await expect(settingsButton).toBeInTheDocument();
//     await userEvent.click(settingsButton);
//     
//     // Should show settings dropdown
//     const nameInput = canvas.getByDisplayValue('Product Launch Strategy');
//     await expect(nameInput).toBeInTheDocument();
//   },
};

export const SaveInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const saveButton = canvas.getByRole('button', { name: 'Save' });
//     
//     await expect(saveButton).toBeInTheDocument();
//     await userEvent.click(saveButton);
//   },
}; 