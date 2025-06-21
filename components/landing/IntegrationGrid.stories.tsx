import type { Meta, StoryObj } from '@storybook/react';
import IntegrationGrid from './IntegrationGrid';

const meta: Meta<typeof IntegrationGrid> = {
  title: 'Landing/IntegrationGrid',
  component: IntegrationGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A section displaying integration logos and partner companies.',
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
    const integration = canvasElement.querySelector('.group') as HTMLElement;
    if (integration) integration.focus();
  },
};

export const HoverState: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};
