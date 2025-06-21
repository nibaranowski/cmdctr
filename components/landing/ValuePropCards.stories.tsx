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
