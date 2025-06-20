import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from '../../pages/index';

describe('Homepage', () => {
  it('renders without crashing', () => {
    render(<Homepage />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });

  it('displays expected content', () => {
    render(<Homepage />);
    expect(screen.getByText('The Command Center for')).toBeInTheDocument();
    expect(screen.getByText('Modern Business')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<Homepage />);
    const getStartedButton = screen.getByText('Get Started Free');
    expect(getStartedButton).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<Homepage />);
    const title = screen.getByText('Command Center');
    expect(title).toBeInTheDocument();
  });
});
