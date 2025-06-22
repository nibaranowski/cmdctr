import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Progress from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress bar component with multiple variants, sizes, and animated states.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Upload Progress',
    showValue: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Progress value={30} size="sm" label="Small" showValue />
      <Progress value={50} size="md" label="Medium" showValue />
      <Progress value={70} size="lg" label="Large" showValue />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Progress value={25} variant="default" label="Default" showValue />
      <Progress value={50} variant="success" label="Success" showValue />
      <Progress value={75} variant="warning" label="Warning" showValue />
      <Progress value={90} variant="error" label="Error" showValue />
      <Progress value={60} variant="info" label="Info" showValue />
    </div>
  ),
};

export const Striped: Story = {
  args: {
    value: 80,
    striped: true,
    label: 'Striped Progress',
    showValue: true,
  },
};

export const Animated: Story = {
  args: {
    value: 45,
    animated: true,
    label: 'Animated Progress',
    showValue: true,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    variant: 'success',
    label: 'Upload Complete',
    showValue: true,
  },
};

export const Zero: Story = {
  args: {
    value: 0,
    label: 'No Progress',
    showValue: true,
  },
};

export const CustomMax: Story = {
  args: {
    value: 7,
    max: 10,
    label: 'Custom Max (7/10)',
    showValue: true,
  },
};

export const MultipleProgress: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Status</h3>
        <div className="space-y-3">
          <Progress value={85} variant="success" label="Design" showValue />
          <Progress value={60} variant="info" label="Development" showValue />
          <Progress value={30} variant="warning" label="Testing" showValue />
          <Progress value={10} variant="error" label="Deployment" showValue />
        </div>
      </div>
    </div>
  ),
}; 