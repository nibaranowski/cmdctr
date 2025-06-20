const fs = require('fs');
const path = require('path');

const TARGET_BRANCH = process.env.TARGET_BRANCH || 'main';
const COVERAGE_THRESHOLD = 100;

const PROMOTION_RULES = {
  main: ['dev'],                    // Dev -> Staging
  staging: ['dev', 'staging'],      // Staging -> Production
  production: ['dev', 'staging', 'prod']  // Production release
};

function checkEnvironmentCoverage(env) {
  try {
    const coverageFile = path.join(process.cwd(), `coverage-${env}`, 'coverage-final.json');
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    const total = coverage.total;

    if (!total) {
      throw new Error(`No coverage data found for ${env} environment`);
    }

    const metrics = {
      statements: total.statements.pct,
      branches: total.branches.pct,
      functions: total.functions.pct,
      lines: total.lines.pct
    };

    console.log(`\n${env.toUpperCase()} Environment Coverage:`);
    console.log('------------------------');
    
    let passed = true;
    Object.entries(metrics).forEach(([metric, value]) => {
      console.log(`${metric}: ${value}%`);
      if (value < COVERAGE_THRESHOLD) {
        console.error(`❌ ${env} ${metric} coverage (${value}%) is below threshold (${COVERAGE_THRESHOLD}%)`);
        passed = false;
      }
    });

    return passed;
  } catch (error) {
    console.error(`Error checking ${env} coverage:`, error.message);
    return false;
  }
}

function verifyPromotion() {
  console.log(`\nVerifying promotion requirements for ${TARGET_BRANCH}...`);
  console.log('===========================================');

  const requiredEnvironments = PROMOTION_RULES[TARGET_BRANCH];
  
  if (!requiredEnvironments) {
    console.error(`❌ Invalid target branch: ${TARGET_BRANCH}`);
    process.exit(1);
  }

  let allPassed = true;

  requiredEnvironments.forEach(env => {
    const envPassed = checkEnvironmentCoverage(env);
    if (!envPassed) {
      allPassed = false;
      console.error(`\n❌ ${env.toUpperCase()} environment checks failed`);
    } else {
      console.log(`\n✅ ${env.toUpperCase()} environment checks passed`);
    }
  });

  if (!allPassed) {
    console.error('\n❌ Promotion requirements not met. Fix coverage issues before promoting.');
    process.exit(1);
  }

  console.log('\n✅ All promotion requirements met!');
  process.exit(0);
}

verifyPromotion(); 