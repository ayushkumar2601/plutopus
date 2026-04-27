// ============================================================
// PLUTO AGENT API - Direct Agent Interface
// Allows manual interaction with the autonomous agent
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { runAgentCycle, getAgentStatus, getAgentMemory, clearAgentMemory } from '@/lib/agent/sentinelAgent';
import { aiClient } from '@/lib/agent/aiClient';
import { tools, getAvailableTools, getToolInfo } from '@/lib/agent/tools';
import { memory } from '@/lib/agent/memory';

// ============================================
// POST - Run Agent Cycle
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'run_cycle':
        const result = await runAgentCycle({
          type: data.type || 'manual',
          data: data.input || {},
          source: data.source || 'api',
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({
          success: true,
          agent_result: result,
          timestamp: new Date().toISOString()
        });

      case 'ask_agent':
        const query = data.query;
        if (!query) {
          return NextResponse.json({
            success: false,
            message: 'Query is required for ask_agent action'
          }, { status: 400 });
        }

        const askResult = await runAgentCycle({
          type: 'manual',
          data: { query, context: data.context },
          source: 'user_query',
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          response: askResult.reasoning.join(' '),
          confidence: askResult.confidence,
          agent_result: askResult
        });

      case 'simulate_attack':
        // Simulate an attack and let agent respond
        const simulatedAttack = {
          ip: '45.33.22.11', // Known malicious IP
          port: 22,
          protocol: 'TCP',
          requestCount: 150,
          attackType: 'Brute Force',
          riskScore: 85
        };

        const simulateResult = await runAgentCycle({
          type: 'traffic',
          data: simulatedAttack,
          source: 'attack_simulator',
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          simulation: simulatedAttack,
          agent_response: simulateResult
        });

      case 'clear_memory':
        clearAgentMemory();
        return NextResponse.json({
          success: true,
          message: 'Agent memory cleared'
        });

      default:
        return NextResponse.json({
          success: false,
          message: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ============================================
// GET - Agent Status and Information
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const info = searchParams.get('info');

    switch (info) {
      case 'status':
        return NextResponse.json({
          success: true,
          status: getAgentStatus(),
          provider: aiClient.getProviderStatus()
        });

      case 'memory':
        const limit = parseInt(searchParams.get('limit') || '10');
        return NextResponse.json({
          success: true,
          memory: getAgentMemory(limit),
          stats: memory.getStats(),
          patterns: memory.getPatterns()
        });

      case 'tools':
        const availableTools = getAvailableTools();
        const toolsInfo = availableTools.map(tool => getToolInfo(tool));
        return NextResponse.json({
          success: true,
          tools: toolsInfo,
          count: availableTools.length
        });

      case 'capabilities':
        return NextResponse.json({
          success: true,
          capabilities: {
            autonomous_decision_making: true,
            real_time_threat_analysis: true,
            tool_execution: true,
            memory_and_learning: true,
            explainable_ai: true,
            provider_agnostic: true,
            civic_integration: true
          },
          current_mode: process.env.AGENT_MODE || 'dev',
          ai_provider: aiClient.getCurrentProvider()
        });

      default:
        // Default: return comprehensive agent info
        return NextResponse.json({
          success: true,
          agent: {
            name: 'PLUTO',
            version: '1.0.0',
            description: 'Autonomous Cyber Defense Agent',
            status: getAgentStatus(),
            memory_stats: memory.getStats(),
            available_tools: getAvailableTools(),
            ai_provider: aiClient.getCurrentProvider(),
            mode: process.env.AGENT_MODE || 'dev'
          }
        });
    }

  } catch (error) {
    console.error('Agent GET error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}