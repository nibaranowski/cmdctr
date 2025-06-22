import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ThemeToggle from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle component that switches between light, dark, and system themes with smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the toggle button',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the theme label next to the toggle',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    size: 'md',
    showLabel: false,
  },
  decorators: [
    (Story: any) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    showLabel: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    showLabel: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
      <ThemeToggle size="lg" />
    </div>
  ),
};

export const WithLabelVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <ThemeToggle size="sm" showLabel />
      <ThemeToggle size="md" showLabel />
      <ThemeToggle size="lg" showLabel />
    </div>
  ),
}; 