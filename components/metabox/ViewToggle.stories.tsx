import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import { ViewToggle } from './ViewToggle';

const meta: Meta<typeof ViewToggle> = {
  title: 'Components/MetaBox/ViewToggle',
  component: ViewToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentView: {
      control: { type: 'radio' },
      options: ['kanban', 'list'],
    },
    onViewChange: { action: 'viewChanged' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentView: 'kanban',
  },
};

export const ListSelected: Story = {
  args: {
    currentView: 'list',
  },
};

export const InteractionTest: Story = {
  args: {
    currentView: 'kanban',
  },
//   play: async ({ canvasElement, args }) => {
//     const canvas = within(canvasElement);
// 
//     const kanbanButton = await canvas.findByTitle('Kanban View');
//     const listButton = await canvas.findByTitle('List View');
// 
//     // Test clicking the list view button
//     await userEvent.click(listButton);
//     await expect(args.onViewChange).toHaveBeenCalledWith('list');
//     
//     // Test clicking the kanban view button
//     await userEvent.click(kanbanButton);
//     await expect(args.onViewChange).toHaveBeenCalledWith('kanban');
//   },
}; 