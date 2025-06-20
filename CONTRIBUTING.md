# Contributing Guide

This project uses a fully automated, quality-first CI/CD system designed for maximum efficiency and reliability. Here's how it works:

## Development Workflow

### 1. Making Changes

```bash
git checkout main
git pull
git checkout -b feature/your-feature
# Make your changes
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

The system will automatically:
- Run all tests
- Check code coverage
- Perform performance tests
- Auto-fix any issues it can

### 2. Automated Quality Gates

For every code change:

- **Testing & Coverage**
  - All tests (unit, integration, E2E) are run automatically
  - 100% test coverage is required
  - Missing tests are auto-generated
  - Failed tests trigger automatic fix attempts

- **Code Quality**
  - Linting runs automatically
  - Style issues are auto-fixed
  - Performance tests ensure fast response times
  - Security scans check for vulnerabilities

### 3. Automated Promotion

The system automatically promotes code through environments:

1. **Development → Staging**
   - Triggers when all tests pass
   - 100% coverage achieved
   - Performance requirements met

2. **Staging → Production**
   - Requires all staging tests to pass
   - Must maintain 100% coverage
   - No performance regressions

## Quality Requirements

- **Test Coverage**: 100% for all code
- **API Performance**: P95 < 300ms
- **Frontend Performance**: First paint < 1s
- **Test Types Required**:
  - Unit tests
  - Integration tests
  - E2E tests
  - Performance tests

## Monitoring & Dashboards

- **Test Dashboard**: `/test-dashboard`
  - Real-time test status
  - Coverage metrics
  - Performance graphs

## Required Tokens & Setup

1. **GitHub Actions**
   - No setup needed, works out of the box

2. **Cursor Agent** (for auto-fixing)
   ```bash
   # Add your Cursor token to GitHub secrets
   CURSOR_TOKEN=your-token-here
   ```

3. **Performance Monitoring**
   - Automatically set up
   - No additional configuration needed

## Best Practices

1. **Small, Focused Changes**
   - Make small, atomic commits
   - Each change should be testable
   - Include tests with your changes

2. **Let Automation Work**
   - Don't bypass quality checks
   - Allow auto-fixes to run
   - Review generated tests

3. **Monitor the Dashboard**
   - Watch the test dashboard
   - Check performance metrics
   - Review coverage reports

## Troubleshooting

If the automated system blocks a promotion:

1. Check the test dashboard for failures
2. Review the GitHub Actions logs
3. Look for auto-fix attempts and their results
4. Fix any remaining issues locally

## Questions & Support

- Check the test dashboard first
- Review GitHub Actions logs
- File an issue if needed 