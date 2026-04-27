// ============================================================
// PLUTO AI CLIENT - Provider-Agnostic AI Interface
// Currently uses Groq, designed for easy Gemini replacement
// ============================================================

import Groq from 'groq-sdk';

const PROVIDER = process.env.AI_PROVIDER || 'groq';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ThreatAnalysis {
  threat: string;
  confidence: number;
  reasoning: string[];
  riskScore: number;
  attackType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recommendations?: string[];
}

// ============================================
// MAIN AI ANALYSIS FUNCTION
// ============================================
export async function analyzeThreat(input: any): Promise<ThreatAnalysis> {
  if (PROVIDER === 'groq') {
    return analyzeWithGroq(input);
  } else if (PROVIDER === 'gemini') {
    return analyzeWithGemini(input);
  } else {
    throw new Error(`Unsupported AI provider: ${PROVIDER}`);
  }
}

// ============================================
// GROQ IMPLEMENTATION (CURRENT)
// ============================================
async function analyzeWithGroq(input: any): Promise<ThreatAnalysis> {
  try {
    const prompt = buildAnalysisPrompt(input);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are PLUTO, an autonomous cyber defense agent. Analyze security data and provide structured threat assessment.

RESPONSE FORMAT (JSON only):
{
  "threat": "Brief threat description",
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "riskScore": 0-100,
  "attackType": "DDoS|Brute Force|Port Scan|Bot Traffic|Phishing|Malware|Unknown",
  "severity": "low|medium|high|critical",
  "recommendations": ["action1", "action2"]
}

Be decisive and precise. Focus on actionable intelligence.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq');
    }

    // Parse JSON response
    const analysis = JSON.parse(response);
    
    // Validate and normalize
    return {
      threat: analysis.threat || 'Unknown threat',
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0)),
      reasoning: Array.isArray(analysis.reasoning) ? analysis.reasoning : ['AI analysis completed'],
      riskScore: Math.max(0, Math.min(100, analysis.riskScore || 0)),
      attackType: analysis.attackType || 'Unknown',
      severity: analysis.severity || 'medium',
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : []
    };
    
  } catch (error) {
    console.error('Groq analysis error:', error);
    
    // Fallback analysis
    return {
      threat: 'Analysis error',
      confidence: 0,
      reasoning: ['AI analysis failed, using fallback assessment'],
      riskScore: calculateFallbackRisk(input),
      attackType: 'Unknown',
      severity: 'medium'
    };
  }
}

// ============================================
// GEMINI IMPLEMENTATION (FUTURE)
// ============================================
async function analyzeWithGemini(input: any): Promise<ThreatAnalysis> {
  // TODO: Implement Gemini integration
  // This will be plug-and-play replacement for Groq
  
  throw new Error('Gemini provider not yet implemented');
  
  // Future implementation:
  // const { GoogleGenerativeAI } = require('@google/generative-ai');
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  // ... similar implementation to Groq
}

// ============================================
// PROMPT BUILDER
// ============================================
function buildAnalysisPrompt(input: any): string {
  let prompt = 'SECURITY DATA ANALYSIS REQUEST:\n\n';
  
  if (input.type === 'network_traffic') {
    prompt += `NETWORK TRAFFIC:
- IP Address: ${input.ip}
- Port: ${input.port}
- Protocol: ${input.protocol}
- Request Count: ${input.requestCount}
- Source: ${input.source}
- Timestamp: ${input.timestamp}

Analyze this network traffic for potential security threats.`;
  
  } else if (input.type === 'website_scan') {
    prompt += `WEBSITE SCAN:
- Domain: ${input.domain}
- URL: ${input.url}
- Security Score: ${input.securityScore}
- Risk Score: ${input.riskScore}
- Threats: ${JSON.stringify(input.threats)}
- Source: ${input.source}

Analyze this website scan for security risks.`;
  
  } else if (input.type === 'security_alert') {
    prompt += `SECURITY ALERT:
- Severity: ${input.severity}
- Attack Type: ${input.attackType}
- IP: ${input.ip || 'N/A'}
- Domain: ${input.domain || 'N/A'}
- Risk Score: ${input.riskScore}
- Source: ${input.source}

Analyze this security alert and recommend actions.`;
  
  } else if (input.type === 'manual_query') {
    prompt += `MANUAL QUERY:
- Query: ${input.query}
- Context: ${JSON.stringify(input.context)}
- Source: ${input.source}

Analyze this security query and provide assessment.`;
  
  } else {
    prompt += `UNKNOWN DATA TYPE:
${JSON.stringify(input, null, 2)}

Analyze this data for potential security implications.`;
  }
  
  return prompt;
}

// ============================================
// FALLBACK RISK CALCULATION
// ============================================
function calculateFallbackRisk(input: any): number {
  let risk = 0;
  
  if (input.type === 'network_traffic') {
    if (input.requestCount > 100) risk += 40;
    if (input.port && [22, 23, 445, 3389].includes(input.port)) risk += 30;
    if (input.ip && input.ip.startsWith('45.33.')) risk += 50; // Known malicious range
  }
  
  if (input.type === 'website_scan') {
    risk = input.riskScore || 0;
  }
  
  if (input.type === 'security_alert') {
    risk = input.riskScore || 50;
  }
  
  return Math.max(0, Math.min(100, risk));
}

// ============================================
// PROVIDER UTILITIES
// ============================================
export function getCurrentProvider(): string {
  return PROVIDER;
}

export function switchProvider(provider: 'groq' | 'gemini'): void {
  process.env.AI_PROVIDER = provider;
}

export function getProviderStatus() {
  return {
    current: PROVIDER,
    available: ['groq', 'gemini'],
    groqConfigured: !!process.env.GROQ_API_KEY,
    geminiConfigured: !!process.env.GEMINI_API_KEY
  };
}

// Export the client interface
export const aiClient = {
  analyzeThreat,
  getCurrentProvider,
  switchProvider,
  getProviderStatus
};