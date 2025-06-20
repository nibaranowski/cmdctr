# Quality Gates System

This document outlines the quality gates and promotion requirements for the project.

## Overview

Our quality system ensures that only high-quality, well-tested code reaches production through a series of automated checks and gates.

## Quality Requirements

### Test Coverage Requirements
- **Development**: 100% test coverage required for both backend and frontend
- **Staging**: 100% test coverage required across all environments (Dev + Staging)
- **Production**: 100% test coverage required across all environments (Dev + Staging + Prod)

### Performance Requirements
- **API Endpoints**: P95 response time must be under 300ms
- **Frontend**: First Contentful Paint must be under 1s
- **Load Testing**: Must handle 10 concurrent users with stable response times

### Code Quality Requirements
- All code must pass linting rules
- No critical security vulnerabilities
- Lighthouse score must be above 90
- All new code must include corresponding tests

## Promotion Process

### Development to Staging
1. All tests in Development must pass
2. 100% test coverage required
3. Performance tests must pass
4. Security scan must pass
5. No critical dependencies vulnerabilities

### Staging to Production
1. All tests in Development and Staging must pass
2. 100% test coverage required in both environments
3. E2E tests must pass
4. Performance tests must pass in both environments
5. Security scan must pass
6. Lighthouse score must be above 90

## Automated Checks

The following checks run automatically:

- On every push:
  - Unit tests
  - Integration tests
  - Coverage checks
  - Linting
  - Security scan

- On PR to staging/production:
  - All of the above
  - E2E tests
  - Performance tests
  - Environment-specific tests
  - Promotion requirements verification

## Self-Healing System

The system attempts to auto-fix issues when possible:

1. Code formatting issues are auto-fixed
2. Dependencies are automatically updated (via Dependabot)
3. Performance issues trigger automatic analysis and optimization suggestions

## Commands

```bash
# Run all tests with coverage
npm run test:coverage:all

# Check coverage requirements
npm run check:coverage

# Verify promotion requirements
npm run verify:promotion

# Run performance tests
npm run test:performance

# Run security scan
npm run test:security

# Run E2E tests
npm run test:e2e
```

## CI/CD Pipeline

The CI/CD pipeline enforces these quality gates through GitHub Actions:

1. **Build & Test**
   - Runs on every push
   - Executes all tests
   - Checks coverage
   - Runs linting

2. **Quality Check**
   - Runs on PR
   - Verifies all quality requirements
   - Blocks merge if requirements not met

3. **Performance Check**
   - Runs performance tests
   - Verifies SLA requirements
   - Generates performance report

4. **Security Check**
   - Scans dependencies
   - Runs security tests
   - Blocks on critical vulnerabilities

## Monitoring & Reporting

- Test results are available in the test dashboard
- Coverage reports are generated for each environment
- Performance metrics are tracked over time
- Security scan results are documented
- All quality metrics are visible in PR checks

# Quality Gates & Visual Test Dashboard

## 🚀 **Complete Quality Gate System**

This system ensures **no code moves between environments** without passing all required tests. It provides **visual indicators** and **real-time monitoring** of test status across all environments.

## 🎯 **Quality Gate Overview**

### **Environment Flow**
```
Development → Staging → Production
     ↓           ↓          ↓
  70% Test    80% Test   90% Test
  Coverage    Coverage   Coverage
```

### **Quality Gate Rules**
- **Dev → Staging**: All development tests must pass (70% coverage)
- **Staging → Prod**: All staging tests must pass (80% coverage)
- **Production**: All production tests must pass (90% coverage)

## 🧪 **Test Suites by Environment**

### **Development Environment (70% Coverage)**
- **be-dev**: Backend unit tests (API, models, lib)
- **fe-dev**: Frontend unit tests (components)

### **Staging Environment (80% Coverage)**
- **be-stag**: Backend tests + integration tests
- **fe-stag**: Frontend tests + integration tests

### **Production Environment (90% Coverage)**
- **be-prod**: All backend tests + E2E tests
- **fe-prod**: All frontend tests + E2E tests

## 📊 **Visual Dashboard Features**

### **1. Terminal Dashboard**
```bash
npm run test:dashboard
```

**Features:**
- 🟢/🔴 Color-coded status indicators
- Real-time test execution
- Coverage percentage display
- Quality gate status
- Performance metrics

### **2. Web Dashboard**
```
http://localhost:3000/test-dashboard
```

**Features:**
- Real-time status monitoring
- Auto-refresh capability
- Interactive quality gates
- Coverage visualization
- Historical data

### **3. API Endpoint**
```
GET /api/test-status
```

