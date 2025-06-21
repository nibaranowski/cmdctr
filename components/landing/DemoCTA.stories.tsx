import type { Meta, StoryObj } from '@storybook/react';
import DemoCTA from './DemoCTA';

const meta: Meta<typeof DemoCTA> = {
  title: 'Landing/DemoCTA',
  component: DemoCTA,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A call-to-action section to encourage users to sign up.',
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
    const button = canvasElement.querySelector('button') as HTMLElement;
    if (button) button.focus();
  },
};

export const HoverState: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};
