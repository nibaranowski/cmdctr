# Auto-Heal System Documentation

## Overview

The Auto-Heal system is a comprehensive self-healing mechanism that automatically detects and fixes common issues in your codebase. It runs before every push to ensure code quality and prevent deployment failures.

## Features

### 🔧 Automatic Issue Detection
- **Test Failures**: Detects and fixes failing tests
- **Coverage Gaps**: Identifies uncovered code and generates tests
- **Linting Issues**: Auto-fixes ESLint violations
- **Type Errors**: Resolves TypeScript type issues
- **Missing Imports**: Adds required imports automatically

### 🎯 Pattern-Based Fixes
The system uses intelligent pattern matching to apply fixes:

#### Test Patterns
- Missing test files → Creates test templates
- Failing assertions → Generates correct expectations
- Uncovered functions → Adds function tests

#### TypeScript Patterns
- Implicit any types → Adds type annotations
- Missing modules → Adds import statements
- Unused variables → Removes unused declarations

#### ESLint Patterns
- Missing semicolons → Adds semicolons
- Unused imports → Removes unused imports
- Let vs const → Converts let to const where appropriate

#### Coverage Patterns
- Uncovered functions → Generates function tests
- Uncovered branches → Adds branch test cases

## Usage

### Manual Execution
```bash
# Run auto-heal manually
npm run auto-heal

# Run in watch mode (for development)
npm run auto-heal:watch
```

### Automatic Execution
The system runs automatically:
- **Before every push** (via Git hooks)
- **In CI/CD pipeline** (via GitHub Actions)
- **On test failures** (via quality gates)

### Pre-push Hook
The system is integrated with Husky to run before every push:
```bash
# The hook runs automatically
git push origin main
```

## Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "auto-heal": "node scripts/auto-heal.js",
    "auto-heal:watch": "nodemon scripts/auto-heal.js",
    "pre-push": "npm run auto-heal"
  }
}
```

### Environment Variables
```bash
# Required for GitHub integration
GITHUB_TOKEN=your_github_token

# Optional: Customize behavior
AUTO_HEAL_MAX_ATTEMPTS=3
AUTO_HEAL_VERBOSE=true
```

## How It Works

### 1. Diagnostics Phase
```javascript
// Runs all quality checks
- npm test (detects test failures)
- npm run test:coverage (finds coverage gaps)
- npm run lint (identifies lint issues)
- npx tsc --noEmit (finds type errors)
```

### 2. Pattern Analysis
```javascript
// Analyzes error patterns
const patterns = {
  test: { 'missing test file': { pattern: /regex/, fix: function } },
  typescript: { 'implicit any': { pattern: /regex/, fix: function } },
  eslint: { 'missing semicolon': { pattern: /regex/, fix: function } }
};
```

### 3. Fix Application
```javascript
// Applies fixes based on patterns
for (const issue of issues) {
  const fixes = await patternFixer.applyPatternFixes(issue.errorOutput, issue.type);
  await patternFixer.applyFixesToFile(issue.file, fixes);
}
```

### 4. Verification
```javascript
// Re-runs all checks to verify fixes
await execAsync('npm run test:coverage:all');
await execAsync('npm run lint');
await execAsync('npx tsc --noEmit');
```

## Fix Examples

### Test Fixes
**Before:**
```javascript
// Missing test file
import Button from './Button';
// No test file exists
```

**After:**
```javascript
// Auto-generated test file
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  test('renders without crashing', () => {
    render(<Button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### TypeScript Fixes
**Before:**
```typescript
function processData(data) { // implicit any
  return data.length;
}
```

**After:**
```typescript
function processData(data: any[]) { // explicit type
  return data.length;
}
```

### ESLint Fixes
**Before:**
```javascript
let count = 0 // missing semicolon
count = count + 1
```

**After:**
```javascript
const count = 0; // added semicolon, changed to const
count = count + 1;
```

## Integration with CI/CD

### GitHub Actions Integration
```yaml
# .github/workflows/quality-gates.yml
- name: Auto-heal
  run: npm run auto-heal
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Quality Gates Integration
```javascript
// scripts/ci-automation.js
const autoHeal = require('./auto-heal');
await autoHeal.analyzeAndFix();
```

## Monitoring and Logging

### Console Output
```
🔍 Starting auto-heal analysis...
Found 3 issues to fix...

🔧 Applying pattern-based fixes...
✅ Applied 2 pattern fixes for typescript
✅ Applied 1 pattern fixes for test

🔧 Attempting to fix: test in __tests__/Button.test.tsx
✅ Generated test fixes for __tests__/Button.test.tsx

🧪 Verifying fixes...
✅ All fixes verified successfully!

✨ Auto-healing complete! All issues fixed.
```

### Error Handling
- **Graceful degradation**: Continues even if some fixes fail
- **Retry mechanism**: Attempts fixes up to 3 times
- **Detailed logging**: Shows exactly what was fixed
- **Manual fallback**: Exits with error code for manual intervention

## Best Practices

### 1. Regular Maintenance
- Run auto-heal regularly during development
- Monitor the fixes it applies
- Review generated tests for accuracy

### 2. Customization
- Add custom patterns for your codebase
- Extend fix functions for specific needs
- Configure environment-specific behavior

### 3. Quality Assurance
- Always review auto-generated code
- Ensure tests are meaningful, not just passing
- Maintain high coverage standards

### 4. Team Integration
- Share auto-heal patterns across team
- Document custom fixes
- Use consistent coding standards

## Troubleshooting

### Common Issues

#### Fixes Not Applied
```bash
# Check if files are writable
ls -la scripts/auto-heal.js

# Verify permissions
chmod +x scripts/auto-heal.js
```

#### Pattern Not Matching
```bash
# Enable verbose logging
AUTO_HEAL_VERBOSE=true npm run auto-heal

# Check pattern regex
node -e "console.log(/your-pattern/.test('test string'))"
```

#### Git Hook Not Running
```bash
# Reinstall husky
npm run prepare

# Check hook permissions
ls -la .husky/pre-push
chmod +x .husky/pre-push
```

### Debug Mode
```bash
# Run with debug information
DEBUG=auto-heal npm run auto-heal

# Check specific fix type
npm run auto-heal -- --type=test
```

## Future Enhancements

### Planned Features
- **AI-powered fixes**: Use GPT for more intelligent fixes
- **Custom patterns**: Allow team-specific patterns
- **Fix history**: Track what was auto-fixed
- **Performance optimization**: Parallel fix application
- **Integration plugins**: Support for more tools

### Contributing
To add new patterns or fix functions:
1. Edit `scripts/auto-fix-patterns.js`
2. Add your pattern to the appropriate category
3. Implement the fix function
4. Test with various scenarios
5. Update documentation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console output for clues
3. Enable verbose logging for more details
4. Create an issue with error details

---

*This auto-heal system ensures your codebase stays healthy and deployable with minimal manual intervention.* 