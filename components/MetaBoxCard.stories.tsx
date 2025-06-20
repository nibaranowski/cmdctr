import type { Meta, StoryObj } from '@storybook/nextjs';

import MetaBoxCard from './MetaBoxCard';

const meta: Meta<typeof MetaBoxCard> = {
  title: 'Components/MetaBoxCard',
  component: MetaBoxCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-gray-500'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Hiring: Story = {
  args: {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
};

export const Selling: Story = {
  args: {
    id: 'selling',
    icon: '🛍️',
    title: 'Selling',
    description: 'Lead qualification and sales automation',
    color: 'bg-green-500',
    stats: { active: 24, completed: 15 },
    href: '/selling',
  },
};

export const Fundraising: Story = {
  args: {
    id: 'fundraising',
    icon: '💰',
    title: 'Fundraising',
    description: 'Investor pipeline and deal tracking',
    color: 'bg-purple-500',
    stats: { active: 8, completed: 3 },
    href: '/fundraising',
  },
};

export const Product: Story = {
  args: {
    id: 'product',
    icon: '🚀',
    title: 'Product',
    description: 'Feature prioritization and roadmap',
    color: 'bg-orange-500',
    stats: { active: 18, completed: 12 },
    href: '/product',
  },
};

export const Marketing: Story = {
  args: {
    id: 'marketing',
    icon: '📢',
    title: 'Marketing',
    description: 'Campaign orchestration and analytics',
    color: 'bg-pink-500',
    stats: { active: 6, completed: 4 },
    href: '/marketing',
  },
};

export const Operations: Story = {
  args: {
    id: 'operations',
    icon: '⚙️',
    title: 'Operations',
    description: 'Process automation and optimization',
    color: 'bg-gray-500',
    stats: { active: 10, completed: 7 },
    href: '/operations',
  },
}; 