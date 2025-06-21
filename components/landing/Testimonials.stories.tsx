import type { Meta, StoryObj } from '@storybook/react';
import Testimonials from './Testimonials';

const meta: Meta<typeof Testimonials> = {
  title: 'Landing/Testimonials',
  component: Testimonials,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A section for customer testimonials and logos.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
