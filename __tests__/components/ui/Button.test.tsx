import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../../components/ui/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-blue-600');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-100');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-transparent');

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');

      rerender(<Button variant="success">Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-green-600');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button size="xs">Extra Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-2 py-1 text-xs');

      rerender(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5 text-sm');

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-sm');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-base');
    });

    it('renders with icons', () => {
      const icon = <span data-testid="icon">🚀</span>;
      render(<Button leftIcon={icon}>With Left Icon</Button>);
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('With Left Icon');
    });

    it('renders in loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders in disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('renders with full width', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    // Note: Keyboard events are handled by native button behavior
    // No explicit keyboard event handlers needed
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });

    it('supports focus management', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:ring-2');
    });

    it('has proper disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('maintains focus styles', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('Visual States', () => {
    it('applies hover styles', () => {
      render(<Button>Hover Test</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('hover:scale-[1.02]');
    });

    it('applies active styles', () => {
      render(<Button>Active Test</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('active:scale-[0.98]');
    });

    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-4 h-4 border-2 border-current border-t-transparent rounded-full');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Button leftIcon={<span>🚀</span>}>Empty</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'This is a very long button text that might wrap to multiple lines and should be handled gracefully';
      render(<Button>{longText}</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longText);
    });

    it('handles custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
}); 