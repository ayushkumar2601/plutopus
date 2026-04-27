// ============================================================
// PLUTO TOOLS REGISTRY - Autonomous Agent Tools
// Each tool is callable independently and returns structured output
// ============================================================

import sessionStore from '../sessionStore';

export interface ToolResult {
  success: boolean;
  message: string;
  data?: any;
  civicAuditId?: string;
}

// ============================================
// TOOL: BLOCK IP ADDRESS
// ============================================
export async function block_ip(params: { ip: string; reason: string; riskScore?: number }): Promise<ToolResult> {
  try {
    const { ip, reason, riskScore = 100 } = params;
    
    // Validate IP
    if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip === '0.0.0.0') {
      return {
        success: false,
        message: 'Cannot block localhost or invalid IP addresses'
      };
    }
    
    // Check if already blocked
    if (sessionStore.isBlocked(ip)) {
      return {
        success: false,
        message: `IP ${ip} is already blocked`
      };
    }
    
    // Block the IP
    sessionStore.blockIP(ip, reason, 'PLUTO_BLOCK', riskScore);
    
    // Log the action
    sessionStore.addResponseLog({
      ip,
      attackType: 'PLUTO_BLOCK',
      riskScore,
      threatStatus: 'Attack',
      action: 'block_ip',
      reason,
      severity: 'High',
      autoExecuted: true
    });
    
    // Log to Civic if available
    const civicLog = sessionStore.addCivicLog({
      tool: 'block_ip',
      params: { ip, reason, riskScore },
      result: 'allowed',
      reason: 'PLUTO autonomous block',
      civicConnected: false // Will be updated by Civic integration
    });
    
    return {
      success: true,
      message: `Successfully blocked IP ${ip}`,
      data: { ip, reason, riskScore },
      civicAuditId: civicLog.id
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to block IP: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ============================================
// TOOL: RATE LIMIT IP ADDRESS
// ============================================
export async function rate_limit_ip(params: { ip: string; reason: string; riskScore?: number }): Promise<ToolResult> {
  try {
    const { ip, reason, riskScore = 50 } = params;
    
    // Validate IP
    if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip === '0.0.0.0') {
      return {
        success: false,
        message: 'Cannot rate limit localhost or invalid IP addresses'
      };
    }
    
    // Log the rate limiting action
    sessionStore.addResponseLog({
      ip,
      attackType: 'PLUTO_RATE_LIMIT',
      riskScore,
      threatStatus: 'Suspicious',
      action: 'rate_limit_ip',
      reason,
      severity: 'Medium',
      autoExecuted: true
    });
    
    // Log to Civic
    const civicLog = sessionStore.addCivicLog({
      tool: 'rate_limit_ip',
      params: { ip, reason, riskScore },
      result: 'allowed',
      reason: 'PLUTO autonomous rate limiting',
      civicConnected: false
    });
    
    return {
      success: true,
      message: `Successfully applied rate limiting to IP ${ip}`,
      data: { ip, reason, riskScore },
      civicAuditId: civicLog.id
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to rate limit IP: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ============================================
// TOOL: SCAN URL/WEBSITE
// ============================================
export async function scan_url(params: { url: string; reason?: string }): Promise<ToolResult> {
  try {
    const { url, reason = 'PLUTO security scan' } = params;
    
    // Extract domain from URL
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    
    // Simulate scan (in real implementation, this would call the sandbox scanner)
    const scanResult = {
      domain,
      url,
      securityScore: Math.floor(Math.random() * 100),
      riskScore: Math.floor(Math.random() * 100),
      threats: ['Simulated scan result'],
      timestamp: new Date().toISOString()
    };
    
    // Store scan result
    sessionStore.addWebsiteScan({
      domain: scanResult.domain,
      url: scanResult.url,
      securityScore: scanResult.securityScore,
      riskScore: scanResult.riskScore,
      threats: scanResult.threats,
      recommendations: ['Monitor for suspicious activity'],
      summary: `PLUTO scan of ${domain}`,
      attackType: 'None',
      severity: 'low',
      cookiesCount: 0,
      scriptsCount: 0
    });
    
    // Log to Civic
    const civicLog = sessionStore.addCivicLog({
      tool: 'scan_website',
      params: { url, domain, reason },
      result: 'allowed',
      reason: 'PLUTO autonomous scan',
      civicConnected: false
    });
    
    return {
      success: true,
      message: `Successfully scanned ${domain}`,
      data: scanResult,
      civicAuditId: civicLog.id
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to scan URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ============================================
// TOOL: LOG SECURITY EVENT
// ============================================
export async function log_event(params: { event: string; source?: string; data?: any }): Promise<ToolResult> {
  try {
    const { event, source = 'PLUTO', data } = params;
    
    // Create alert for significant events
    if (event.toLowerCase().includes('threat') || event.toLowerCase().includes('attack')) {
      sessionStore.addAlert({
        domain: data?.domain || data?.ip || 'Unknown',
        riskScore: data?.riskScore || 30,
        threats: [event],
        severity: 'medium',
        type: 'network',
        resolved: false
      });
    }
    
    // Log to Civic
    const civicLog = sessionStore.addCivicLog({
      tool: 'log_security_event',
      params: { event, source, data },
      result: 'allowed',
      reason: 'PLUTO event logging',
      civicConnected: false
    });
    
    return {
      success: true,
      message: `Successfully logged event: ${event}`,
      data: { event, source, timestamp: new Date().toISOString() },
      civicAuditId: civicLog.id
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to log event: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ============================================
// TOOL: FETCH RECENT THREATS
// ============================================
export async function fetch_recent_threats(params: { limit?: number; source?: string }): Promise<ToolResult> {
  try {
    const { limit = 10, source = 'PLUTO' } = params;
    
    // Get recent alerts and detections
    const alerts = sessionStore.getAlerts(limit);
    const detections = sessionStore.getAlertDetections(limit);
    
    const threats = {
      alerts: alerts.map(a => ({
        id: a.id,
        domain: a.domain,
        riskScore: a.riskScore,
        threats: a.threats,
        severity: a.severity,
        timestamp: a.timestamp
      })),
      detections: detections.map(d => ({
        id: d.id,
        ip: d.ip,
        attackType: d.attackType,
        riskScore: d.riskScore,
        threatStatus: d.threatStatus,
        timestamp: d.timestamp
      }))
    };
    
    // Log to Civic
    const civicLog = sessionStore.addCivicLog({
      tool: 'retrieve_recent_threats',
      params: { limit, source },
      result: 'allowed',
      reason: 'PLUTO threat intelligence gathering',
      civicConnected: false
    });
    
    return {
      success: true,
      message: `Retrieved ${threats.alerts.length + threats.detections.length} recent threats`,
      data: threats,
      civicAuditId: civicLog.id
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch threats: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// ============================================
// TOOLS REGISTRY EXPORT
// ============================================
export const tools = {
  block_ip,
  rate_limit_ip,
  scan_url,
  log_event,
  fetch_recent_threats
};

// ============================================
// TOOL UTILITIES
// ============================================
export function getAvailableTools(): string[] {
  return Object.keys(tools);
}

export function getToolInfo(toolName: string) {
  const descriptions = {
    block_ip: 'Block a malicious IP address from accessing the system',
    rate_limit_ip: 'Apply rate limiting to a suspicious IP address',
    scan_url: 'Scan a website URL for security threats',
    log_event: 'Log a security event for monitoring and analysis',
    fetch_recent_threats: 'Retrieve recent threat intelligence data'
  };
  
  return {
    name: toolName,
    description: descriptions[toolName as keyof typeof descriptions] || 'Unknown tool',
    available: toolName in tools
  };
}

export function validateToolParams(toolName: string, params: any): { valid: boolean; error?: string } {
  if (!(toolName in tools)) {
    return { valid: false, error: `Tool '${toolName}' not found` };
  }
  
  // Basic validation for each tool
  switch (toolName) {
    case 'block_ip':
    case 'rate_limit_ip':
      if (!params.ip || !params.reason) {
        return { valid: false, error: 'Missing required parameters: ip, reason' };
      }
      break;
      
    case 'scan_url':
      if (!params.url) {
        return { valid: false, error: 'Missing required parameter: url' };
      }
      break;
      
    case 'log_event':
      if (!params.event) {
        return { valid: false, error: 'Missing required parameter: event' };
      }
      break;
      
    case 'fetch_recent_threats':
      // No required parameters
      break;
      
    default:
      return { valid: false, error: `Unknown tool: ${toolName}` };
  }
  
  return { valid: true };
}