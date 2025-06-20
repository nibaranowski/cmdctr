#!/usr/bin/env node

// Visual Test Dashboard
// Shows real-time status of all test suites across environments
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Test suite configuration
const testSuites = {
  'be-dev': {
    name: 'Backend Dev',
    command: 'npm run test:unit -- --testPathPattern="__tests__/(api|models|lib)"',
    coverageThreshold: 70,
    environment: 'development'
  },
  'fe-dev': {
    name: 'Frontend Dev',
    command: 'npm run test:unit -- --testPathPattern="components"',
    coverageThreshold: 70,
    environment: 'development'
  },
  'be-stag': {
    name: 'Backend Staging',
    command: 'npm run test:staging -- --testPathPattern="__tests__/(api|models|lib|integration)"',
    coverageThreshold: 80,
    environment: 'staging'
  },
  'fe-stag': {
    name: 'Frontend Staging',
    command: 'npm run test:staging -- --testPathPattern="components"',
    coverageThreshold: 80,
    environment: 'staging'
  },
  'be-prod': {
    name: 'Backend Production',
    command: 'npm run test:prod -- --testPathPattern="__tests__/(api|models|lib|integration)"',
    coverageThreshold: 90,
    environment: 'production'
  },
  'fe-prod': {
    name: 'Frontend Production',
    command: 'npm run test:prod -- --testPathPattern="components"',
    coverageThreshold: 90,
    environment: 'production'
  }
};

class TestDashboard {
  constructor() {
    this.results = {};
    this.startTime = Date.now();
  }

  // Run a single test suite
  async runTestSuite(suiteKey, config) {
    console.log(`${colors.cyan}🔄 Running ${config.name} tests...${colors.reset}`);
    
    try {
      const startTime = Date.now();
      const output = execSync(config.command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 300000 // 5 minutes timeout
      });
      const duration = Date.now() - startTime;
      
      // Parse coverage from output
      const coverageMatch = output.match(/All files\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)/);
      const coverage = coverageMatch ? {
        branches: parseInt(coverageMatch[1]),
        functions: parseInt(coverageMatch[2]),
        lines: parseInt(coverageMatch[3]),
        statements: parseInt(coverageMatch[4])
      } : null;

      // Check if tests passed
      const passed = !output.includes('FAIL') && !output.includes('✕');
      
      this.results[suiteKey] = {
        status: passed ? 'GREEN' : 'RED',
        coverage,
        duration,
        output: output.slice(-500), // Last 500 chars for debugging
        timestamp: new Date().toISOString()
      };

