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
