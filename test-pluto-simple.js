#!/usr/bin/env node
// ============================================================
// PLUTO Simple System Health Check
// Tests all critical components
// ============================================================

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let passed = 0;
let failed = 0;

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║     🤖 PLUTO SYSTEM HEALTH CHECK                            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

async function test(name, url, method = 'GET', data = null) {
  try {
    process.stdout.write(`Testing ${name}... `);
    const config = { method, url: `${BASE_URL}${url}`, timeout: 10000 };
    if (data) config.data = data;
    
    const response = await axios(config);
    
    if (response.status === 200 && response.data) {
      console.log('✓ PASS');
      passed++;
      return { success: true, data: response.data };
    } else {
      console.log('✗ FAIL - Unexpected response');
      failed++;
      return { success: false };
    }
  } catch (error) {
    console.log(`✗ FAIL - ${error.message}`);
    failed++;
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('1. BASIC API ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  await test('Traffic API', '/api/traffic');
  await test('Detection API', '/api/detect');
  await test('Response API', '/api/respond');
  await test('Website Security', '/api/website-security');
  await test('Alerts API', '/api/alerts');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('2. PLUTO AGENT SYSTEM');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const status = await test('Agent Status', '/api/agent?info=status');
  if (status.success) {
    console.log(`   → Provider: ${status.data.provider?.current || 'unknown'}`);
    console.log(`   → Groq Key: ${status.data.provider?.groqConfigured ? 'CONFIGURED ✓' : 'MISSING ✗'}`);
    console.log(`   → Mode: ${status.data.status?.mode || 'unknown'}`);
  }

  const tools = await test('Agent Tools', '/api/agent?info=tools');
  if (tools.success) {
    console.log(`   → Available Tools: ${tools.data.count || 0}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('3. GROQ AI INTEGRATION TEST');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const aiTest = await test(
    'Groq AI Query',
    '/api/agent',
    'POST',
    {
      action: 'ask_agent',
      data: { query: 'Is IP 192.168.1.1 safe?' }
    }
  );
  
  if (aiTest.success) {
    console.log(`   → Response: ${aiTest.data.response?.substring(0, 80)}...`);
    console.log(`   → Confidence: ${(aiTest.data.confidence * 100).toFixed(1)}%`);
    console.log('   → Groq AI is WORKING ✓');
  } else {
    console.log('   → Groq AI FAILED - Check GROQ_API_KEY in .env ✗');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('4. AGENT DECISION MAKING');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const decision = await test(
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
  
  if (decision.success) {
    const result = decision.data.agent_result;
    console.log(`   → Threat: ${result.threat}`);
    console.log(`   → Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   → Action: ${result.action}`);
    console.log(`   → Tool: ${result.toolUsed || 'none'}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('5. TRAFFIC LOGGING');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const traffic = await test(
    'Traffic Entry',
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
  
  if (traffic.success) {
    console.log(`   → Entry ID: ${traffic.data.id}`);
    console.log(`   → Risk Score: ${traffic.data.data?.riskScore || 'N/A'}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('6. SANDBOX SCANNER');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const sandbox = await test(
    'Sandbox Scan',
    '/api/sandbox-scan',
    'POST',
    { url: 'https://example.com' }
  );
  
  if (sandbox.success) {
    console.log(`   → Domain: ${sandbox.data.result?.domain || 'N/A'}`);
    console.log(`   → Risk: ${sandbox.data.result?.riskScore || 'N/A'}`);
    console.log(`   → Security: ${sandbox.data.result?.securityScore || 'N/A'}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('7. ENVIRONMENT CHECK');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const checkEnv = (name, required = false) => {
    const value = process.env[name];
    if (value) {
      const display = name.includes('KEY') ? '***' + value.slice(-4) : value;
      console.log(`✓ ${name}: ${display}`);
      return true;
    } else {
      console.log(`${required ? '✗' : '⚠'} ${name}: ${required ? 'MISSING (REQUIRED)' : 'Not set (optional)'}`);
      if (required) failed++;
      return false;
    }
  };

  checkEnv('GROQ_API_KEY', true);
  checkEnv('AI_PROVIDER', true);
  checkEnv('AGENT_MODE', false);
  checkEnv('NEXT_PUBLIC_BASE_URL', false);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const total = passed + failed;
  const score = Math.round((passed / total) * 100);
  
  console.log(`✓ Tests Passed: ${passed}`);
  console.log(`✗ Tests Failed: ${failed}`);
  console.log(`\nSYSTEM HEALTH: ${score}%\n`);

  if (score >= 80) {
    console.log('🎉 PLUTO IS FULLY OPERATIONAL!\n');
  } else if (score >= 60) {
    console.log('⚠️  PLUTO IS PARTIALLY OPERATIONAL\n');
  } else {
    console.log('❌ PLUTO HAS CRITICAL ISSUES\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.log(`\n❌ Fatal error: ${error.message}\n`);
  process.exit(1);
});
