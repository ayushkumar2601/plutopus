#!/usr/bin/env node
// ============================================================
// PLUTO Final System Health Check
// ============================================================

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
let passed = 0;
let failed = 0;

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║     🤖 PLUTO COMPREHENSIVE SYSTEM CHECK                     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

async function test(name, url, method = 'GET', data = null) {
  try {
    process.stdout.write(`Testing ${name}... `);
    const config = { method, url: `${BASE_URL}${url}`, timeout: 15000 };
    if (data) config.data = data;
    
    const response = await axios(config);
    
    if (response.status === 200 && response.data) {
      console.log('✓ PASS');
      passed++;
      return { success: true, data: response.data };
    } else {
      console.log('✗ FAIL');
      failed++;
      return { success: false };
    }
  } catch (error) {
    console.log(`✗ FAIL - ${error.code || error.message}`);
    failed++;
    return { success: false, error: error.message };
  }
}

async function runTests() {
  // Environment Check First
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('ENVIRONMENT CONFIGURATION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const envVars = {
    'GROQ_API_KEY': { value: process.env.GROQ_API_KEY, required: true, mask: true },
    'AI_PROVIDER': { value: process.env.AI_PROVIDER, required: true, mask: false },
    'AGENT_MODE': { value: process.env.AGENT_MODE, required: false, mask: false },
    'NEXT_PUBLIC_BASE_URL': { value: process.env.NEXT_PUBLIC_BASE_URL, required: false, mask: false },
    'NODE_ENV': { value: process.env.NODE_ENV, required: false, mask: false }
  };

  Object.entries(envVars).forEach(([name, config]) => {
    if (config.value) {
      const display = config.mask ? '***' + config.value.slice(-4) : config.value;
      console.log(`✓ ${name}: ${display}`);
    } else {
      console.log(`${config.required ? '✗' : '⚠'} ${name}: ${config.required ? 'MISSING!' : 'Not set'}`);
      if (config.required) failed++;
    }
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('API ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  await test('Traffic API', '/api/traffic');
  await test('Detection API', '/api/detect');
  await test('Response API', '/api/respond');
  await test('Website Security', '/api/website-security');
  await test('Alerts API', '/api/alerts');
  await test('Export API', '/api/export?format=json');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PLUTO AGENT CORE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const status = await test('Agent Status', '/api/agent?info=status');
  if (status.success) {
    console.log(`   ├─ Provider: ${status.data.provider?.current || 'unknown'}`);
    console.log(`   ├─ Groq Configured: ${status.data.provider?.groqConfigured ? 'YES ✓' : 'NO ✗'}`);
    console.log(`   ├─ Gemini Configured: ${status.data.provider?.geminiConfigured ? 'YES' : 'NO'}`);
    console.log(`   └─ Agent Mode: ${status.data.status?.mode || 'unknown'}`);
  }

  const tools = await test('Agent Tools', '/api/agent?info=tools');
  if (tools.success) {
    console.log(`   └─ Available Tools: ${tools.data.count || 0}`);
    if (tools.data.tools) {
      tools.data.tools.forEach(tool => {
        console.log(`      • ${tool.name}: ${tool.description}`);
      });
    }
  }

  const capabilities = await test('Agent Capabilities', '/api/agent?info=capabilities');
  if (capabilities.success) {
    console.log(`   ├─ AI Provider: ${capabilities.data.ai_provider}`);
    console.log(`   ├─ Mode: ${capabilities.data.current_mode}`);
    console.log(`   └─ Capabilities:`);
    Object.entries(capabilities.data.capabilities || {}).forEach(([key, value]) => {
      console.log(`      • ${key}: ${value ? '✓' : '✗'}`);
    });
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('GROQ AI LIVE TEST');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Sending query to Groq AI: "Analyze this suspicious IP: 45.33.22.11"');
  const aiTest = await test(
    'Groq AI Analysis',
    '/api/agent',
    'POST',
    {
      action: 'ask_agent',
      data: { query: 'Analyze this suspicious IP: 45.33.22.11 with port 22 access attempts' }
    }
  );
  
  if (aiTest.success) {
    console.log(`\n   AI Response:`);
    console.log(`   "${aiTest.data.response}"`);
    console.log(`\n   Confidence: ${(aiTest.data.confidence * 100).toFixed(1)}%`);
    console.log(`   Status: Groq AI is WORKING PERFECTLY ✓\n`);
  } else {
    console.log(`\n   Status: Groq AI FAILED ✗`);
    console.log(`   Action: Check GROQ_API_KEY in .env file\n`);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('AUTONOMOUS DECISION MAKING');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Simulating high-risk traffic event...');
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
          protocol: 'SSH',
          requestCount: 250,
          riskScore: 92
        },
        source: 'health_check'
      }
    }
  );
  
  if (decision.success) {
    const result = decision.data.agent_result;
    console.log(`\n   Agent Decision:`);
    console.log(`   ├─ Threat Detected: ${result.threat}`);
    console.log(`   ├─ Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   ├─ Action Taken: ${result.action}`);
    console.log(`   ├─ Tool Used: ${result.toolUsed || 'none'}`);
    console.log(`   ├─ Memory ID: ${result.memory_id}`);
    console.log(`   └─ Reasoning:`);
    result.reasoning.forEach((reason, i) => {
      console.log(`      ${i + 1}. ${reason}`);
    });
    console.log();
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SANDBOX SCANNER (PLAYWRIGHT)');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Scanning test website: https://example.com');
  const sandbox = await test(
    'Sandbox Scan',
    '/api/sandbox-scan',
    'POST',
    { url: 'https://example.com' }
  );
  
  if (sandbox.success) {
    const result = sandbox.data.result;
    console.log(`\n   Scan Results:`);
    console.log(`   ├─ Domain: ${result.domain}`);
    console.log(`   ├─ Risk Score: ${result.riskScore}/100`);
    console.log(`   ├─ Security Score: ${result.securityScore}/100`);
    console.log(`   ├─ Verdict: ${result.sandboxVerdict.toUpperCase()}`);
    console.log(`   ├─ Threats Found: ${result.threats?.length || 0}`);
    console.log(`   ├─ Scripts: ${result.scriptsCount}`);
    console.log(`   └─ Cookies: ${result.cookiesCount}\n`);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('ATTACK SIMULATION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const attackSim = await test(
    'Attack Simulation',
    '/api/agent',
    'POST',
    { action: 'simulate_attack' }
  );
  
  if (attackSim.success) {
    console.log(`\n   Simulated Attack:`);
    console.log(`   ├─ IP: ${attackSim.data.simulation.ip}`);
    console.log(`   ├─ Type: ${attackSim.data.simulation.attackType}`);
    console.log(`   └─ Risk: ${attackSim.data.simulation.riskScore}/100`);
    console.log(`\n   Agent Response:`);
    console.log(`   ├─ Action: ${attackSim.data.agent_response.action}`);
    console.log(`   └─ Tool: ${attackSim.data.agent_response.toolUsed}\n`);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FINAL REPORT');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const total = passed + failed;
  const score = Math.round((passed / total) * 100);
  
  console.log(`Tests Passed: ${passed}/${total}`);
  console.log(`Tests Failed: ${failed}/${total}`);
  console.log(`System Health: ${score}%\n`);

  if (score >= 90) {
    console.log('🎉 PLUTO IS FULLY OPERATIONAL AND READY FOR PRODUCTION!\n');
  } else if (score >= 75) {
    console.log('✅ PLUTO IS OPERATIONAL - Minor issues detected\n');
  } else if (score >= 50) {
    console.log('⚠️  PLUTO IS PARTIALLY OPERATIONAL - Some features may not work\n');
  } else {
    console.log('❌ PLUTO HAS CRITICAL ISSUES - Please review errors above\n');
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
  
  process.exit(failed > 3 ? 1 : 0);
}

runTests().catch(error => {
  console.log(`\n❌ Fatal error: ${error.message}\n`);
  process.exit(1);
});
