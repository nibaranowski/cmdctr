import type { Meta, StoryObj } from '@storybook/react';
import AutoLayoutPanel from './AutoLayoutPanel';

const meta: Meta<typeof AutoLayoutPanel> = {
  title: 'Components/AutoLayoutPanel',
  component: AutoLayoutPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // No arg types needed for this component as it manages its own state
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
}; 