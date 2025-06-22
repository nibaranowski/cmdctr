import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Landing/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main header for the marketing homepage.',
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
