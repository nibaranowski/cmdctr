import type { Meta, StoryObj } from '@storybook/react';
// import { within, userEvent, expect } from '@storybook/test';

import { MetaBoxToolbar } from './MetaBoxToolbar';

const meta = {
  title: 'Components/MetaBox/MetaBoxToolbar',
  component: MetaBoxToolbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetaBoxToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canEdit: true,
    canUndo: true,
    canRedo: false,
    isSaving: false,
    onUndo: () => console.log('Undo clicked'),
    onRedo: () => console.log('Redo clicked'),
    onTemplateSelect: () => console.log('Template select clicked'),
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    canEdit: false,
  },
};

export const NoUndoRedo: Story = {
  args: {
    ...Default.args,
    canUndo: false,
    canRedo: false,
  },
};

export const Saving: Story = {
  args: {
    ...Default.args,
    isSaving: true,
  },
};

export const UndoRedoInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const undoButton = canvas.getByTitle('Undo');
//     const redoButton = canvas.getByTitle('Redo');
//     
//     await expect(undoButton).toBeInTheDocument();
//     await expect(redoButton).toBeInTheDocument();
//     
//     await userEvent.click(undoButton);
//     await userEvent.click(redoButton);
//   },
};

export const TemplateSelectInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const templateButton = canvas.getByRole('button', { name: 'Templates' });
//     
//     await expect(templateButton).toBeInTheDocument();
//     await userEvent.click(templateButton);
//   },
};

export const SaveCancelInteraction: Story = {
  args: {
    ...Default.args,
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const saveButton = canvas.getByRole('button', { name: 'Save' });
//     const cancelButton = canvas.getByRole('button', { name: 'Cancel' });
//     
//     await expect(saveButton).toBeInTheDocument();
//     await expect(cancelButton).toBeInTheDocument();
//     
//     await userEvent.click(saveButton);
//     await userEvent.click(cancelButton);
//   },
}; 