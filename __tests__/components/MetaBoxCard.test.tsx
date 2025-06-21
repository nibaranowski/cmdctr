import { render, screen } from '@testing-library/react';
import MetaBoxCard from '../../components/MetaBoxCard';

describe('MetaBoxCard Component', () => {
  const defaultProps = {
    id: 'hiring',
    icon: '👥',
    title: 'Hiring',
    description: 'AI-powered candidate sourcing and screening',
    color: 'bg-blue-500',
    stats: { active: 12, completed: 8 },
    href: '/hiring',
  };

  describe('Rendering', () => {
    it('renders with all required props', () => {
      render(<MetaBoxCard {...defaultProps} />);
      
      expect(screen.getByText('Hiring')).toBeInTheDocument();
      expect(screen.getByText('AI-powered candidate sourcing and screening')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Open Workspace')).toBeInTheDocument();
    });

    it('renders with correct data-testid', () => {
      render(<MetaBoxCard {...defaultProps} />);
      expect(screen.getByTestId('metabox-card')).toBeInTheDocument();
    });

    it('applies correct color classes', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const card = screen.getByTestId('metabox-card');
      expect(card).toHaveClass('bg-white', 'rounded-2xl', 'border-gray-200');
    });

    it('renders accent bar with correct color', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const accentBar = screen.getByTestId('metabox-card').querySelector('.bg-blue-500');
      expect(accentBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label for workspace link', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const link = screen.getByRole('link', { name: /open hiring workspace/i });
      expect(link).toBeInTheDocument();
    });

    it('has proper focus styles', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const link = screen.getByRole('link', { name: /open hiring workspace/i });
      expect(link).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });
  });

  describe('Visual States', () => {
    it('displays stats correctly', () => {
      render(<MetaBoxCard {...defaultProps} />);
      
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('displays icon correctly', () => {
      render(<MetaBoxCard {...defaultProps} />);
      expect(screen.getByText('👥')).toBeInTheDocument();
    });

    it('applies correct typography classes', () => {
      render(<MetaBoxCard {...defaultProps} />);
      
      const title = screen.getByText('Hiring');
      const description = screen.getByText('AI-powered candidate sourcing and screening');
      
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
      expect(description).toHaveClass('text-sm', 'text-gray-600');
    });
  });

  describe('Responsive Design', () => {
    it('has proper responsive classes', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const card = screen.getByTestId('metabox-card');
      
      // Check for responsive design classes
      expect(card).toHaveClass('p-8', 'rounded-2xl');
    });

    it('maintains proper spacing on different screen sizes', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const card = screen.getByTestId('metabox-card');
      
      // Check spacing classes
      expect(card).toHaveClass('p-8');
      expect(card.querySelector('.mb-6')).toBeInTheDocument();
      expect(card.querySelector('.mb-8')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero stats correctly', () => {
      const propsWithZeroStats = {
        ...defaultProps,
        stats: { active: 0, completed: 0 },
      };
      
      render(<MetaBoxCard {...propsWithZeroStats} />);
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements).toHaveLength(2); // Both active and completed
    });

    it('handles large numbers correctly', () => {
      const propsWithLargeStats = {
        ...defaultProps,
        stats: { active: 999, completed: 1500 },
      };
      
      render(<MetaBoxCard {...propsWithLargeStats} />);
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
    });

    it('handles long titles and descriptions', () => {
      const propsWithLongText = {
        ...defaultProps,
        title: 'Very Long Title That Might Overflow',
        description: 'This is a very long description that might cause layout issues if not handled properly',
      };
      
      render(<MetaBoxCard {...propsWithLongText} />);
      expect(screen.getByText('Very Long Title That Might Overflow')).toBeInTheDocument();
      expect(screen.getByText('This is a very long description that might cause layout issues if not handled properly')).toBeInTheDocument();
    });
  });

  describe('Animation and Transitions', () => {
    it('has motion component wrapper', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const card = screen.getByTestId('metabox-card');
      
      // Check for motion component classes
      expect(card).toHaveClass('transition-all', 'duration-200');
    });

    it('has proper hover animations', () => {
      render(<MetaBoxCard {...defaultProps} />);
      const card = screen.getByTestId('metabox-card');
      
      // Check for animation classes
      expect(card).toHaveClass('hover:shadow-lg', 'hover:border-gray-300');
    });
  });
}); 