#!/usr/bin/env node

/**
 * Coverage Watcher - Monitors code changes and automatically runs coverage checks
 * Provides real-time feedback on test coverage status
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chokidar = require('chokidar');

const execAsync = promisify(exec);

class CoverageWatcher {
  constructor() {
    this.watchedDirectories = [
      'components',
      'pages',
      'lib',
      'models',
      'scripts',
      '__tests__'
    ];
    this.ignoredPatterns = [
      'node_modules',
      '.next',
      'coverage*',
      '*.test.js',
      '*.test.ts',
      '*.test.tsx',
      '*.spec.js',
      '*.spec.ts',
      '*.spec.tsx',
      '.git'
    ];
    this.debounceTimeout = 2000; // 2 seconds
    this.debounceTimer = null;
    this.isRunning = false;
  }

  async start() {
    console.log('👀 Starting coverage watcher...');
    console.log('📁 Watching directories:', this.watchedDirectories.join(', '));
    console.log('🚫 Ignoring patterns:', this.ignoredPatterns.join(', '));
    console.log('\n💡 Coverage checks will run automatically after code changes');
    console.log('💡 Press Ctrl+C to stop watching\n');

    const watcher = chokidar.watch(this.watchedDirectories, {
      ignored: this.ignoredPatterns,
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', (filePath) => this.handleFileChange('added', filePath))
      .on('change', (filePath) => this.handleFileChange('modified', filePath))
      .on('unlink', (filePath) => this.handleFileChange('removed', filePath))
      .on('error', (error) => console.error('❌ Watcher error:', error));

    // Run initial coverage check
    await this.runCoverageCheck('Initial coverage check');
  }

  handleFileChange(event, filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`📝 File ${event}: ${relativePath}`);

    // Debounce coverage checks
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.runCoverageCheck(`After ${event} ${relativePath}`);
    }, this.debounceTimeout);
  }

  async runCoverageCheck(reason) {
    if (this.isRunning) {
      console.log('⏳ Coverage check already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log(`\n🧪 Running coverage check: ${reason}`);
    console.log('─'.repeat(50));

    try {
      const startTime = Date.now();
      
      // Run tests with coverage
      await this.runTestsWithCoverage();
      
      // Check coverage results
      const results = await this.checkCoverageResults();
      
      // Display summary
      this.displayCoverageSummary(results, Date.now() - startTime);
      
    } catch (error) {
      console.error('❌ Coverage check failed:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  async runTestsWithCoverage() {
    try {
      console.log('📊 Running tests with coverage...');
      await execAsync('npm run test:coverage:dev', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      });
      console.log('✅ Tests completed');
    } catch (error) {
      console.error('❌ Tests failed:', error.message);
      throw error;
    }
  }

  async checkCoverageResults() {
    const coverageFile = path.join(process.cwd(), 'coverage-dev', 'coverage-final.json');
    
    try {
      const coverageData = await fs.promises.readFile(coverageFile, 'utf8');
      const coverage = JSON.parse(coverageData);
      
      return this.analyzeCoverage(coverage);
    } catch (error) {
      console.error('❌ Failed to read coverage data:', error.message);
      throw error;
    }
  }

  analyzeCoverage(coverage) {
    const result = {
      overall: {},
      files: {},
      gaps: [],
      passed: true,
      summary: {
        totalFiles: 0,
        filesWithGaps: 0,
        totalGaps: 0
      }
    };

    // Check overall coverage
    if (coverage.total) {
      result.overall = {
        statements: coverage.total.statements.pct,
        branches: coverage.total.branches.pct,
        functions: coverage.total.functions.pct,
        lines: coverage.total.lines.pct
      };
      
      // Check if any metric is below 100%
      for (const metric of ['statements', 'branches', 'functions', 'lines']) {
        if (result.overall[metric] < 100) {
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
        result.summary.filesWithGaps++;
      }
      
      result.files[filePath] = {
        statements: fileData.statements.pct,
        branches: fileData.branches.pct,
        functions: fileData.functions.pct,
        lines: fileData.lines.pct,
        gaps: fileGaps
      };
      
      result.summary.totalFiles++;
      result.summary.totalGaps += fileGaps.length;
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

  displayCoverageSummary(results, duration) {
    console.log('\n📋 Coverage Summary');
    console.log('==================');
    
    // Overall coverage
    if (results.overall.statements !== undefined) {
      console.log('\n🌍 Overall Coverage:');
      for (const metric of ['statements', 'branches', 'functions', 'lines']) {
        const value = results.overall[metric];
        const status = value >= 100 ? '✅' : '❌';
        console.log(`  ${metric}: ${value}% ${status}`);
      }
    }
    
    // File summary
    console.log(`\n📁 Files: ${results.summary.totalFiles} total, ${results.summary.filesWithGaps} with gaps`);
    console.log(`🔍 Total gaps: ${results.summary.totalGaps}`);
    
    // Show recent gaps
    if (results.gaps.length > 0) {
      console.log('\n❌ Recent Coverage Gaps:');
      const recentGaps = results.gaps.slice(0, 5);
      const groupedGaps = this.groupGapsByFile(recentGaps);
      
      for (const [file, fileGaps] of Object.entries(groupedGaps)) {
        const fileName = path.basename(file);
        console.log(`  📄 ${fileName}: ${fileGaps.length} gaps`);
      }
      
      if (results.gaps.length > 5) {
        console.log(`  ... and ${results.gaps.length - 5} more gaps`);
      }
    }
    
    // Status
    const status = results.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`\n${status} - Coverage check completed in ${duration}ms`);
    
    if (!results.passed) {
      console.log('💡 Run "npm run test:scaffold" to generate missing tests');
    }
    
    console.log('\n👀 Watching for changes...\n');
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

  async generateMissingTests() {
    console.log('\n🔧 Generating missing tests...');
    
    try {
      const TestScaffolder = require('./test-scaffolder');
      const scaffolder = new TestScaffolder();
      
      await scaffolder.scaffoldMissingTests();
      
      // Re-run coverage check after generating tests
      await this.runCoverageCheck('After generating missing tests');
    } catch (error) {
      console.error('❌ Failed to generate missing tests:', error.message);
    }
  }
}

// CLI interface
async function main() {
  const watcher = new CoverageWatcher();
  
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Coverage Watcher - Monitors code changes and runs coverage checks

Usage:
  node scripts/coverage-watcher.js [options]

Options:
  --help, -h           Show this help message
  --generate-tests     Generate missing tests for gaps
  --no-debounce        Disable debouncing (run immediately on changes)
    `);
    return;
  }
  
  if (process.argv.includes('--no-debounce')) {
    watcher.debounceTimeout = 0;
  }
  
  if (process.argv.includes('--generate-tests')) {
    await watcher.generateMissingTests();
    return;
  }
  
  await watcher.start();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Coverage watcher failed:', error);
    process.exit(1);
  });
}

module.exports = CoverageWatcher; 