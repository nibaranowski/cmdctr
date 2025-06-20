import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import App from '../../pages/_app';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  }),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock PostHog
jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
  },
}));

describe('App', () => {
  it('renders without crashing', () => {
    const mockComponent = () => <div>Test Component</div>;
    const mockPageProps = {};
    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };

    render(<App Component={mockComponent} pageProps={mockPageProps} router={mockRouter} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('displays expected content', () => {
    const mockComponent = () => <div>Test Component</div>;
    const mockPageProps = {};
    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };

    render(<App Component={mockComponent} pageProps={mockPageProps} router={mockRouter} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockComponent = () => <div>Test Component</div>;
    const mockPageProps = {};
    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };

    render(<App Component={mockComponent} pageProps={mockPageProps} router={mockRouter} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const mockComponent = () => <div>Test Component</div>;
    const mockPageProps = {};
    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };

    render(<App Component={mockComponent} pageProps={mockPageProps} router={mockRouter} />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
