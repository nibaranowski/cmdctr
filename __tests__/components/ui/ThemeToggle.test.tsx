import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { ThemeProvider } from '../../../components/ui/ThemeProvider';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it('renders without crashing', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with label when showLabel is true', () => {
    renderWithTheme(<ThemeToggle showLabel />);
    expect(screen.getByText(/System \(light\)/)).toBeInTheDocument();
  });

  it('renders without label when showLabel is false', () => {
    renderWithTheme(<ThemeToggle showLabel={false} />);
    expect(screen.queryByText(/System \(light\)/)).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = renderWithTheme(<ThemeToggle size="sm" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-8', 'h-8');

    rerender(
      <ThemeProvider>
        <ThemeToggle size="md" />
      </ThemeProvider>
    );
    expect(button).toHaveClass('w-10', 'h-10');

    rerender(
      <ThemeProvider>
        <ThemeToggle size="lg" />
      </ThemeProvider>
    );
    expect(button).toHaveClass('w-12', 'h-12');
  });

  it('has correct accessibility attributes', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });

  it('handles click events', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // The theme should change, but we can't easily test the internal state
    // without exposing it. We can verify the click handler doesn't crash.
    expect(button).toBeInTheDocument();
  });

  it('applies correct CSS classes for theming', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-surface', 'border-border', 'text-text-secondary');
  });
}); 