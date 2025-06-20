const { spawn } = require('child_process');
const { promisify } = require('util');

const autocannon = require('autocannon');

const SLA_THRESHOLDS = {
  api: 300,  // 300ms
  frontend: 1000  // 1s
};

const TEST_DURATION = 10;  // seconds
const CONCURRENT_CONNECTIONS = 10;

const API_ENDPOINTS = [
  '/api/test-status'
  // Add more endpoints here
];

function startServer() {
  return new Promise((resolve) => {
    const server = spawn('npm', ['run', 'start']);
    server.stdout.on('data', (data) => {
      if (data.toString().includes('ready')) {
        resolve(server);
      }
    });
  });
}

async function runEndpointTest(url) {
  const result = await autocannon({
    url,
    connections: CONCURRENT_CONNECTIONS,
    duration: TEST_DURATION,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return {
    url,
    avgLatency: result.latency.average,
    p95Latency: result.latency.p95,
    reqPerSec: result.requests.average
  };
}

async function runPerformanceTests() {
  console.log('\nRunning Performance Tests');
  console.log('========================');

  const server = await startServer();
  let failed = false;

  try {
    for (const endpoint of API_ENDPOINTS) {
      const url = `http://localhost:3000${endpoint}`;
      console.log(`\nTesting endpoint: ${endpoint}`);
      
      const results = await runEndpointTest(url);
      
      console.log(`Average Latency: ${results.avgLatency}ms`);
      console.log(`P95 Latency: ${results.p95Latency}ms`);
      console.log(`Requests/sec: ${results.reqPerSec}`);

      if (results.p95Latency > SLA_THRESHOLDS.api) {
        console.error(`❌ P95 latency (${results.p95Latency}ms) exceeds SLA threshold (${SLA_THRESHOLDS.api}ms)`);
        failed = true;
      } else {
        console.log('✅ Performance within SLA thresholds');
      }
    }

    if (failed) {
      console.error('\n❌ Performance tests failed - SLA thresholds not met');
      process.exit(1);
    }

    console.log('\n✅ All performance tests passed!');
  } finally {
    server.kill();
  }
}

runPerformanceTests().catch(error => {
  console.error('Error running performance tests:', error);
  process.exit(1);
}); 