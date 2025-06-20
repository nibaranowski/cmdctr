# Testing Documentation

## 🧪 **Complete Testing Infrastructure**

This project has a comprehensive testing setup covering **frontend**, **backend**, and **full-stack** testing across **development**, **staging**, and **production** environments.

## 📋 **Test Types**

### **1. Unit Tests**
- **Location**: `__tests__/` and `components/__tests__/`
- **Purpose**: Test individual functions, components, and utilities
- **Coverage**: 90% threshold in production
- **Run**: `npm run test:unit`

**Examples:**
- Component tests (`Button.test.tsx`)
- Model validation tests (`User.test.ts`)
- Utility function tests (`mongodb.test.ts`)

### **2. Integration Tests**
- **Location**: `__tests__/integration/`
- **Purpose**: Test API endpoints and service interactions
- **Coverage**: 80% threshold in staging
- **Run**: `npm run test:integration`

**Examples:**
- API endpoint tests (`api.test.ts`)
- Database integration tests
- External service integration tests

### **3. End-to-End Tests**
- **Location**: `__tests__/e2e/`
- **Purpose**: Test complete user workflows
- **Coverage**: 70% threshold in development
- **Run**: `npm run test:e2e`

**Examples:**
- Homepage rendering tests (`homepage.test.ts`)
- User journey tests
- Performance tests

## 🌍 **Environment-Specific Testing**

### **Development Environment**
```bash
npm run test:dev
```
- **Coverage Threshold**: 70%
- **Test Types**: Unit tests only
- **Speed**: Fast execution (50% workers)
- **Setup**: `jest.config.dev.js`

### **Staging Environment**
```bash
npm run test:staging
```
- **Coverage Threshold**: 80%
- **Test Types**: Unit + Integration tests
- **Speed**: Balanced execution (25% workers)
- **Setup**: `jest.config.staging.js`

### **Production Environment**
```bash
npm run test:prod
```
- **Coverage Threshold**: 90%
- **Test Types**: All test types (Unit + Integration + E2E)
- **Speed**: Thorough execution (25% workers)
- **Setup**: `jest.config.prod.js`

## 🏗️ **Test Structure**

```
__tests__/
├── api/                    # API endpoint tests
│   └── agents/
│       └── scout.test.ts
├── models/                 # Data model tests
│   ├── User.test.ts
│   └── Company.test.ts
├── lib/                    # Utility function tests
│   └── mongodb.test.ts
├── integration/            # Integration tests
│   └── api.test.ts
└── e2e/                    # End-to-end tests
    └── homepage.test.ts

components/
└── __tests__/              # Component tests
    └── Button.test.tsx
```

## 🚀 **Running Tests**

### **Quick Commands**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run environment-specific tests
npm run test:dev
npm run test:staging
npm run test:prod
```

### **CI/CD Integration**
```bash
# Run tests in CI environment
npm run test:ci

# Check coverage threshold
npm run check-coverage
```

## 📊 **Coverage Requirements**

### **Coverage Thresholds by Environment**

| Environment | Branches | Functions | Lines | Statements |
|-------------|----------|-----------|-------|------------|
| Development | 70%      | 70%       | 70%   | 70%        |
| Staging     | 80%      | 80%       | 80%   | 80%        |
| Production  | 90%      | 90%       | 90%   | 90%        |

### **Coverage Reports**
- **Text**: Console output
- **LCOV**: For CI/CD integration
- **HTML**: Detailed browser report

## 🔧 **Test Configuration**

### **Jest Configuration Files**
- `jest.config.js` - Base configuration
- `jest.config.dev.js` - Development environment
- `jest.config.staging.js` - Staging environment
- `jest.config.prod.js` - Production environment

### **Setup Files**
- `jest.setup.js` - Base setup
- `jest.setup.dev.js` - Development setup
- `jest.setup.staging.js` - Staging setup
- `jest.setup.prod.js` - Production setup

## 🎯 **Testing Best Practices**

### **1. Test Organization**
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### **2. Mocking Strategy**
- Mock external services (Stripe, Clerk, PostHog)
- Use `node-mocks-http` for API testing
- Mock database connections in unit tests

### **3. Test Data Management**
- Use factory functions for test data
- Clean up test data after each test
- Use environment-specific test data

### **4. Performance Testing**
- Set reasonable timeouts
- Test loading times
- Monitor memory usage

## 🔍 **Debugging Tests**

### **Common Issues**
1. **TypeScript Errors**: Ensure `@types/jest` is installed
2. **Module Resolution**: Check Jest module mapping
3. **Environment Variables**: Verify test setup files
4. **Async Tests**: Use proper async/await patterns

### **Debug Commands**
```bash
# Run specific test file
npm test -- Button.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage for specific file
npm test -- --coverage --collectCoverageFrom="components/Button.tsx"
```

## 📈 **Continuous Integration**

### **GitHub Actions Workflow**
The CI pipeline includes:
1. **Linting**: ESLint checks
2. **Type Checking**: TypeScript validation
3. **Unit Tests**: Fast unit test execution
4. **Integration Tests**: API and service tests
5. **Coverage Check**: Verify coverage thresholds
6. **Security Scan**: Vulnerability assessment

### **Branch Protection**
- Require passing tests before merge
- Enforce coverage thresholds
- Require code review
- Block force pushes

## 🛠️ **Adding New Tests**

### **Component Tests**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### **API Tests**
```typescript
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/endpoint';

describe('/api/endpoint', () => {
  it('should handle requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { data: 'test' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

### **Integration Tests**
```typescript
import request from 'supertest';
import { createServer } from 'http';

describe('Integration Tests', () => {
  it('should test full workflow', async () => {
    const response = await request(server)
      .post('/api/endpoint')
      .send({ data: 'test' })
      .expect(200);
  });
});
```

## 📚 **Additional Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)

---

**Note**: This testing infrastructure ensures code quality, prevents regressions, and maintains high standards across all environments. Regular test maintenance and updates are essential for long-term project health. 