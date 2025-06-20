import { render, screen } from '@testing-library/react';
import Badge from '../../../components/ui/Badge';

describe('Badge Component', () => {
  const defaultProps = {
    children: 'Badge text',
  };

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Badge {...defaultProps} />);
      expect(screen.getByText('Badge text')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Badge {...defaultProps} className="custom-class" />);
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass('custom-class');
    });

    it('renders all variants correctly', () => {
      const { rerender } = render(<Badge {...defaultProps} variant="default" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-gray-100', 'text-gray-800');

      rerender(<Badge {...defaultProps} variant="primary" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-blue-100', 'text-blue-800');

      rerender(<Badge {...defaultProps} variant="success" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-green-100', 'text-green-800');

      rerender(<Badge {...defaultProps} variant="warning" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-yellow-100', 'text-yellow-800');

      rerender(<Badge {...defaultProps} variant="danger" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-red-100', 'text-red-800');

      rerender(<Badge {...defaultProps} variant="info" />);
      expect(screen.getByText('Badge text')).toHaveClass('bg-cyan-100', 'text-cyan-800');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Badge {...defaultProps} size="sm" />);
      expect(screen.getByText('Badge text')).toHaveClass('px-2', 'py-0.5', 'text-xs');

      rerender(<Badge {...defaultProps} size="md" />);
      expect(screen.getByText('Badge text')).toHaveClass('px-2.5', 'py-1', 'text-sm');

      rerender(<Badge {...defaultProps} size="lg" />);
      expect(screen.getByText('Badge text')).toHaveClass('px-3', 'py-1.5', 'text-base');
    });
  });

  describe('Dot Indicator', () => {
    it('shows dot when dot prop is true', () => {
      render(<Badge {...defaultProps} dot />);
      const dot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dot).toBeInTheDocument();
    });

    it('applies correct dot color for each variant', () => {
      const { rerender } = render(<Badge {...defaultProps} dot variant="default" />);
      const dot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dot).toHaveClass('bg-gray-400');

      rerender(<Badge {...defaultProps} dot variant="primary" />);
      const primaryDot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(primaryDot).toHaveClass('bg-blue-500');

      rerender(<Badge {...defaultProps} dot variant="success" />);
      const successDot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(successDot).toHaveClass('bg-green-500');

      rerender(<Badge {...defaultProps} dot variant="warning" />);
      const warningDot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(warningDot).toHaveClass('bg-yellow-500');

      rerender(<Badge {...defaultProps} dot variant="danger" />);
      const dangerDot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dangerDot).toHaveClass('bg-red-500');

      rerender(<Badge {...defaultProps} dot variant="info" />);
      const infoDot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(infoDot).toHaveClass('bg-cyan-500');
    });

    it('does not show dot when dot prop is false', () => {
      render(<Badge {...defaultProps} dot={false} />);
      const dot = screen.getByText('Badge text').querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dot).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<Badge {...defaultProps} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies proper semantic structure', () => {
      render(<Badge {...defaultProps} />);
      const badge = screen.getByText('Badge text');
      expect(badge.tagName).toBe('SPAN');
    });

    it('supports custom attributes', () => {
      render(<Badge {...defaultProps} data-testid="custom-badge" />);
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('applies hover styles', () => {
      render(<Badge {...defaultProps} />);
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass('hover:bg-gray-200');
    });

    it('applies transition classes', () => {
      render(<Badge {...defaultProps} />);
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass('transition-colors', 'duration-200');
    });

    it('applies proper flex layout', () => {
      render(<Badge {...defaultProps} />);
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass('inline-flex', 'items-center');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content gracefully', () => {
      render(<Badge>{''}</Badge>);
      const badge = screen.getByRole('generic');
      expect(badge).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'This is a very long badge text that might wrap to multiple lines';
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      const specialText = 'Badge with special chars: !@#$%^&*()';
      render(<Badge>{specialText}</Badge>);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('combines variant, size, and dot correctly', () => {
      render(
        <Badge 
          {...defaultProps} 
          variant="success" 
          size="lg" 
          dot 
        />
      );
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass(
        'bg-green-100',
        'text-green-800',
        'px-3',
        'py-1.5',
        'text-base'
      );
      
      const dot = badge.querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dot).toHaveClass('bg-green-500');
    });

    it('combines custom className with variant styles', () => {
      render(
        <Badge 
          {...defaultProps} 
          variant="primary" 
          className="custom-badge" 
        />
      );
      const badge = screen.getByText('Badge text');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'custom-badge');
    });
  });
}); 