import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import Modal from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Default Modal',
    children: 'This is the content of the modal.',
    onClose: () => console.log('Modal closed'),
  },
};

export const WithInteraction: Story = {
  args: {
    ...Default.args,
    title: 'Interactive Modal',
  },
//   play: async ({ canvasElement, args }) => {
//     const canvas = within(canvasElement);
//     
//     // Find the close button and click it
//     const closeButton = await canvas.findByLabelText('Close');
//     await userEvent.click(closeButton);
// 
//     // Check if the onClose function was called
//     await expect(args.onClose).toHaveBeenCalled();
//   },
}; 