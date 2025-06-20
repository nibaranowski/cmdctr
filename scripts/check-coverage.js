#!/usr/bin/env node

// Coverage threshold checker
// See: https://jestjs.io/docs/configuration#coveragethreshold-object
const fs = require('fs');
const path = require('path');

const COVERAGE_THRESHOLD = 100;
const ENVIRONMENTS = ['dev', 'staging', 'prod'];

function analyzeCoverageGaps(coverage) {
  const gaps = [];
  
  for (const file in coverage) {
    const fileData = coverage[file];
    const statementMap = fileData.statementMap;
    const statements = fileData.s;
    
    for (const stmtId in statements) {
      if (statements[stmtId] === 0) {
        gaps.push({
          file,
          line: statementMap[stmtId].start.line,
          endLine: statementMap[stmtId].end.line,
          type: 'statement'
        });
      }
    }
  }
  
  return gaps;
}

function generateTestTemplate(gap) {
  const fileContent = fs.readFileSync(gap.file, 'utf8');
  const lines = fileContent.split('\n');
  const uncoveredCode = lines.slice(gap.line - 1, gap.endLine).join('\n');
  
  return `
describe('${path.basename(gap.file)}', () => {
  test('should cover lines ${gap.line}-${gap.endLine}', () => {
    // TODO: Implement test for:
    ${uncoveredCode.split('\n').map(line => `    // ${line}`).join('\n')}
  });
});
`;
}

function checkCoverage(coverageFile) {
  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    const total = coverage.total;

    if (!total) {
      console.error(`No coverage data found in ${coverageFile}`);
      process.exit(1);
    }

    const metrics = {
      statements: total.statements.pct,
      branches: total.branches.pct,
      functions: total.functions.pct,
      lines: total.lines.pct
    };

    console.log('\nCoverage Results:');
    console.log('----------------');
    
    let hasGaps = false;
    Object.entries(metrics).forEach(([metric, value]) => {
      console.log(`${metric}: ${value}%`);
      if (value < COVERAGE_THRESHOLD) {
        hasGaps = true;
        console.error(`❌ ${metric} coverage (${value}%) is below threshold (${COVERAGE_THRESHOLD}%)`);
      }
    });

    if (hasGaps) {
      const gaps = analyzeCoverageGaps(coverage);
      console.log('\nCoverage Gaps Found:');
      console.log('------------------');
      
      gaps.forEach(gap => {
        console.log(`\nFile: ${gap.file}`);
        console.log(`Lines: ${gap.line}-${gap.endLine}`);
        
        // Generate test template
        const testTemplate = generateTestTemplate(gap);
        const testFile = gap.file.replace(/\.(js|ts|tsx)$/, '.test.$1');
        
        console.log('\nProposed Test:');
        console.log(testTemplate);
        
        // Save test template if it doesn't exist
        if (!fs.existsSync(testFile)) {
          fs.writeFileSync(testFile, testTemplate);
          console.log(`✅ Created test file: ${testFile}`);
        }
      });
      
      process.exit(1);
    }

    console.log('✅ All coverage thresholds met!\n');
    return true;
  } catch (error) {
    console.error(`Error reading coverage file ${coverageFile}:`, error);
    process.exit(1);
  }
}

// Check coverage for all environments
ENVIRONMENTS.forEach(env => {
  const coverageFile = path.join(process.cwd(), `coverage-${env}`, 'coverage-final.json');
  console.log(`\nChecking ${env.toUpperCase()} environment coverage:`);
  console.log('======================================');
  checkCoverage(coverageFile);
}); 