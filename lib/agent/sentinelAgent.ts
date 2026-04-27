// ============================================================
// PLUTO SENTINEL AGENT - Core Autonomous AI Agent
// Observe → Reason → Decide → Act → Store Memory
// ============================================================

import { aiClient } from './aiClient';
import { tools } from './tools';
import { memory } from './memory';
import { AgentEvents } from './agentEvents';

export interface AgentInput {
  type: 'traffic' | 'sandbox' | 'alert' | 'manual';
  data: any;
  source: string;
  timestamp: string;
}

export interface AgentOutput {
  threat: string;
  confidence: number;
  reasoning: string[];
  action: string;
  toolUsed?: string;
  result?: any;
  memory_id: string;
}

export interface AgentDecision {
  action: string;
  tool: string;
  params: Record<string, any>;
  confidence: number;
  reasoning: string[];
}

// ============================================
// CORE AGENT LOOP
// ============================================
export async function runAgentCycle(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now();
  
  try {
    // STEP 1: OBSERVE - Normalize input
    AgentEvents.observe(`Incoming ${input.type} data from ${input.source}`, { inputType: input.type, source: input.source });
    const observation = observeInput(input);
    
    // STEP 2: REASON - Call AI model for analysis
    AgentEvents.reason(`Analyzing threat via ${aiClient.getCurrentProvider()} AI`, { provider: aiClient.getCurrentProvider() });
    const analysis = await aiClient.analyzeThreat(observation);
    
    // STEP 3: DECIDE - Choose tool and action
    const decision = decideAction(analysis, observation);
    AgentEvents.decide(`Selected tool: ${decision.tool} (confidence: ${(decision.confidence * 100).toFixed(1)}%)`, { 
      tool: decision.tool, 
      action: decision.action, 
      confidence: decision.confidence 
    });
    
    // STEP 4: ACT - Execute the chosen tool
    AgentEvents.act(`Executing ${decision.tool} with params`, { tool: decision.tool, params: decision.params });
    const result = await executeAction(decision);
    
    // STEP 5: MEMORY - Store the complete cycle
    const memoryId = memory.store({
      input: observation,
      analysis,
      decision,
      result,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
    AgentEvents.memory(`Stored decision in memory: ${memoryId}`, { memoryId, processingTime: Date.now() - startTime });
    
    return {
      threat: analysis.threat || 'Unknown',
      confidence: analysis.confidence || 0,
      reasoning: analysis.reasoning || [],
      action: decision.action,
      toolUsed: decision.tool,
      result,
      memory_id: memoryId
    };
    
  } catch (error) {
    console.error('PLUTO Agent Error:', error);
    AgentEvents.error(`Agent cycle failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
    
    // Store error in memory
    const memoryId = memory.store({
      input,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
    
    return {
      threat: 'Agent Error',
      confidence: 0,
      reasoning: ['Agent encountered an error during processing'],
      action: 'log_error',
      memory_id: memoryId
    };
  }
}

// ============================================
// OBSERVE - Normalize different input types
// ============================================
function observeInput(input: AgentInput): any {
  switch (input.type) {
    case 'traffic':
      return {
        type: 'network_traffic',
        ip: input.data.ip,
        port: input.data.port,
        protocol: input.data.protocol,
        requestCount: input.data.requestCount,
        timestamp: input.timestamp,
        source: input.source
      };
      
    case 'sandbox':
      return {
        type: 'website_scan',
        domain: input.data.domain,
        url: input.data.url,
        securityScore: input.data.securityScore,
        riskScore: input.data.riskScore,
        threats: input.data.threats,
        timestamp: input.timestamp,
        source: input.source
      };
      
    case 'alert':
      return {
        type: 'security_alert',
        severity: input.data.severity,
        attackType: input.data.attackType,
        ip: input.data.ip,
        domain: input.data.domain,
        riskScore: input.data.riskScore,
        timestamp: input.timestamp,
        source: input.source
      };
      
    case 'manual':
      return {
        type: 'manual_query',
        query: input.data.query,
        context: input.data.context,
        timestamp: input.timestamp,
        source: input.source
      };
      
    default:
      return {
        type: 'unknown',
        data: input.data,
        timestamp: input.timestamp,
        source: input.source
      };
  }
}

// ============================================
// DECIDE - Choose appropriate action and tool
// ============================================
function decideAction(analysis: any, observation: any): AgentDecision {
  const confidence = analysis.confidence || 0;
  const threat = analysis.threat || '';
  const riskScore = analysis.riskScore || 0;
  
  // High confidence threats - take immediate action
  if (confidence >= 0.8 && riskScore >= 70) {
    if (observation.type === 'network_traffic' && observation.ip) {
      return {
        action: 'block_ip',
        tool: 'block_ip',
        params: { 
          ip: observation.ip, 
          reason: threat,
          riskScore: riskScore
        },
        confidence,
        reasoning: analysis.reasoning || [`High confidence threat detected: ${threat}`]
      };
    }
  }
  
  // Medium confidence - rate limit
  if (confidence >= 0.6 && riskScore >= 50) {
    if (observation.type === 'network_traffic' && observation.ip) {
      return {
        action: 'rate_limit_ip',
        tool: 'rate_limit_ip',
        params: { 
          ip: observation.ip, 
          reason: threat,
          riskScore: riskScore
        },
        confidence,
        reasoning: analysis.reasoning || [`Medium confidence threat: ${threat}`]
      };
    }
  }
  
  // Website scanning
  if (observation.type === 'website_scan' || (observation.domain && !observation.ip)) {
    return {
      action: 'scan_url',
      tool: 'scan_url',
      params: { 
        url: observation.url || observation.domain,
        reason: 'Proactive security scan'
      },
      confidence,
      reasoning: analysis.reasoning || ['Scanning website for security threats']
    };
  }
  
  // Default action - log the event
  return {
    action: 'log_event',
    tool: 'log_event',
    params: {
      event: threat || 'Security event',
      source: observation.source || 'PLUTO',
      data: observation
    },
    confidence,
    reasoning: analysis.reasoning || ['Logging security event for monitoring']
  };
}

// ============================================
// ACT - Execute the chosen tool
// ============================================
async function executeAction(decision: AgentDecision): Promise<any> {
  const tool = tools[decision.tool as keyof typeof tools];
  
  if (!tool) {
    throw new Error(`Tool not found: ${decision.tool}`);
  }
  
  try {
    const result = await tool(decision.params as any);
    return {
      success: true,
      action: decision.action,
      tool: decision.tool,
      params: decision.params,
      result
    };
  } catch (error) {
    return {
      success: false,
      action: decision.action,
      tool: decision.tool,
      params: decision.params,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ============================================
// AGENT STATUS AND UTILITIES
// ============================================
export function getAgentStatus() {
  return {
    status: 'Active',
    mode: process.env.AGENT_MODE || 'dev',
    lastAction: memory.getLastAction(),
    memorySize: memory.getSize(),
    uptime: process.uptime()
  };
}

export function getAgentMemory(limit = 10) {
  return memory.getRecent(limit);
}

export function clearAgentMemory() {
  memory.clear();
}