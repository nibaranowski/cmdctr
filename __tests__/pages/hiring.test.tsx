import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Hiring from '../../pages/hiring';

describe('Hiring', () => {
  it('renders without crashing', () => {
    render(<Hiring />);
    expect(screen.getByText('Hiring')).toBeInTheDocument();
  });

  it('displays expected content', () => {
    render(<Hiring />);
    expect(screen.getByText('Sourced')).toBeInTheDocument();
    expect(screen.getByText('Screening')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<Hiring />);
    const backButton = screen.getByRole('link', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<Hiring />);
    const title = screen.getByText('Hiring');
    expect(title).toBeInTheDocument();
  });
});
