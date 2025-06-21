import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile avatar component with image support, fallbacks, and status indicators.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'rounded', 'square'],
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'User avatar',
  },
};

export const WithFallback: Story = {
  args: {
    fallback: 'JD',
  },
};

export const WithStatus: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" fallback="XS" />
      <Avatar size="sm" fallback="SM" />
      <Avatar size="md" fallback="MD" />
      <Avatar size="lg" fallback="LG" />
      <Avatar size="xl" fallback="XL" />
      <Avatar size="2xl" fallback="2XL" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="default" fallback="A" />
      <Avatar variant="rounded" fallback="B" />
      <Avatar variant="square" fallback="C" />
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar status="online" fallback="O" />
      <Avatar status="offline" fallback="O" />
      <Avatar status="away" fallback="A" />
      <Avatar status="busy" fallback="B" />
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture',
    size: 'lg',
  },
};

export const LoadingState: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail.com/image.jpg',
    fallback: 'JD',
    size: 'lg',
  },
};

export const CustomFallback: Story = {
  args: {
    fallback: (
      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
        JD
      </div>
    ),
    size: 'lg',
  },
};

export const Interactive: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    className: 'cursor-pointer hover:scale-105 transition-transform',
    onClick: () => alert('Avatar clicked!'),
  },
}; 