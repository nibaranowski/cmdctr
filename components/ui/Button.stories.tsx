import type { Meta, StoryObj } from '@storybook/nextjs-vite';
// import { within, userEvent, expect } from '@storybook/test';

import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern, accessible button component with multiple variants, sizes, and states. Features smooth animations, loading states, and comprehensive keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger', 'success'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
    },
    leftIcon: {
      control: false,
      description: 'Icon to display on the left side of the button',
    },
    rightIcon: {
      control: false,
      description: 'Icon to display on the right side of the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked',
    },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

// Size variants
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LoadingDisabled: Story = {
  args: {
    loading: true,
    disabled: true,
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    children: 'Add Item',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    rightIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    children: 'Create Project',
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Interactive tests
export const Interactive: Story = {
  args: {
    children: 'Click me',
  },
//   play: async ({ canvasElement, args }) => {
//     const canvas = within(canvasElement);
//     const button = canvas.getByRole('button', { name: 'Click me' });
//     
//     // Test click
//     await userEvent.click(button);
//     expect(args.onClick).toHaveBeenCalled();
//     
//     // Test keyboard navigation
//     button.focus();
//     await userEvent.keyboard('{Enter}');
//     expect(args.onClick).toHaveBeenCalledTimes(2);
//     
//     await userEvent.keyboard(' ');
//     expect(args.onClick).toHaveBeenCalledTimes(3);
//   },
};

// Accessibility tests
export const Accessibility: Story = {
  args: {
    children: 'Accessible Button',
    'aria-label': 'Custom accessible label',
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const button = canvas.getByRole('button');
//     
//     // Test focus styles
//     button.focus();
//     expect(button).toHaveClass('focus:ring-2');
//     
//     // Test keyboard navigation
//     await userEvent.keyboard('{Tab}');
//     expect(button).toHaveFocus();
//   },
};

// Edge cases
export const LongText: Story = {
  args: {
    children: 'This is a very long button text that might wrap to multiple lines',
  },
  parameters: {
    layout: 'padded',
  },
};

export const EmptyContent: Story = {
  args: {
    children: '',
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}; 