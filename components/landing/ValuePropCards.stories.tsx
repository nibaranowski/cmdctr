import type { Meta, StoryObj } from '@storybook/react';
import ValuePropCards from './ValuePropCards';

const meta: Meta<typeof ValuePropCards> = {
  title: 'Landing/ValuePropCards',
  component: ValuePropCards,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A section of cards highlighting the value propositions of the product.',
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
    const button = canvasElement.querySelector('button');
    if (button) button.focus();
  },
};

export const HoverState: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};