      return passed;
    } catch (error) {
      this.results[suiteKey] = {
        status: 'RED',
        coverage: null,
        duration: 0,
        output: error.message,
        timestamp: new Date().toISOString()
      };
      return false;
    }
  }

  // Run all test suites
  async runAllTests() {
    console.log(`${colors.bold}${colors.blue}🧪 CMDCTR Test Dashboard${colors.reset}\n`);
    
    const promises = Object.entries(testSuites).map(([key, config]) => 
      this.runTestSuite(key, config)
    );
    
    await Promise.all(promises);
  }

  // Display the dashboard
  displayDashboard() {
    console.clear();
    console.log(`${colors.bold}${colors.blue}╔══════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}║                        🧪 CMDCTR TEST DASHBOARD                              ║${colors.reset}`);
    console.log(`${colors.bold}${colors.blue}╚══════════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    // Environment sections
    const environments = ['development', 'staging', 'production'];
    
    environments.forEach(env => {
      console.log(`${colors.bold}${colors.magenta}${env.toUpperCase()} ENVIRONMENT${colors.reset}`);
      console.log(`${colors.magenta}${'─'.repeat(50)}${colors.reset}`);
      
      const envSuites = Object.entries(testSuites).filter(([_, config]) => config.environment === env);
      
      envSuites.forEach(([key, config]) => {
        const result = this.results[key];
        if (!result) return;

        const statusIcon = result.status === 'GREEN' ? '🟢' : '🔴';
        const statusColor = result.status === 'GREEN' ? colors.green : colors.red;
        
        console.log(`${statusIcon} ${statusColor}${config.name}${colors.reset}`);
        
        if (result.coverage) {
          const avgCoverage = Math.round((result.coverage.branches + result.coverage.functions + result.coverage.lines + result.coverage.statements) / 4);
          const coverageColor = avgCoverage >= config.coverageThreshold ? colors.green : colors.red;
          
          console.log(`   📊 Coverage: ${coverageColor}${avgCoverage}%${colors.reset} (${result.coverage.branches}% branches, ${result.coverage.functions}% functions, ${result.coverage.lines}% lines, ${result.coverage.statements}% statements)`);
        }
        
        console.log(`   ⏱️  Duration: ${result.duration}ms`);
        console.log(`   🕐 Last Run: ${new Date(result.timestamp).toLocaleTimeString()}`);
        console.log('');
      });
    });

    // Quality Gates
    console.log(`${colors.bold}${colors.yellow}QUALITY GATES${colors.reset}`);
    console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
    
    const devPassed = this.checkEnvironmentGate('development');
    const stagingPassed = this.checkEnvironmentGate('staging');
    const prodPassed = this.checkEnvironmentGate('production');
    
    console.log(`🔄 Dev → Staging: ${devPassed ? `${colors.green  }✅ OPEN` : `${colors.red  }❌ BLOCKED${  colors.reset}`}`);
    console.log(`🔄 Staging → Prod: ${stagingPassed ? `${colors.green  }✅ OPEN` : `${colors.red  }❌ BLOCKED${  colors.reset}`}`);
    console.log(`🔄 Production Ready: ${prodPassed ? `${colors.green  }✅ YES` : `${colors.red  }❌ NO${  colors.reset}`}`);
    
    // Summary
    console.log(`\n${colors.bold}${colors.cyan}SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}${'─'.repeat(50)}${colors.reset}`);
    
    const totalSuites = Object.keys(testSuites).length;
    const passedSuites = Object.values(this.results).filter(r => r.status === 'GREEN').length;
    const overallCoverage = this.calculateOverallCoverage();
    
    console.log(`📈 Test Suites: ${colors.green}${passedSuites}/${totalSuites} PASSED${colors.reset}`);
    console.log(`📊 Overall Coverage: ${colors.blue}${overallCoverage}%${colors.reset}`);
    console.log(`⏱️  Total Runtime: ${Date.now() - this.startTime}ms`);
  }

  // Check if environment gate is open
  checkEnvironmentGate(environment) {
    const envSuites = Object.entries(testSuites).filter(([_, config]) => config.environment === environment);
    return envSuites.every(([key, _]) => this.results[key]?.status === 'GREEN');
  }

  // Calculate overall coverage
  calculateOverallCoverage() {
    const coverages = Object.values(this.results)
      .filter(r => r.coverage)
      .map(r => (r.coverage.branches + r.coverage.functions + r.coverage.lines + r.coverage.statements) / 4);
    
    return coverages.length > 0 ? Math.round(coverages.reduce((a, b) => a + b, 0) / coverages.length) : 0;
  }

  // Save results to file
  saveResults() {
    const resultsPath = path.join(process.cwd(), 'test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalSuites: Object.keys(testSuites).length,
        passedSuites: Object.values(this.results).filter(r => r.status === 'GREEN').length,
        overallCoverage: this.calculateOverallCoverage(),
        qualityGates: {
          devToStaging: this.checkEnvironmentGate('development'),
          stagingToProd: this.checkEnvironmentGate('staging'),
          productionReady: this.checkEnvironmentGate('production')
        }
      }
    }, null, 2));
    
    console.log(`\n${colors.cyan}📄 Results saved to: test-results.json${colors.reset}`);
  }
}

// Main execution
async function main() {
  const dashboard = new TestDashboard();
  
  try {
    await dashboard.runAllTests();
    dashboard.displayDashboard();
    dashboard.saveResults();
    
    // Exit with error code if any tests failed
    const allPassed = Object.values(dashboard.results).every(r => r.status === 'GREEN');
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error(`${colors.red}❌ Dashboard error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TestDashboard;

function parseCoverageData(coverageFile) {
  try {
    const coverageData = fs.readFileSync(coverageFile, 'utf8');
    const lines = coverageData.split('\n');
    
    let backendFiles = 0;
    let backendCovered = 0;
    let frontendFiles = 0;
    let frontendCovered = 0;
    let totalFiles = 0;
    let totalCovered = 0;
    
    let currentFile = '';
    
    lines.forEach(line => {
      if (line.startsWith('SF:')) {
        currentFile = line.substring(3);
      }
      
      if (line.startsWith('LF:')) {
        const totalLines = parseInt(line.substring(3));
        const coveredLines = parseInt(lines[lines.indexOf(line) + 1].substring(3));
        
        totalFiles += totalLines;
        totalCovered += coveredLines;
        
        // Determine if file is frontend or backend
        if (currentFile.includes('/pages/') || currentFile.includes('/components/')) {
          frontendFiles += totalLines;
          frontendCovered += coveredLines;
        } else if (currentFile.includes('/lib/') || currentFile.includes('/models/') || currentFile.includes('/api/')) {
          backendFiles += totalLines;
          backendCovered += coveredLines;
        }
      }
    });
    
    return {
      backend: backendFiles > 0 ? Math.round((backendCovered / backendFiles) * 100) : 0,
      frontend: frontendFiles > 0 ? Math.round((frontendCovered / frontendFiles) * 100) : 0,
      coverage: totalFiles > 0 ? Math.round((totalCovered / totalFiles) * 100) : 0
    };
  } catch (error) {
    console.error('Error parsing coverage:', error);
    return { backend: 0, frontend: 0, coverage: 0 };
  }
}

function getCoverageForEnv(env) {
  const coverageFile = path.join(process.cwd(), `coverage-${env}`, 'lcov.info');
  
  if (!fs.existsSync(coverageFile)) {
    console.warn(`No coverage file found for ${env} environment`);
    return { backend: 0, frontend: 0, coverage: 0 };
  }
  
  return parseCoverageData(coverageFile);
}

function generateCoverageReport() {
  const report = {
    dev: getCoverageForEnv('dev'),
    staging: getCoverageForEnv('staging'),
    prod: getCoverageForEnv('prod')
  };
  
  // Save the report
  const reportPath = path.join(process.cwd(), 'coverage-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('Coverage report generated:', reportPath);
  
  return report;
}

// Generate report if run directly
if (require.main === module) {
  generateCoverageReport();
}

module.exports = { generateCoverageReport, getCoverageForEnv, parseCoverageData }; 