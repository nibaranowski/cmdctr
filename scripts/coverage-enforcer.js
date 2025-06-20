#!/usr/bin/env node

/**
 * Coverage Enforcer - Enforces 100% test coverage as a non-negotiable requirement
 * Prevents code promotion or merge if any element is missing test coverage
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class CoverageEnforcer {
  constructor() {
    this.coverageThreshold = 100;
    this.environments = ['dev', 'staging', 'prod'];
    this.requiredCoverageMetrics = ['statements', 'branches', 'functions', 'lines'];
  }

  async enforceCoverage() {
    console.log('🔒 Enforcing 100% test coverage...\n');
    
    try {
      // Run coverage tests for all environments
      await this.runCoverageTests();
      
      // Check coverage for each environment
      const results = await this.checkAllEnvironments();
      
      // Generate detailed report
      const report = this.generateReport(results);
      
      // Enforce coverage requirements
      const passed = this.enforceRequirements(report);
      
      if (passed) {
        console.log('✅ All coverage requirements met! Code can be promoted.');
        return true;
      } else {
        console.error('❌ Coverage requirements not met. Code promotion blocked.');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Coverage enforcement failed:', error.message);
      process.exit(1);
    }
  }

  async runCoverageTests() {
    console.log('🧪 Running coverage tests for all environments...');
    
    for (const env of this.environments) {
      console.log(`\n📊 Running ${env} environment tests...`);
      try {
        execSync(`npm run test:coverage:${env}`, { 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: env }
        });
        console.log(`✅ ${env} tests completed`);
      } catch (error) {
        console.error(`❌ ${env} tests failed:`, error.message);
        throw new Error(`${env} environment tests failed`);
      }
    }
  }

  async checkAllEnvironments() {
    const results = {};
    
    for (const env of this.environments) {
      console.log(`\n📈 Checking ${env} coverage...`);
      results[env] = await this.checkEnvironmentCoverage(env);
    }
    
    return results;
  }

  async checkEnvironmentCoverage(environment) {
    const coverageFile = path.join(process.cwd(), `coverage-${environment}`, 'coverage-final.json');
    
    try {
      const coverageData = await fs.readFile(coverageFile, 'utf8');
      const coverage = JSON.parse(coverageData);
      
      return this.analyzeCoverage(coverage, environment);
    } catch (error) {
      console.error(`❌ Failed to read ${environment} coverage:`, error.message);
      throw new Error(`Cannot read ${environment} coverage data`);
    }
  }

  analyzeCoverage(coverage, environment) {
    const result = {
      environment,
      overall: {},
      files: {},
      gaps: [],
      passed: true
    };

    // Check overall coverage
    if (coverage.total) {
      result.overall = {
        statements: coverage.total.statements.pct,
        branches: coverage.total.branches.pct,
        functions: coverage.total.functions.pct,
        lines: coverage.total.lines.pct
      };
      
      // Check if any metric is below threshold
      for (const metric of this.requiredCoverageMetrics) {
        if (result.overall[metric] < this.coverageThreshold) {
          result.passed = false;
        }
      }
    }

    // Analyze individual files
    for (const filePath in coverage) {
      if (filePath === 'total') continue;
      
      const fileData = coverage[filePath];
      const fileGaps = this.findFileGaps(filePath, fileData);
      
      if (fileGaps.length > 0) {
        result.gaps.push(...fileGaps);
        result.passed = false;
      }
      
      result.files[filePath] = {
        statements: fileData.statements.pct,
        branches: fileData.branches.pct,
        functions: fileData.functions.pct,
        lines: fileData.lines.pct,
        gaps: fileGaps
      };
    }

    return result;
  }

  findFileGaps(filePath, fileData) {
    const gaps = [];
    
    // Check statement coverage
    if (fileData.statementMap) {
      for (const stmtId in fileData.s) {
        if (fileData.s[stmtId] === 0) {
          const stmt = fileData.statementMap[stmtId];
          gaps.push({
            type: 'statement',
            line: stmt.start.line,
            endLine: stmt.end.line,
            file: filePath
          });
        }
      }
    }
    
    // Check branch coverage
    if (fileData.branchMap) {
      for (const branchId in fileData.b) {
        const branch = fileData.b[branchId];
        if (branch.some(count => count === 0)) {
          const branchInfo = fileData.branchMap[branchId];
          gaps.push({
            type: 'branch',
            line: branchInfo.line,
            file: filePath,
            uncovered: branch.map((count, index) => count === 0 ? index : null).filter(i => i !== null)
          });
        }
      }
    }
    
    // Check function coverage
    if (fileData.fnMap) {
      for (const fnId in fileData.f) {
        if (fileData.f[fnId] === 0) {
          const fn = fileData.fnMap[fnId];
          gaps.push({
            type: 'function',
            line: fn.line,
            name: fn.name,
            file: filePath
          });
        }
      }
    }
    
    return gaps;
  }

  generateReport(results) {
    console.log('\n📋 Coverage Report');
    console.log('==================');
    
    let allPassed = true;
    
    for (const [env, result] of Object.entries(results)) {
      console.log(`\n🌍 ${env.toUpperCase()} Environment`);
      console.log('─'.repeat(env.length + 12));
      
      if (result.overall.statements !== undefined) {
        console.log('Overall Coverage:');
        for (const metric of this.requiredCoverageMetrics) {
          const value = result.overall[metric];
          const status = value >= this.coverageThreshold ? '✅' : '❌';
          console.log(`  ${metric}: ${value}% ${status}`);
          
          if (value < this.coverageThreshold) {
            allPassed = false;
          }
        }
      }
      
      if (result.gaps.length > 0) {
        console.log(`\n❌ Coverage Gaps (${result.gaps.length}):`);
        this.displayGaps(result.gaps);
      } else {
        console.log('\n✅ No coverage gaps found');
      }
    }
    
    return {
      results,
      allPassed,
      summary: this.generateSummary(results)
    };
  }

  displayGaps(gaps) {
    const groupedGaps = this.groupGapsByFile(gaps);
    
    for (const [file, fileGaps] of Object.entries(groupedGaps)) {
      console.log(`\n  📁 ${file}:`);
      
      const statementGaps = fileGaps.filter(g => g.type === 'statement');
      const branchGaps = fileGaps.filter(g => g.type === 'branch');
      const functionGaps = fileGaps.filter(g => g.type === 'function');
      
      if (statementGaps.length > 0) {
        console.log(`    📝 Uncovered statements: ${statementGaps.length}`);
        statementGaps.slice(0, 5).forEach(gap => {
          console.log(`      Line ${gap.line}-${gap.endLine}`);
        });
        if (statementGaps.length > 5) {
          console.log(`      ... and ${statementGaps.length - 5} more`);
        }
      }
      
      if (branchGaps.length > 0) {
        console.log(`    🔀 Uncovered branches: ${branchGaps.length}`);
        branchGaps.slice(0, 3).forEach(gap => {
          console.log(`      Line ${gap.line} (branches: ${gap.uncovered.join(', ')})`);
        });
      }
      
      if (functionGaps.length > 0) {
        console.log(`    ⚙️  Uncovered functions: ${functionGaps.length}`);
        functionGaps.slice(0, 3).forEach(gap => {
          console.log(`      Line ${gap.line}: ${gap.name}`);
        });
      }
    }
  }

  groupGapsByFile(gaps) {
    const grouped = {};
    
    for (const gap of gaps) {
      if (!grouped[gap.file]) {
        grouped[gap.file] = [];
      }
      grouped[gap.file].push(gap);
    }
    
    return grouped;
  }

  generateSummary(results) {
    const summary = {
      totalFiles: 0,
      filesWithGaps: 0,
      totalGaps: 0,
      environments: {}
    };
    
    for (const [env, result] of Object.entries(results)) {
      summary.environments[env] = {
        passed: result.passed,
        files: Object.keys(result.files).length,
        gaps: result.gaps.length,
        coverage: result.overall
      };
      
      summary.totalFiles += Object.keys(result.files).length;
      summary.totalGaps += result.gaps.length;
      
      if (result.gaps.length > 0) {
        summary.filesWithGaps++;
      }
    }
    
    return summary;
  }

  enforceRequirements(report) {
    console.log('\n🔒 Coverage Requirements Check');
    console.log('=============================');
    
    if (report.allPassed) {
      console.log('✅ All environments meet 100% coverage requirement');
      console.log('✅ All files have complete test coverage');
      console.log('✅ Code promotion is allowed');
      return true;
    } else {
      console.log('❌ Coverage requirements not met:');
      
      for (const [env, result] of Object.entries(report.results)) {
        if (!result.passed) {
          console.log(`  ❌ ${env} environment: ${result.gaps.length} coverage gaps`);
        }
      }
      
      console.log('\n🚫 Code promotion blocked until 100% coverage is achieved');
      console.log('💡 Run "npm run test:scaffold" to generate missing tests');
      return false;
    }
  }

  async generateMissingTests(gaps) {
    console.log('\n🔧 Generating missing tests for coverage gaps...');
    
    const TestScaffolder = require('./test-scaffolder');
    const scaffolder = new TestScaffolder();
    
    // Group gaps by file and generate tests
    const filesNeedingTests = [...new Set(gaps.map(gap => gap.file))];
    
    for (const file of filesNeedingTests) {
      try {
        await scaffolder.generateTestForFile(file);
      } catch (error) {
        console.error(`❌ Failed to generate test for ${file}:`, error.message);
      }
    }
  }
}

// CLI interface
async function main() {
  const enforcer = new CoverageEnforcer();
  
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Coverage Enforcer - Enforces 100% test coverage

Usage:
  node scripts/coverage-enforcer.js [options]

Options:
  --help, -h           Show this help message
  --generate-tests     Generate missing tests for gaps
  --strict            Exit with error if any gaps found
    `);
    return;
  }
  
  await enforcer.enforceCoverage();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Coverage enforcement failed:', error);
    process.exit(1);
  });
}

module.exports = CoverageEnforcer; 