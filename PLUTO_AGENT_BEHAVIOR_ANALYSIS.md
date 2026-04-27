# PLUTO Agent Behavior Analysis
## Technical Report on Autonomous Decision-Making Implementation

---

## Executive Summary

PLUTO implements a **hybrid autonomous agent** with both AI-driven decision-making and rule-based fallbacks. The agent operates on a classic **Observe → Reason → Decide → Act → Memory** loop with structured tool execution and memory-based learning patterns.

**Key Finding**: PLUTO qualifies as a **semi-autonomous agent** rather than a fully autonomous one due to significant rule-based decision logic that overrides AI recommendations.

---

## 1. Core Agent Loop Implementation

### `runAgentCycle()` Step-by-Step Flow

```typescript
export async function runAgentCycle(input: AgentInput): Promise<AgentOutput> {
  // STEP 1: OBSERVE - Normalize input
  const observation = observeInput(input);
  
  // STEP 2: REASON - Call AI model for analysis  
  const analysis = await aiClient.analyzeThreat(observation);
  
  // STEP 3: DECIDE - Choose tool and action
  const decision = decideAction(analysis, observation);
  
  // STEP 4: ACT - Execute the chosen tool
  const result = await executeAction(decision);
  
  // STEP 5: MEMORY - Store the complete cycle
  const memoryId = memory.store({...});
  
  return AgentOutput;
}
```

### Execution Triggers

**Automatic (Reactive)**:
- Traffic monitoring: `POST /api/traffic` → triggers agent on `alertFlag: true`
- Sandbox scans: Website security analysis results
- System alerts: Security event detection

**Manual (On-Demand)**:
- API calls: `POST /api/agent` with various actions
- CLI commands: `npm run pluto -- agent-run`
- Dashboard button: "SIMULATE ATTACK + RUN AGENT"

---

## 2. AI Integration Analysis

### Where AI is Called

**Single AI Call Point**: `aiClient.analyzeThreat(observation)` in Step 2 (REASON)

```typescript
// lib/agent/aiClient.ts - analyzeWithGroq()
const completion = await groq.chat.completions.create({
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildAnalysisPrompt(input) }
  ],
  model: 'llama-3.3-70b-versatile',
  temperature: 0.1,
  max_tokens: 1000
});
```

### AI Response Format

**Expected JSON Structure**:
```json
{
  "threat": "Brief threat description",
  "confidence": 0.0-1.0,
  "reasoning": ["reason1", "reason2", "reason3"],
  "riskScore": 0-100,
  "attackType": "DDoS|Brute Force|Port Scan|Bot Traffic|Phishing|Malware|Unknown",
  "severity": "low|medium|high|critical",
  "recommendations": ["action1", "action2"]
}
```

### AI Response Parsing

**Robust Error Handling**:
- JSON parsing with fallback to rule-based analysis
- Confidence normalization: `Math.max(0, Math.min(1, analysis.confidence || 0))`
- Risk score clamping: `Math.max(0, Math.min(100, analysis.riskScore || 0))`
- Fallback risk calculation when AI fails

---

## 3. Tool Selection Logic

### ❌ **Critical Finding: Tool Selection is NOT AI-Driven**

Tool selection occurs in `decideAction()` function using **hard-coded conditional logic**, NOT AI output:

```typescript
function decideAction(analysis: any, observation: any): AgentDecision {
  const confidence = analysis.confidence || 0;
  const riskScore = analysis.riskScore || 0;
  
  // RULE 1: High confidence + high risk = block_ip
  if (confidence >= 0.8 && riskScore >= 70) {
    if (observation.type === 'network_traffic' && observation.ip) {
      return { action: 'block_ip', tool: 'block_ip', ... };
    }
  }
  
  // RULE 2: Medium confidence + medium risk = rate_limit_ip  
  if (confidence >= 0.6 && riskScore >= 50) {
    if (observation.type === 'network_traffic' && observation.ip) {
      return { action: 'rate_limit_ip', tool: 'rate_limit_ip', ... };
    }
  }
  
  // RULE 3: Website data = scan_url
  if (observation.type === 'website_scan' || observation.domain) {
    return { action: 'scan_url', tool: 'scan_url', ... };
  }
  
  // RULE 4: Default fallback = log_event
  return { action: 'log_event', tool: 'log_event', ... };
}
```

**Analysis**: The AI provides threat analysis, but tool selection is entirely rule-based. The AI's `recommendations` field is **ignored** in decision-making.

---

## 4. Memory System and Decision Influence

### Memory Storage Structure

```typescript
interface MemoryEntry {
  id: string;
  timestamp: string;
  input?: any;           // Original input data
  analysis?: any;        // AI analysis results  
  decision?: any;        // Tool selection decision
  result?: any;          // Execution outcome
  processingTime?: number;
  tags?: string[];       // Auto-generated tags
}
```

### Memory Analytics Available

- **Success/failure rates** by action type
- **Processing time patterns** by tool
- **Common input types** and frequencies  
- **Failure pattern analysis**
- **Auto-tagging** for searchability

### ❌ **Critical Finding: Memory Does NOT Influence Decisions**

**Current State**: Memory is purely **observational** - it stores past decisions but does not influence future ones.

**Missing Features**:
- No pattern-based decision adjustment
- No learning from past failures
- No confidence calibration based on historical accuracy
- No adaptive thresholds based on success rates

