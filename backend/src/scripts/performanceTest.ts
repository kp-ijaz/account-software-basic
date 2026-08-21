import axios, { AxiosInstance } from 'axios';

/**
 * Performance Testing Script
 * Tests response times of critical endpoints
 *
 * Usage: npx ts-node src/scripts/performanceTest.ts
 *
 * Requirements:
 * - Backend running on http://localhost:3001
 * - Test data generated via generateTestData.ts
 * - Admin user logged in
 */

const API_URL = process.env.API_URL || 'http://localhost:3001/api';
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  size?: number;
  status_text: string;
}

const results: TestResult[] = [];
let authToken: string = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function colorize(text: string, color: string): string {
  return `${color}${text}${colors.reset}`;
}

async function login(): Promise<string> {
  console.log(colorize('🔐 Logging in...', colors.blue));

  try {
    const startTime = Date.now();
    const response = await api.post('/auth/login', {
      email: 'admin@madrasa.local',
      password: 'Admin@12345',
    });
    const duration = Date.now() - startTime;

    const token = response.data.data.token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log(colorize(`✅ Login successful (${duration}ms)`, colors.green));
    return token;
  } catch (error) {
    console.error(colorize('❌ Login failed', colors.red));
    process.exit(1);
  }
}

async function testEndpoint(
  name: string,
  method: string,
  endpoint: string,
  params?: any
): Promise<void> {
  try {
    const startTime = Date.now();

    let response;
    if (method === 'GET') {
      response = await api.get(endpoint, { params });
    } else if (method === 'POST') {
      response = await api.post(endpoint, params);
    } else if (method === 'PUT') {
      response = await api.put(endpoint, params);
    }

    const duration = Date.now() - startTime;

    if (response) {
      const size = JSON.stringify(response.data).length / 1024; // KB

      results.push({
        name,
        endpoint,
        method,
        duration,
        status: response.status,
        size,
        status_text: 'OK',
      });

      // Determine color based on duration
      let durationColor = colors.green;
      if (duration > 1000) durationColor = colors.red;
      else if (duration > 500) durationColor = colors.yellow;

      console.log(
        `  ${name.padEnd(30)} ${colorize(`${duration}ms`, durationColor)} (${size.toFixed(1)}KB)`
      );
    }
  } catch (error: any) {
    results.push({
      name,
      endpoint,
      method,
      duration: 0,
      status: error.response?.status || 0,
      status_text: error.message,
    });

    console.log(
      `  ${name.padEnd(30)} ${colorize('FAILED', colors.red)} - ${error.message}`
    );
  }
}

async function runPerformanceTests(): Promise<void> {
  console.log(colorize('\n🚀 Performance Testing Suite', colors.blue));
  console.log(colorize('=' + '='.repeat(60), colors.blue));

  // Login
  authToken = await login();
  console.log('');

  // Test Dashboard
  console.log(colorize('📊 Dashboard Tests', colors.blue));
  await testEndpoint('Dashboard Data', 'GET', '/dashboard');
  console.log('');

  // Test Income
  console.log(colorize('💰 Income Tests', colors.blue));
  await testEndpoint('Income List (Page 1)', 'GET', '/income', { page: 1, pageSize: 50 });
  await testEndpoint('Income List (Page 5)', 'GET', '/income', { page: 5, pageSize: 50 });
  await testEndpoint('Income Search', 'GET', '/income', { search: 'Student', pageSize: 50 });
  console.log('');

  // Test Expense
  console.log(colorize('🏦 Expense Tests', colors.blue));
  await testEndpoint('Expense List (Page 1)', 'GET', '/expense', { page: 1, pageSize: 50 });
  await testEndpoint('Expense List (Page 5)', 'GET', '/expense', { page: 5, pageSize: 50 });
  console.log('');

  // Test Day Book
  console.log(colorize('📖 Day Book Tests', colors.blue));
  await testEndpoint('Day Book (Current Month)', 'GET', '/daybook', { pageSize: 50 });
  await testEndpoint('Day Book (With Filter)', 'GET', '/daybook', {
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    pageSize: 50,
  });
  console.log('');

  // Test Ledger
  console.log(colorize('📋 Ledger Tests', colors.blue));
  await testEndpoint('Ledger (Current Month)', 'GET', '/ledger', { pageSize: 50 });
  await testEndpoint('Ledger (Full Year)', 'GET', '/ledger', {
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    pageSize: 50,
  });
  console.log('');

  // Test Reports
  console.log(colorize('📈 Report Tests', colors.blue));
  await testEndpoint('Monthly Report', 'GET', '/reports/monthly', { month: 12, year: 2026 });
  await testEndpoint('Yearly Report', 'GET', '/reports/yearly', { year: 2026 });
  await testEndpoint('Balance Sheet', 'GET', '/reports/balance-sheet');
  console.log('');

  // Test Audit
  console.log(colorize('🔍 Audit Tests', colors.blue));
  await testEndpoint('Audit Log', 'GET', '/audit', { pageSize: 50 });
  console.log('');

  // Print Summary
  printSummary();
}

