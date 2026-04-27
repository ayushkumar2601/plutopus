#!/usr/bin/env node
// ============================================================
// PLUTO System Health Check
// Tests all critical components and API endpoints
// ============================================================

const axios = require('axios');
const chalk = require('chalk');

const BASE_URL = 'http://localhost:3000';
const TESTS_PASSED = [];
const TESTS_FAILED = [];

// Helper functions
const log = {
  info: (msg) => console.log(chalk.cyan('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  section: (msg) => console.log(chalk.magenta.bold(`\n${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}`))
};

async function testEndpoint(name, url, method = 'GET', data = null) {
  try {
    log.info(`Testing ${name}...`);
    const config = { method, url: `${BASE_URL}${url}`, timeout: 10000 };
    if (data) config.data = data;
    
    const response = await axios(config);
    
    if (response.status === 200 && response.data) {
      log.success(`${name} - OK`);
      TESTS_PASSED.push(name);
      return { success: true, data: response.data };
    } else {
      log.error(`${name} - Unexpected response`);
      TESTS_FAILED.push(name);
      return { success: false, error: 'Unexpected response' };
    }
  } catch (error) {
    log.error(`${name} - FAILED: ${error.message}`);
    TESTS_FAILED.push(name);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🤖 PLUTO SYSTEM HEALTH CHECK                            ║
║     Testing all critical components...                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`));

  // ============================================
  // 1. BASIC API TESTS
  // ============================================
  log.section('1. BASIC API ENDPOINTS');
  
  await testEndpoint('Traffic API (GET)', '/api/traffic');
  await testEndpoint('Detection API', '/api/detect');
  await testEndpoint('Response API', '/api/respond');
  await testEndpoint('Website Security API', '/api/website-security');
  await testEndpoint('Alerts API', '/api/alerts');

  // ============================================
  // 2. AGENT SYSTEM TESTS
  // ============================================
  log.section('2. PLUTO AGENT SYSTEM');
  
  const agentStatus = await testEndpoint('Agent Status', '/api/agent?info=status');
  if (agentStatus.success) {
    log.info(`  Provider: ${agentStatus.data.provider?.current || 'unknown'}`);
    log.info(`  Groq Configured: ${agentStatus.data.provider?.groqConfigured ? 'YES' : 'NO'}`);
    log.info(`  Agent Mode: ${agentStatus.data.status?.mode || 'unknown'}`);
  }

  const agentTools = await testEndpoint('Agent Tools', '/api/agent?info=tools');
  if (agentTools.success) {
    log.info(`  Available Tools: ${agentTools.data.count || 0}`);
  }

  const agentCapabilities = await testEndpoint('Agent Capabilities', '/api/agent?info=capabilities');
  if (agentCapabilities.success) {
    log.info(`  AI Provider: ${agentCapabilities.data.ai_provider || 'unknown'}`);
  }

  // ============================================
  // 3. GROQ AI INTEGRATION TEST
  // ============================================
  log.section('3. GROQ AI INTEGRATION');
  
  log.info('Testing Groq AI with sample threat analysis...');
  const aiTest = await testEndpoint(
    'Groq AI Analysis',
    '/api/agent',
    'POST',
    {
      action: 'ask_agent',
      data: { query: 'Is IP address 192.168.1.1 safe?' }
    }
  );
  
  if (aiTest.success) {
    log.success('Groq AI is responding correctly');
    log.info(`  Response: ${aiTest.data.response?.substring(0, 100)}...`);
    log.info(`  Confidence: ${(aiTest.data.confidence * 100).toFixed(1)}%`);
  } else {
    log.error('Groq AI test failed - Check your GROQ_API_KEY in .env');
  }

  // ============================================
  // 4. AGENT DECISION MAKING TEST
  // ============================================
  log.section('4. AGENT DECISION MAKING');
  
  log.info('Testing agent autonomous decision making...');
  const decisionTest = await testEndpoint(
    'Agent Decision Cycle',
    '/api/agent',
    'POST',
    {
      action: 'run_cycle',
      data: {
        type: 'traffic',
        input: {
          ip: '45.33.22.11',
          port: 22,
          protocol: 'TCP',
          requestCount: 150,
          riskScore: 85
        },
        source: 'health_check'
      }
    }
  );
  
  if (decisionTest.success) {
    const result = decisionTest.data.agent_result;
    log.success('Agent decision cycle completed');
    log.info(`  Threat: ${result.threat}`);
    log.info(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    log.info(`  Action: ${result.action}`);
    log.info(`  Tool Used: ${result.toolUsed || 'none'}`);
  }

  // ============================================
  // 5. TRAFFIC SIMULATION TEST
  // ============================================
  log.section('5. TRAFFIC LOGGING');
  
  log.info('Simulating traffic entry...');
  const trafficTest = await testEndpoint(
    'Traffic Logging',
    '/api/traffic',
    'POST',
    {
      ip: '192.168.1.100',
      port: 443,
      protocol: 'HTTPS',
      requestCount: 5,
      source: 'health_check'
    }
  );
  
  if (trafficTest.success) {
    log.success('Traffic logging working');
    log.info(`  Entry ID: ${trafficTest.data.id}`);
    log.info(`  Risk Score: ${trafficTest.data.data?.riskScore || 'N/A'}`);
  }

  // ============================================
  // 6. SANDBOX SCANNER TEST
  // ============================================
  log.section('6. SANDBOX SCANNER');
  
  log.info('Testing sandbox scanner with safe URL...');
  const sandboxTest = await testEndpoint(
    'Sandbox Scanner',
    '/api/sandbox-scan',
    'POST',
    { url: 'https://example.com' }
  );
  
  if (sandboxTest.success) {
    log.success('Sandbox scanner operational');
    log.info(`  Domain: ${sandboxTest.data.result?.domain || 'N/A'}`);
    log.info(`  Risk Score: ${sandboxTest.data.result?.riskScore || 'N/A'}`);
    log.info(`  Security Score: ${sandboxTest.data.result?.securityScore || 'N/A'}`);
  }

  // ============================================
  // 7. ENVIRONMENT CHECK
  // ============================================
  log.section('7. ENVIRONMENT CONFIGURATION');
  
  const envChecks = [
    { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY, required: true },
    { name: 'AI_PROVIDER', value: process.env.AI_PROVIDER, required: true },
    { name: 'AGENT_MODE', value: process.env.AGENT_MODE, required: false },
    { name: 'NEXT_PUBLIC_BASE_URL', value: process.env.NEXT_PUBLIC_BASE_URL, required: false }
  ];

  envChecks.forEach(check => {
    if (check.value) {
      log.success(`${check.name}: ${check.name.includes('KEY') ? '***' + check.value.slice(-4) : check.value}`);
    } else if (check.required) {
      log.error(`${check.name}: NOT SET (REQUIRED)`);
      TESTS_FAILED.push(`ENV: ${check.name}`);
    } else {
      log.warn(`${check.name}: Not set (optional)`);
    }
  });

  // ============================================
  // FINAL REPORT
  // ============================================
  log.section('TEST SUMMARY');
  
  console.log(chalk.green.bold(`\n✓ Tests Passed: ${TESTS_PASSED.length}`));
  console.log(chalk.red.bold(`✗ Tests Failed: ${TESTS_FAILED.length}\n`));

  if (TESTS_FAILED.length > 0) {
    console.log(chalk.red('Failed Tests:'));
    TESTS_FAILED.forEach(test => console.log(chalk.red(`  - ${test}`)));
    console.log();
  }

  const healthScore = Math.round((TESTS_PASSED.length / (TESTS_PASSED.length + TESTS_FAILED.length)) * 100);
  
  console.log(chalk.cyan.bold(`\n╔══════════════════════════════════════════════════════════════╗`));
  console.log(chalk.cyan.bold(`║  SYSTEM HEALTH: ${healthScore}%${' '.repeat(48 - healthScore.toString().length)}║`));
  console.log(chalk.cyan.bold(`╚══════════════════════════════════════════════════════════════╝\n`));

  if (healthScore >= 80) {
    console.log(chalk.green.bold('🎉 PLUTO is fully operational!\n'));
  } else if (healthScore >= 60) {
    console.log(chalk.yellow.bold('⚠️  PLUTO is partially operational - some features may not work\n'));
  } else {
    console.log(chalk.red.bold('❌ PLUTO has critical issues - please check the errors above\n'));
  }

  process.exit(TESTS_FAILED.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
