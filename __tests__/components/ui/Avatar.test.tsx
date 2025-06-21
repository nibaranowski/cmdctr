import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Avatar from '../../../components/ui/Avatar';

describe('Avatar', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'User avatar',
  };

  it('renders with image', () => {
    render(<Avatar {...defaultProps} />);
    const img = screen.getByAltText('User avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders with fallback when no src provided', () => {
    render(<Avatar fallback="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders with default icon when no src or fallback provided', () => {
    render(<Avatar />);
    // The User icon should be present
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Avatar size="xs" fallback="XS" />);
    const avatarElement = screen.getByText('XS').closest('div');
    expect(avatarElement).toHaveClass('w-6', 'h-6');

    rerender(<Avatar size="sm" fallback="SM" />);
    const avatarElement2 = screen.getByText('SM').closest('div');
    expect(avatarElement2).toHaveClass('w-8', 'h-8');

    rerender(<Avatar size="md" fallback="MD" />);
    const avatarElement3 = screen.getByText('MD').closest('div');
    expect(avatarElement3).toHaveClass('w-10', 'h-10');

    rerender(<Avatar size="lg" fallback="LG" />);
    const avatarElement4 = screen.getByText('LG').closest('div');
    expect(avatarElement4).toHaveClass('w-12', 'h-12');

    rerender(<Avatar size="xl" fallback="XL" />);
    const avatarElement5 = screen.getByText('XL').closest('div');
    expect(avatarElement5).toHaveClass('w-16', 'h-16');

    rerender(<Avatar size="2xl" fallback="2XL" />);
    const avatarElement6 = screen.getByText('2XL').closest('div');
    expect(avatarElement6).toHaveClass('w-20', 'h-20');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Avatar variant="default" fallback="A" />);
    const avatarElement = screen.getByText('A').closest('div');
    expect(avatarElement).toHaveClass('rounded-full');

    rerender(<Avatar variant="rounded" fallback="B" />);
    const avatarElement2 = screen.getByText('B').closest('div');
    expect(avatarElement2).toHaveClass('rounded-lg');

    rerender(<Avatar variant="square" fallback="C" />);
    const avatarElement3 = screen.getByText('C').closest('div');
    expect(avatarElement3).toHaveClass('rounded-md');
  });

  it('renders status indicator', () => {
    render(<Avatar status="online" fallback="O" />);
    const statusIndicator = document.querySelector('[aria-label="Status: online"]');
    expect(statusIndicator).toBeInTheDocument();
    expect(statusIndicator).toHaveClass('bg-success-500');
  });

  it('applies correct status colors', () => {
    const { rerender } = render(<Avatar status="online" fallback="O" />);
    expect(document.querySelector('[aria-label="Status: online"]')).toHaveClass('bg-success-500');

    rerender(<Avatar status="offline" fallback="O" />);
    expect(document.querySelector('[aria-label="Status: offline"]')).toHaveClass('bg-gray-400');

    rerender(<Avatar status="away" fallback="A" />);
    expect(document.querySelector('[aria-label="Status: away"]')).toHaveClass('bg-warning-500');

    rerender(<Avatar status="busy" fallback="B" />);
    expect(document.querySelector('[aria-label="Status: busy"]')).toHaveClass('bg-error-500');
  });

  it('applies correct status sizes', () => {
    const { rerender } = render(<Avatar size="xs" status="online" fallback="O" />);
    expect(document.querySelector('[aria-label="Status: online"]')).toHaveClass('w-1.5', 'h-1.5');

    rerender(<Avatar size="lg" status="online" fallback="O" />);
    expect(document.querySelector('[aria-label="Status: online"]')).toHaveClass('w-3', 'h-3');
  });

  it('handles image load error gracefully', () => {
    render(<Avatar src="https://invalid-url.com/image.jpg" fallback="JD" />);
    const img = screen.getByAltText('Avatar');
    
    // Simulate image load error
    fireEvent.error(img);
    
    // Should show fallback after error
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('handles image load success', () => {
    render(<Avatar {...defaultProps} />);
    const img = screen.getByAltText('User avatar');
    
    // Initially should have opacity-0
    expect(img).toHaveClass('opacity-0');
    
    // Simulate image load success
    fireEvent.load(img);
    
    // Should have opacity-100 after load
    expect(img).toHaveClass('opacity-100');
  });

  it('renders custom fallback content', () => {
    const customFallback = (
      <div data-testid="custom-fallback">
        <span>Custom</span>
      </div>
    );
    render(<Avatar fallback={customFallback} />);
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar className="custom-class" fallback="JD" />);
    const avatarElement = screen.getByText('JD').closest('div');
    expect(avatarElement).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Avatar ref={ref} fallback="JD" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Avatar onClick={handleClick} fallback="JD" />);
    const avatarElement = screen.getByText('JD').closest('div');
    await user.click(avatarElement!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders children when provided', () => {
    render(
      <Avatar>
        <div data-testid="avatar-child">Child content</div>
      </Avatar>
    );
    expect(screen.getByTestId('avatar-child')).toBeInTheDocument();
  });

  it('prioritizes children over src and fallback', () => {
    render(
      <Avatar src="https://example.com/avatar.jpg" fallback="JD">
        <div data-testid="avatar-child">Child content</div>
      </Avatar>
    );
    expect(screen.getByTestId('avatar-child')).toBeInTheDocument();
    expect(screen.queryByAltText('User avatar')).not.toBeInTheDocument();
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Avatar status="online" fallback="JD" />);
    const statusIndicator = document.querySelector('[aria-label="Status: online"]');
    expect(statusIndicator).toHaveAttribute('aria-label', 'Status: online');
  });

  it('applies transition classes', () => {
    render(<Avatar fallback="JD" />);
    const avatarElement = screen.getByText('JD').closest('div');
    expect(avatarElement).toHaveClass('transition-all', 'duration-200');
  });

  it('applies base styling classes', () => {
    render(<Avatar fallback="JD" />);
    const avatar = screen.getByText('JD').closest('div');
    expect(avatar).toHaveClass(
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'bg-surface',
      'border',
      'border-border',
      'overflow-hidden'
    );
  });
}); 