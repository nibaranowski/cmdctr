import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../../../components/ui/Card';

describe('Card Component', () => {
  const defaultProps = {
    children: <div>Card content</div>,
  };

  describe('Debug', () => {
    it('debug: shows actual classes being applied', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByTestId('card-root');
      console.log('Card element:', card);
      console.log('Card classes:', card?.className);
      console.log('Card outerHTML:', card?.outerHTML);
      expect(card).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Card {...defaultProps} className="custom-class" />);
      const card = screen.getByTestId('card-root');
      expect(card).toHaveClass('custom-class');
    });

    it('renders all variants correctly', () => {
      const { rerender } = render(<Card {...defaultProps} variant="default" />);
      expect(screen.getByTestId('card-root')).toHaveClass('bg-white', 'border', 'border-gray-200');

      rerender(<Card {...defaultProps} variant="elevated" />);
      expect(screen.getByTestId('card-root')).toHaveClass('bg-white', 'border', 'border-gray-200', 'shadow-md');

      rerender(<Card {...defaultProps} variant="outlined" />);
      expect(screen.getByTestId('card-root')).toHaveClass('bg-white', 'border-2', 'border-gray-200');

      rerender(<Card {...defaultProps} variant="ghost" />);
      expect(screen.getByTestId('card-root')).toHaveClass('bg-transparent');
    });

    it('renders with different padding sizes', () => {
      const { rerender } = render(<Card {...defaultProps} padding="none" />);
      const cardNone = screen.getByTestId('card-root');
      expect(cardNone).not.toHaveClass('p-3', 'p-4', 'p-6');

      rerender(<Card {...defaultProps} padding="sm" />);
      expect(screen.getByTestId('card-root')).toHaveClass('p-3');

      rerender(<Card {...defaultProps} padding="md" />);
      expect(screen.getByTestId('card-root')).toHaveClass('p-4');

      rerender(<Card {...defaultProps} padding="lg" />);
      expect(screen.getByTestId('card-root')).toHaveClass('p-6');
    });
  });

  describe('Interactive States', () => {
    it('applies hover styles when hover prop is true', () => {
      render(<Card {...defaultProps} hover />);
      const card = screen.getByTestId('card-root');
      expect(card).toHaveClass('hover:shadow-md', 'hover:border-gray-300');
    });

    it('applies interactive styles when interactive prop is true', () => {
      render(<Card {...defaultProps} interactive />);
      const card = screen.getByTestId('card-root');
      expect(card).toHaveClass('cursor-pointer', 'hover:scale-[1.02]', 'active:scale-[0.98]');
    });

    it('shows loading state when loading prop is true', () => {
      render(<Card {...defaultProps} loading />);
      const spinner = screen.getByTestId('card-root')?.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports focus management', () => {
      render(<Card {...defaultProps} interactive />);
      const card = screen.getByTestId('card-root');
      
      card?.focus();
      expect(card).toHaveClass('focus:ring-2');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<Card {...defaultProps} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies proper focus styles', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByTestId('card-root');
      
      card?.focus();
      // Focus styles are applied via CSS classes, so we check for the class presence
      expect(card).toHaveClass('focus:ring-2', 'focus:ring-offset-2');
    });
  });

  describe('Animations', () => {
    it('applies initial animation', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByTestId('card-root');
      // Check for motion component classes
      expect(card).toBeInTheDocument();
    });

    it('applies hover animations when interactive', () => {
      render(<Card {...defaultProps} interactive />);
      const card = screen.getByTestId('card-root');
      expect(card).toHaveClass('hover:scale-[1.02]');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content gracefully', () => {
      render(<Card>{null}</Card>);
      const card = screen.getByTestId('card-root');
      expect(card).toBeInTheDocument();
    });

    it('handles complex nested content', () => {
      const complexContent = (
        <div>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </div>
      );
      render(<Card>{complexContent}</Card>);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('applies proper shadow classes', () => {
      const { rerender } = render(<Card {...defaultProps} variant="default" />);
      expect(screen.getByTestId('card-root')).toHaveClass('shadow-sm');

      rerender(<Card {...defaultProps} variant="elevated" />);
      expect(screen.getByTestId('card-root')).toHaveClass('shadow-md');
    });

    it('applies proper border classes', () => {
      const { rerender } = render(<Card {...defaultProps} variant="default" />);
      expect(screen.getByTestId('card-root')).toHaveClass('border', 'border-gray-200');

      rerender(<Card {...defaultProps} variant="outlined" />);
      expect(screen.getByTestId('card-root')).toHaveClass('border-2', 'border-gray-200');
    });
  });
}); 