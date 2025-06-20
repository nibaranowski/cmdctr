// Development Jest setup
// See: https://jestjs.io/docs/configuration#setupfilesafterenv-array

// Import testing utilities
import '@testing-library/jest-dom';

// Set development environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/cmdctr-test-dev';
process.env.STRIPE_SECRET_KEY = 'sk_test_dev_key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_dev_key';

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

// Development test data
global.__DEV_TEST_DATA__ = {
  users: [
    {
      id: 'user-1',
      email: 'dev@example.com',
      name: 'Dev User',
      role: 'admin',
    },
  ],
  companies: [
    {
      id: 'company-1',
      name: 'Dev Company',
      slug: 'dev-company',
      industry: 'Technology',
    },
  ],
};

// Console logging for development tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}); 