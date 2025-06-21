import type { Meta, StoryObj } from '@storybook/react';
import PersonaCards from './PersonaCards';

const meta: Meta<typeof PersonaCards> = {
  title: 'Landing/PersonaCards',
  component: PersonaCards,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A section of cards for different user personas.',
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
    const card = canvasElement.querySelector('[data-testid="card-root"]') as HTMLElement;
    if (card) card.focus();
  },
};

export const HoverState: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};
