const { Octokit } = require('@octokit/rest');

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

// Initialize Octokit with your GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_REPOSITORY_OWNER;
const REPO = process.env.GITHUB_REPOSITORY_NAME;
const ENVIRONMENTS = ['dev', 'staging', 'prod'];

async function runTests() {
  try {
    console.log('🧪 Running tests...');
    await execAsync('npm run test:coverage:all');
    return true;
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    return false;
  }
}

async function enforceCoverage() {
  try {
    console.log('🔒 Enforcing 100% coverage requirement...');
    await execAsync('npm run test:enforce');
    return true;
  } catch (error) {
    console.error('❌ Coverage enforcement failed:', error.message);
    return false;
  }
}

async function checkCoverage() {
  try {
    console.log('📊 Checking coverage...');
    await execAsync('node scripts/check-coverage.js');
    return true;
  } catch (error) {
    console.error('❌ Coverage check failed:', error.message);
    return false;
  }
}

async function scaffoldMissingTests() {
  try {
    console.log('🔧 Scaffolding missing tests...');
    await execAsync('npm run test:scaffold');
    return true;
  } catch (error) {
    console.error('❌ Test scaffolding failed:', error.message);
    return false;
  }
}

async function runPerformanceTests() {
  try {
    console.log('⚡ Running performance tests...');
    await execAsync('npm run test:performance');
    return true;
  } catch (error) {
    console.error('❌ Performance tests failed:', error.message);
    return false;
  }
}

async function createPullRequest(base, head, title) {
  try {
    const { data: pr } = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title,
      head,
      base,
      body: `🤖 Automated promotion from ${head} to ${base}\n\n## Quality Gates\n- ✅ All tests passed\n- ✅ 100% coverage achieved\n- ✅ Performance requirements met\n- ✅ Coverage enforcement passed`
    });
    return pr.number;
  } catch (error) {
    console.error(`❌ Failed to create PR from ${head} to ${base}:`, error.message);
    return null;
  }
}

async function mergePullRequest(prNumber) {
  try {
    await octokit.pulls.merge({
      owner: OWNER,
      repo: REPO,
      pull_number: prNumber,
      merge_method: 'merge'
    });
    return true;
  } catch (error) {
    console.error(`❌ Failed to merge PR #${prNumber}:`, error.message);
    return false;
  }
}

async function createDeployment(environment, ref) {
  try {
    const { data: deployment } = await octokit.repos.createDeployment({
      owner: OWNER,
      repo: REPO,
      ref,
      environment,
      auto_merge: false,
      required_contexts: []
    });
    return deployment.id;
  } catch (error) {
    console.error(`❌ Failed to create deployment to ${environment}:`, error.message);
    return null;
  }
}

async function updateDeploymentStatus(deploymentId, state) {
  try {
    await octokit.repos.createDeploymentStatus({
      owner: OWNER,
      repo: REPO,
      deployment_id: deploymentId,
      state,
      log_url: `https://github.com/${OWNER}/${REPO}/actions/runs/${process.env.GITHUB_RUN_ID}`
    });
  } catch (error) {
    console.error(`❌ Failed to update deployment status:`, error.message);
  }
}

async function promoteThroughEnvironments() {
  const currentBranch = process.env.GITHUB_REF_NAME;
  
  console.log(`🚀 Starting promotion process from ${currentBranch}`);

  // Run comprehensive quality checks
  console.log('\n🔍 Running Quality Gates...');
  console.log('==========================');
  
  const testsPass = await runTests();
  if (!testsPass) {
    console.error('❌ Tests failed. Stopping promotion.');
    return;
  }

  // Enforce 100% coverage requirement
  const coverageEnforced = await enforceCoverage();
  if (!coverageEnforced) {
    console.error('❌ Coverage enforcement failed. Attempting to scaffold missing tests...');
    
    const scaffolded = await scaffoldMissingTests();
    if (scaffolded) {
      console.log('🔄 Re-running tests after scaffolding...');
      const retestPass = await runTests();
      if (!retestPass) {
        console.error('❌ Tests still failing after scaffolding. Stopping promotion.');
        return;
      }
      
      const reEnforced = await enforceCoverage();
      if (!reEnforced) {
        console.error('❌ Coverage still not at 100%. Stopping promotion.');
        return;
      }
    } else {
      console.error('❌ Could not scaffold missing tests. Stopping promotion.');
      return;
    }
  }

  const performancePass = await runPerformanceTests();
  if (!performancePass) {
    console.error('❌ Performance tests failed. Stopping promotion.');
    return;
  }

  console.log('\n✅ All quality gates passed! Proceeding with promotion...\n');

  // Promotion logic based on current branch
  if (currentBranch === 'main') {
    // Promote to staging
    console.log('🚀 Promoting to staging...');
    const prNumber = await createPullRequest('staging', 'main', '🚀 Promote to Staging');
    if (prNumber) {
      const merged = await mergePullRequest(prNumber);
      if (merged) {
        const deployId = await createDeployment('staging', 'staging');
        if (deployId) {
          await updateDeploymentStatus(deployId, 'success');
          console.log('✅ Successfully promoted to staging');
        }
      }
    }
  } else if (currentBranch === 'staging') {
    // Promote to production
    console.log('🚀 Promoting to production...');
    const prNumber = await createPullRequest('production', 'staging', '🚀 Promote to Production');
    if (prNumber) {
      const merged = await mergePullRequest(prNumber);
      if (merged) {
        const deployId = await createDeployment('production', 'production');
        if (deployId) {
          await updateDeploymentStatus(deployId, 'success');
          console.log('✅ Successfully promoted to production');
        }
      }
    }
  } else {
    console.log(`ℹ️  No promotion configured for branch: ${currentBranch}`);
  }
}

// Run the promotion process
promoteThroughEnvironments().catch(error => {
  console.error('❌ Promotion process failed:', error);
  process.exit(1);
}); 