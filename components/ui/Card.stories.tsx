import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with multiple variants, interactive states, and smooth animations. Perfect for displaying content in organized containers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'The visual style variant of the card',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'The padding size of the card',
    },
    hover: {
      control: 'boolean',
      description: 'Whether the card should have hover effects',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card should be interactive with animations',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the card is in a loading state',
    },
    children: {
      control: 'text',
      description: 'The content to display inside the card',
    },
  },
  args: {
    children: 'Card content',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

// Padding variants
export const NoPadding: Story = {
  args: {
    padding: 'none',
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
  },
};

export const MediumPadding: Story = {
  args: {
    padding: 'md',
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
  },
};

// Interactive states
export const Interactive: Story = {
  args: {
    interactive: true,
  },
};

export const WithHover: Story = {
  args: {
    hover: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

// Complex content examples
export const WithComplexContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
          <span className="text-sm text-gray-500">2 hours ago</span>
        </div>
        <p className="text-gray-600">
          This is a card with more complex content including a title, timestamp, and description.
        </p>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Tag
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Status
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View Details
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Dismiss
          </button>
        </div>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=200&fit=crop"
          alt="Card image"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Image Card</h3>
          <p className="text-gray-600 mt-2">
            This card contains an image along with some descriptive text.
          </p>
        </div>
      </div>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card variant="default">
        <h3 className="font-semibold mb-2">Default</h3>
        <p className="text-sm text-gray-600">Standard card with subtle shadow</p>
      </Card>
      <Card variant="elevated">
        <h3 className="font-semibold mb-2">Elevated</h3>
        <p className="text-sm text-gray-600">Card with enhanced shadow</p>
      </Card>
      <Card variant="outlined">
        <h3 className="font-semibold mb-2">Outlined</h3>
        <p className="text-sm text-gray-600">Card with prominent border</p>
      </Card>
      <Card variant="ghost">
        <h3 className="font-semibold mb-2">Ghost</h3>
        <p className="text-sm text-gray-600">Minimal card without background</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Interactive showcase
export const InteractiveShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card interactive>
        <h3 className="font-semibold mb-2">Interactive</h3>
        <p className="text-sm text-gray-600">Click and hover to see animations</p>
      </Card>
      <Card hover>
        <h3 className="font-semibold mb-2">Hover Effects</h3>
        <p className="text-sm text-gray-600">Hover to see shadow changes</p>
      </Card>
      <Card interactive hover>
        <h3 className="font-semibold mb-2">Combined</h3>
        <p className="text-sm text-gray-600">Both interactive and hover effects</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card loading>
        <h3 className="font-semibold mb-2">Loading Card</h3>
        <p className="text-sm text-gray-600">This content is hidden while loading</p>
      </Card>
      <Card>
        <h3 className="font-semibold mb-2">Normal Card</h3>
        <p className="text-sm text-gray-600">This content is visible</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Edge cases
export const LongContent: Story = {
  args: {
    children: (
      <div>
        <h3 className="font-semibold mb-2">Long Content Card</h3>
        <p className="text-sm text-gray-600">
          This is a very long paragraph that demonstrates how the card handles content that might wrap to multiple lines. 
          The card should maintain its structure and appearance even with longer text content.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Here's another paragraph to make the content even longer and test the card's ability to handle substantial amounts of text.
        </p>
      </div>
    ),
  },
  parameters: {
    layout: 'padded',
  },
};

export const EmptyContent: Story = {
  args: {
    children: null,
  },
  parameters: {
    layout: 'padded',
  },
}; 