**Returns:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "results": {
    "be-dev": {
      "status": "GREEN",
      "coverage": {
        "branches": 75,
        "functions": 80,
        "lines": 85,
        "statements": 82
      },
      "duration": 1500,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  },
  "summary": {
    "totalSuites": 6,
    "passedSuites": 6,
    "overallCoverage": 85,
    "qualityGates": {
      "devToStaging": true,
      "stagingToProd": true,
      "productionReady": true
    }
  }
}
```

## 🚦 **Quality Gate Enforcement**

### **GitHub Actions Workflow**
The system automatically enforces quality gates through GitHub Actions:

1. **Pull Request to `develop`**: Runs development tests
2. **Pull Request to `main`**: Runs staging tests (requires dev tests to pass)
3. **Push to `main`**: Runs production tests (requires staging tests to pass)

### **Branch Protection Rules**
Configure these in GitHub repository settings:

```yaml
# Branch: develop
Required status checks:
  - Quality Gate - Development
  - Test Dashboard Report

# Branch: main
Required status checks:
  - Quality Gate - Development
  - Quality Gate - Staging
  - Quality Gate - Production
  - Test Dashboard Report
```

## 🛠️ **Usage Commands**

### **Quick Commands**
```bash
# Run test dashboard
npm run test:dashboard

# Run with auto-refresh
npm run test:dashboard:watch

# Run quality gates
npm run quality-gate:dev
npm run quality-gate:staging
npm run quality-gate:prod

# Run specific test suites
npm run test:dev
npm run test:staging
npm run test:prod
```

### **Individual Test Types**
```bash
# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

## 📈 **Coverage Thresholds**

| Environment | Branches | Functions | Lines | Statements |
|-------------|----------|-----------|-------|------------|
| Development | 70%      | 70%       | 70%   | 70%        |
| Staging     | 80%      | 80%       | 80%   | 80%        |
| Production  | 90%      | 90%       | 90%   | 90%        |

## 🔍 **Monitoring & Alerts**

### **Real-time Monitoring**
- **Web Dashboard**: Auto-refreshes every 30 seconds
- **Terminal Dashboard**: Real-time execution status
- **GitHub Actions**: Automatic status checks

### **Failure Alerts**
- **PR Comments**: Automatic test results in pull requests
- **Status Checks**: Blocked merges when tests fail
- **Email Notifications**: Configure in GitHub settings

### **Performance Tracking**
- Test execution time
- Coverage trends
- Quality gate success rate

## 🎨 **Visual Indicators**

### **Status Colors**
- 🟢 **GREEN**: All tests passed, coverage met
- 🔴 **RED**: Tests failed or coverage below threshold
- ⚠️ **YELLOW**: Warning (approaching threshold)

### **Quality Gate Status**
- ✅ **OPEN**: All tests passed, deployment allowed
- ❌ **BLOCKED**: Tests failed, deployment blocked

### **Coverage Visualization**
- Progress bars showing coverage percentage
- Color-coded based on threshold requirements
- Detailed breakdown (branches, functions, lines, statements)

## 🔧 **Configuration**

### **Test Dashboard Configuration**
```javascript
// scripts/test-dashboard.js
const testSuites = {
  'be-dev': {
    name: 'Backend Dev',
    command: 'npm run test:unit -- --testPathPattern="__tests__/(api|models|lib)"',
    coverageThreshold: 70,
    environment: 'development'
  }
  // ... more suites
};
```

### **Jest Configuration**
```javascript
// jest.config.dev.js
const customJestConfig = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // ... other config
};
```

## 🚀 **Deployment Integration**

### **Automatic Deployment**
When quality gates pass:
- **Staging**: Auto-deploy to staging environment
- **Production**: Auto-deploy to production environment

### **Manual Override**
For emergency deployments:
```bash
# Force deployment (use with caution)
git commit --allow-empty -m "Emergency deployment"
git push origin main
```

## 📊 **Reporting & Analytics**

### **Test Results Storage**
- **File**: `test-results.json`
- **Artifacts**: GitHub Actions artifacts
- **API**: Real-time status endpoint

### **Metrics Tracked**
- Test suite pass/fail rates
- Coverage trends over time
- Quality gate success rates
- Performance metrics

### **Historical Data**
- Test execution history
- Coverage progression
- Quality gate performance

## 🔒 **Security & Best Practices**

### **Environment Variables**
```bash
# Required for test execution
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/test
```

### **Test Data Management**
- Isolated test databases
- Mock external services
- Clean test data after execution

### **Access Control**
- Dashboard access control
- API endpoint security
- GitHub Actions secrets

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Tests Failing**: Check test output and fix failing tests
2. **Coverage Below Threshold**: Add more test coverage
3. **Quality Gate Blocked**: Ensure all tests pass before proceeding
4. **Dashboard Not Loading**: Check API endpoint and file permissions

### **Debug Commands**
```bash
# Run specific test file
npm test -- Button.test.tsx

# Run with verbose output
npm test -- --verbose

# Check coverage for specific file
npm test -- --coverage --collectCoverageFrom="components/Button.tsx"
```

## 📚 **Additional Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Quality Gates Best Practices](https://martinfowler.com/articles/continuousIntegration.html)

---

**Note**: This quality gate system ensures code quality and prevents deployment of broken code. Regular monitoring and maintenance of test suites is essential for long-term project health. 