function printSummary(): void {
  console.log('');
  console.log(colorize('📊 Performance Test Summary', colors.blue));
  console.log(colorize('=' + '='.repeat(80), colors.blue));

  // Calculate statistics
  const validResults = results.filter((r) => r.status === 200);
  const failedResults = results.filter((r) => r.status !== 200);

  const durations = validResults.map((r) => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);

  console.log('');
  console.log(`Total Tests:        ${results.length}`);
  console.log(`Passed:             ${colorize(validResults.length.toString(), colors.green)}`);
  console.log(`Failed:             ${colorize(failedResults.toString(), colors.red)}`);
  console.log('');

  console.log(colorize('Response Time Statistics (ms):', colors.blue));
  console.log(`  Average:          ${avgDuration.toFixed(0)}ms`);
  console.log(`  Minimum:          ${colorize(minDuration.toFixed(0) + 'ms', colors.green)}`);
  console.log(`  Maximum:          ${colorize(maxDuration.toFixed(0) + 'ms', colors.red)}`);
  console.log('');

  console.log(colorize('Performance Targets:', colors.blue));
  console.log(
    `  Dashboard < 500ms:  ${avgDuration < 500 ? colorize('✅ PASS', colors.green) : colorize('❌ FAIL', colors.red)}`
  );
  console.log(
    `  APIs < 200ms:       ${avgDuration < 200 ? colorize('✅ PASS', colors.green) : colorize('⚠️  CHECK', colors.yellow)}`
  );
  console.log('');

  // Detailed results table
  console.log(colorize('Detailed Results:', colors.blue));
  console.log('');
  console.log(
    'Endpoint'.padEnd(35) +
      'Method'.padEnd(8) +
      'Duration'.padEnd(12) +
      'Size'.padEnd(10) +
      'Status'
  );
  console.log('-'.repeat(80));

  results.forEach((result) => {
    const statusColor = result.status === 200 ? colors.green : colors.red;
    const durationColor =
      result.duration > 1000 ? colors.red : result.duration > 500 ? colors.yellow : colors.green;

    console.log(
      result.endpoint.padEnd(35) +
        result.method.padEnd(8) +
        colorize(result.duration.toString().padEnd(12), durationColor) +
        (result.size ? result.size.toFixed(1).padEnd(10) : 'N/A'.padEnd(10)) +
        colorize(result.status.toString().padEnd(6), statusColor)
    );
  });

  console.log('');
  console.log(colorize('=' + '='.repeat(80), colors.blue));
  console.log(colorize('✅ Performance testing complete!', colors.green));
}

// Run tests
runPerformanceTests().catch((error) => {
  console.error(colorize('Error running tests:', colors.red), error);
  process.exit(1);
});
