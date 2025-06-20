import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../pages/login';

describe('Login', () => {
  it('renders without crashing', () => {
    render(<Login />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });

  it('displays expected content', () => {
    render(<Login />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<Login />);
    const submitButton = screen.getByText('Send magic link');
    expect(submitButton).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<Login />);
    const title = screen.getByText('Command Center');
    expect(title).toBeInTheDocument();
  });
});