**Evidence**: The `decideAction()` function takes only `analysis` and `observation` parameters - no memory context is passed.

---

## 5. Autonomy Level Assessment

### Proactive vs Reactive Behavior

**Reactive (90%)**:
- Responds to incoming traffic alerts
- Processes sandbox scan results  
- Handles manual queries

**Proactive (10%)**:
- Limited to automatic traffic monitoring
- No predictive threat hunting
- No autonomous environment scanning

### Execution Triggers

**Automatic Triggers**:
```typescript
// Traffic monitoring - automatic on high-risk detection
if (result.alertFlag) {
  runAgentCycle({
    type: 'traffic',
    data: trafficData,
    source: 'traffic_monitor'
  });
}
```

**Manual Triggers**:
- API endpoints: `/api/agent` 
- CLI commands: `pluto agent-run`
- Dashboard interactions

---

## 6. Rule-Based Fallbacks and Overrides

### System Override Points

**1. IP Validation Override**:
```typescript
// tools.ts - block_ip()
if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip === '0.0.0.0') {
  return { success: false, message: 'Cannot block localhost or invalid IP addresses' };
}
```

**2. Duplicate Action Prevention**:
```typescript
if (sessionStore.isBlocked(ip)) {
  return { success: false, message: `IP ${ip} is already blocked` };
}
```

**3. Fallback Risk Calculation**:
```typescript
function calculateFallbackRisk(input: any): number {
  let risk = 0;
  if (input.requestCount > 100) risk += 40;
  if ([22, 23, 445, 3389].includes(input.port)) risk += 30;
  if (input.ip?.startsWith('45.33.')) risk += 50; // Known malicious range
  return Math.max(0, Math.min(100, risk));
}
```

**4. Tool Selection Override**:
The entire `decideAction()` function overrides any AI tool recommendations with hard-coded logic.

---

## 7. Agent Qualification Assessment

### ✅ **Qualifies as Agent**:
- **Autonomous execution loop**: Complete OODA cycle implementation
- **Environment interaction**: Reads traffic, executes tools, affects system state
- **Goal-oriented behavior**: Threat detection and response
- **Structured decision-making**: Consistent reasoning process

### ❌ **Limitations for "True" Autonomy**:

**1. Tool Selection Not AI-Driven**:
- AI provides analysis but cannot choose tools
- Hard-coded conditional logic overrides AI recommendations
- Limited to 4 predefined decision paths

**2. No Learning Integration**:
- Memory system exists but doesn't influence decisions
- No adaptation based on past success/failure
- Static decision thresholds

**3. Reactive Architecture**:
- Primarily responds to external events
- Limited proactive threat hunting
- No autonomous goal generation

**4. Rule-Based Constraints**:
- Multiple hard-coded safety overrides
- Predefined action mappings
- Limited decision flexibility

---

## 8. Risk Analysis

### Risks for Agent Classification

**1. **Deterministic Behavior**:
- Given identical inputs, agent will always make the same decision
- No randomness or exploration in decision-making
- Predictable response patterns

**2. **Limited Tool Repertoire**:
- Only 5 available tools: `block_ip`, `rate_limit_ip`, `scan_url`, `log_event`, `fetch_recent_threats`
- No dynamic tool discovery or creation
- Fixed capability set

**3. **AI as Analysis Engine Only**:
- AI doesn't drive decisions, only provides threat assessment
- Could be replaced with rule-based threat scoring
- Agent behavior wouldn't fundamentally change without AI

**4. **No Meta-Reasoning**:
- Cannot reason about its own decision-making process
- No self-modification capabilities
- No strategy adaptation

---

## 9. Recommendations for True Autonomy

### Immediate Improvements

**1. AI-Driven Tool Selection**:
```typescript
// Let AI choose tools based on context
const aiDecision = await aiClient.selectTool(analysis, availableTools, memoryContext);
```

**2. Memory-Influenced Decisions**:
```typescript
function decideAction(analysis, observation, memoryContext) {
  const historicalSuccess = memoryContext.getSuccessRate(analysis.attackType);
  const adaptedThreshold = baseThreshold * (1 + historicalSuccess);
  // Use adapted thresholds for decisions
}
```

**3. Proactive Behavior**:
- Autonomous threat hunting based on patterns
- Predictive analysis of system vulnerabilities
- Self-initiated security assessments

### Long-term Enhancements

**1. Meta-Learning**:
- Learn optimal decision thresholds from outcomes
- Adapt tool selection strategies based on success rates
- Dynamic confidence calibration

**2. Goal-Oriented Planning**:
- Multi-step action sequences
- Strategic threat response planning
- Resource optimization

**3. Self-Modification**:
- Dynamic tool creation based on new threat types
- Strategy evolution based on environment changes
- Autonomous capability expansion

---

## Conclusion

PLUTO implements a **sophisticated hybrid agent** with strong observability and structured decision-making, but falls short of true autonomy due to rule-based tool selection and lack of learning integration. 

**Current Classification**: **Semi-Autonomous Reactive Agent**

**Path to Full Autonomy**: Implement AI-driven tool selection, integrate memory-based learning, and add proactive behavior capabilities.

The foundation is solid - the agent architecture, memory system, and tool framework provide an excellent base for evolving toward true autonomous behavior.