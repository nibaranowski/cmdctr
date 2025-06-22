import type { Meta, StoryObj } from '@storybook/react';

import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Landing/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main footer for the marketing homepage with navigation links and social media.',
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

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const FocusState: Story = {
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('a') as HTMLElement;
    if (link) link.focus();
  },
};

export const HoverState: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};
