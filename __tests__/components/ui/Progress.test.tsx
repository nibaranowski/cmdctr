import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from '../../../components/ui/Progress';

describe('Progress', () => {
  const defaultProps = {
    value: 50,
  };

  it('renders with default props', () => {
    render(<Progress {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with label', () => {
    render(<Progress {...defaultProps} label="Upload Progress" />);
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
  });

  it('renders with value display', () => {
    render(<Progress {...defaultProps} showValue />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders with both label and value', () => {
    render(<Progress {...defaultProps} label="Upload Progress" showValue />);
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Progress {...defaultProps} size="sm" />);
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('h-1');

    rerender(<Progress {...defaultProps} size="md" />);
    const container2 = screen.getByRole('progressbar').parentElement;
    expect(container2).toHaveClass('h-2');

    rerender(<Progress {...defaultProps} size="lg" />);
    const container3 = screen.getByRole('progressbar').parentElement;
    expect(container3).toHaveClass('h-3');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Progress {...defaultProps} variant="default" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-primary-500');

    rerender(<Progress {...defaultProps} variant="success" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-success-500');

    rerender(<Progress {...defaultProps} variant="warning" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-warning-500');

    rerender(<Progress {...defaultProps} variant="error" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-error-500');

    rerender(<Progress {...defaultProps} variant="info" />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-info-500');
  });

  it('handles custom max value', () => {
    render(<Progress value={7} max={10} showValue />);
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '7');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  });

  it('clamps value to valid range', () => {
    const { rerender } = render(<Progress value={150} showValue />);
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<Progress value={-10} showValue />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('applies striped class when striped prop is true', () => {
    render(<Progress {...defaultProps} striped />);
    expect(screen.getByRole('progressbar')).toHaveClass('bg-gradient-to-r');
  });

  it('applies animated class when animated prop is true', () => {
    render(<Progress {...defaultProps} animated />);
    expect(screen.getByRole('progressbar')).toHaveClass('animate-pulse');
  });

  it('has proper accessibility attributes', () => {
    render(<Progress {...defaultProps} label="Upload Progress" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Upload Progress');
  });

  it('has proper accessibility attributes without label', () => {
    render(<Progress {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Progress: 50%');
  });

  it('applies custom className', () => {
    render(<Progress {...defaultProps} className="custom-class" />);
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with 0% when value is 0', () => {
    render(<Progress value={0} showValue />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders with 100% when value equals max', () => {
    render(<Progress value={100} showValue />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies base styling classes', () => {
    render(<Progress {...defaultProps} />);
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass(
      'relative',
      'w-full',
      'bg-surface',
      'border',
      'border-border',
      'rounded-full',
      'overflow-hidden'
    );
  });

  it('applies transition classes to progress bar', () => {
    render(<Progress {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('transition-all', 'duration-500', 'ease-out');
  });

  it('handles decimal values correctly', () => {
    render(<Progress value={33.7} showValue />);
    expect(screen.getByText('34%')).toBeInTheDocument(); // Should round to nearest integer
  });

  it('renders without label and value section when not provided', () => {
    render(<Progress {...defaultProps} />);
    // Should not render the label/value container
    expect(screen.queryByText('Upload Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });
}); 