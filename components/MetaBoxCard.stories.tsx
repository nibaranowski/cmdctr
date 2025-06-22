import type { Meta, StoryObj } from '@storybook/react';
import { BarChartIcon, PersonIcon } from '@radix-ui/react-icons';
import MetaBoxCard from './MetaBoxCard';

const meta: Meta<typeof MetaBoxCard> = {
  title: 'Components/MetaBoxCard',
  component: MetaBoxCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'slate',
      values: [
        { name: 'slate', value: '#f1f5f9' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    stats: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'fundraising',
    icon: BarChartIcon,
    title: 'Fundraising',
    description: 'Investor pipeline and deal tracking',
    stats: { active: 8, completed: 3 },
    href: '/fundraising',
  },
};

export const Hiring: Story = {
  args: {
    id: 'hiring',
    icon: PersonIcon,
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <MetaBoxCard
        id="hiring"
        icon="👥"
        title="Hiring"
        description="AI-powered candidate sourcing and screening"
        color="bg-blue-500"
        stats={{ active: 12, completed: 8 }}
        href="/hiring"
      />
      <MetaBoxCard
        id="selling"
        icon="🛍️"
        title="Selling"
        description="Lead qualification and sales automation"
        color="bg-green-500"
        stats={{ active: 24, completed: 15 }}
        href="/selling"
      />
      <MetaBoxCard
        id="fundraising"
        icon="💰"
        title="Fundraising"
        description="Investor pipeline and deal tracking"
        color="bg-purple-500"
        stats={{ active: 8, completed: 3 }}
        href="/fundraising"
      />
      <MetaBoxCard
        id="product"
        icon="🚀"
        title="Product"
        description="Feature prioritization and roadmap"
        color="bg-orange-500"
        stats={{ active: 18, completed: 12 }}
        href="/product"
      />
      <MetaBoxCard
        id="marketing"
        icon="📢"
        title="Marketing"
        description="Campaign orchestration and analytics"
        color="bg-pink-500"
        stats={{ active: 6, completed: 4 }}
        href="/marketing"
      />
      <MetaBoxCard
        id="operations"
        icon="⚙️"
        title="Operations"
        description="Process automation and optimization"
        color="bg-gray-500"
        stats={{ active: 10, completed: 7 }}
        href="/operations"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Hover state
export const HoverState: Story = {
  args: {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

// Focus state
export const FocusState: Story = {
  args: {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
  parameters: {
    pseudo: { focus: true },
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    id: 'empty',
    icon: '📝',
    title: 'No Activities',
    description: 'Create your first activity to get started',
    color: 'bg-gray-500',
    stats: { active: 0, completed: 0 },
    href: '/create',
  },
};

// High activity state
export const HighActivity: Story = {
  args: {
    id: 'selling',
    icon: '🛍️',
    title: 'Selling',
    description: 'Lead qualification and sales automation',
    color: 'bg-green-500',
    stats: { active: 99, completed: 150 },
    href: '/selling',
  },
};

// Mobile layout
export const MobileLayout: Story = {
  args: {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm mx-auto">
        <Story />
      </div>
    ),
  ],
};

// Tablet layout
export const TabletLayout: Story = {
  args: {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

// Loading state
export const LoadingState: Story = {
  args: {
    id: 'loading',
    icon: '⏳',
    title: 'Loading...',
    description: 'Please wait while we load your data',
    color: 'bg-gray-500',
    stats: { active: 0, completed: 0 },
    href: '#',
  },
  parameters: {
    pseudo: { disabled: true },
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    id: 'error',
    icon: '⚠️',
    title: 'Connection Error',
    description: 'Unable to load data. Please try again.',
    color: 'bg-red-500',
    stats: { active: 0, completed: 0 },
    href: '#',
  },
}; 