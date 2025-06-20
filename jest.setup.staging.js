// Import testing utilities
import '@testing-library/jest-dom';

// Set staging environment
process.env.NODE_ENV = 'test';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
})); 