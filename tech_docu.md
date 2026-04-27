# PLUTO - Technical Documentation

**PLUTO: Autonomous Cyber Defense Agent**  
*The complete technical bible for the PLUTO project*

---

## 🎯 Project Overview

PLUTO is an autonomous cyber defense agent that has evolved from AI-NMS (Agentic AI Network Monitoring System). The transformation focuses on creating a true autonomous AI agent that observes, reasons, decides, and acts independently to secure digital environments.

### Core Philosophy
- **Agent-First**: PLUTO is a single intelligent agent, not a collection of tools
- **Autonomous**: Makes decisions and takes actions without human intervention
- **Explainable**: Every decision includes confidence scores and reasoning
- **Plug-and-Play AI**: Currently uses Groq, designed for easy Gemini replacement

---

## 🏗️ Architecture Overview

### Agent Loop System (Core Innovation)
```
OBSERVE → REASON → DECIDE → ACT → STORE MEMORY
```

**Location**: `/lib/agent/sentinelAgent.ts`

The agent operates in continuous cycles:
1. **OBSERVE**: Normalize input from various sources (traffic, sandbox, alerts)
2. **REASON**: Call AI model (Groq/Gemini) for threat analysis
3. **DECIDE**: Choose appropriate tool and action based on analysis
4. **ACT**: Execute the chosen tool
5. **MEMORY**: Store the complete cycle for learning

### Key Components

#### 1. Sentinel Agent (`/lib/agent/sentinelAgent.ts`)
- **Purpose**: Core autonomous agent orchestrator
- **Key Function**: `runAgentCycle(input: AgentInput): Promise<AgentOutput>`
- **Features**:
  - Input normalization for different data types
  - Decision making based on AI analysis
  - Tool execution and result handling
  - Memory storage for learning

#### 2. AI Client (`/lib/agent/aiClient.ts`)
- **Purpose**: Provider-agnostic AI interface
- **Current Provider**: Groq (Llama 3.3 70B)
- **Future Provider**: Gemini (plug-and-play ready)
- **Key Function**: `analyzeThreat(input: any): Promise<ThreatAnalysis>`
- **Features**:
  - Structured threat analysis with confidence scores
  - Provider switching capability
  - Fallback risk calculation

#### 3. Tools Registry (`/lib/agent/tools.ts`)
- **Purpose**: Autonomous agent tools
- **Available Tools**:
  - `block_ip`: Block malicious IP addresses
  - `rate_limit_ip`: Apply rate limiting to suspicious IPs
  - `scan_url`: Scan websites for security threats
  - `log_event`: Log security events
  - `fetch_recent_threats`: Retrieve threat intelligence
- **Features**:
  - Independent tool execution
  - Structured output format
  - Civic integration for audit trails

#### 4. Memory System (`/lib/agent/memory.ts`)
- **Purpose**: Agent memory and learning
- **Storage**: In-memory (1000 entries max)
- **Features**:
  - Decision history tracking
  - Pattern analysis
  - Success/failure metrics
  - Auto-tagging for categorization

---

## 🔄 Integration Points

### Traffic Monitoring Integration
**File**: `/app/api/traffic/route.ts`

When traffic is flagged as suspicious:
```typescript
// PLUTO Agent Integration
runAgentCycle({
  type: 'traffic',
  data: {
    ip: entry.ip,
    port: entry.port,
    protocol: entry.protocol,
    requestCount: entry.requestCount,
    riskScore: result.riskScore,
    threatStatus: result.threatStatus,
    attackType: result.attackType
  },
  source: 'traffic_monitor',
  timestamp: new Date().toISOString()
}).catch(error => {
  console.error('PLUTO Agent error:', error);
});
```

### Sandbox Scanner Integration
**File**: `/app/api/sandbox-scan/route.ts` (to be updated)

After sandbox scan completion, results are passed to PLUTO for autonomous decision making.

### Response Engine Integration
**File**: `/app/api/respond/route.ts` (to be updated)

PLUTO can trigger response actions through the existing response engine.

---

## 🖥️ User Interface

### Command Center Dashboard
**File**: `/app/page.tsx`

**Rebranded Elements**:
- Title: "PLUTO" (was "AI-NMS")
- Subtitle: "AUTONOMOUS CYBER DEFENSE AGENT v1.0"
- Navigation: "COMMAND CENTER" (was "DASHBOARD")
- AI Stream: "PLUTO_REASONING_STREAM" (was "AI_ANALYSIS_STREAM")

**New Components**:
- **PLUTO Agent Status Panel**: Shows agent status, last action, confidence, mode
- **Agent Demo Button**: "SIMULATE ATTACK + RUN AGENT" for demonstrations
- **Reasoning Stream**: Shows PLUTO's decision-making process

### CLI Interface
**File**: `/cli/pluto.ts` (renamed from `lokey.ts`)

**New Commands**:
- `pluto agent-run`: Run PLUTO agent cycle manually
- `pluto ask <question>`: Ask PLUTO a security question

**Rebranded Elements**:
- ASCII Art: "PLUTO" (was "LoKey")
- Description: "Autonomous Cyber Defense Agent"
- Color Scheme: Purple/Blue/Teal gradient

---

## 🔌 API Endpoints

### Agent API (`/app/api/agent/route.ts`)
**New endpoint for direct agent interaction**

**POST Actions**:
- `run_cycle`: Execute agent cycle with custom input
- `ask_agent`: Ask PLUTO a security question
- `simulate_attack`: Trigger attack simulation and agent response
- `clear_memory`: Clear agent memory

**GET Parameters**:
- `?info=status`: Agent status and provider info
- `?info=memory`: Memory stats and patterns
- `?info=tools`: Available tools information
- `?info=capabilities`: Agent capabilities overview

---

## 📊 Data Flow

### Input Sources
1. **Network Traffic**: Real-time packet analysis
2. **Sandbox Results**: Website security scans
3. **Security Alerts**: System-generated alerts
4. **Manual Queries**: User questions and commands

### Processing Pipeline
```
Input → Agent Observation → AI Analysis → Decision Making → Tool Execution → Memory Storage
```

### Output Formats
All agent decisions return structured output:
```typescript
{
  threat: string;           // Brief threat description
  confidence: number;       // 0.0-1.0 confidence score
  reasoning: string[];      // Array of reasoning steps
  action: string;           // Action taken
  toolUsed?: string;        // Tool that was executed
  result?: any;             // Tool execution result
  memory_id: string;        // Memory entry ID
}
```

---

## 🛠️ Configuration

### Environment Variables
```bash
# AI Provider Configuration
AI_PROVIDER=groq                    # Current: 'groq', Future: 'gemini'
GROQ_API_KEY=your_groq_key         # Groq API key
GEMINI_API_KEY=your_gemini_key     # Future Gemini API key

# Agent Mode
AGENT_MODE=dev                      # 'dev' or 'prod'

# Existing Configuration
CIVIC_API_KEY=your_civic_jwt
CIVIC_MCP_URL=https://app.civic.com/hub/mcp?accountId=...
FEATHERLESS_API_KEY=your_featherless_key
```

### Agent Configuration
- **Memory Limit**: 1000 entries (configurable in `/lib/agent/memory.ts`)
- **Tool Rate Limits**: Enforced by Civic MCP Hub
- **AI Model**: Llama 3.3 70B Versatile (Groq)
- **Response Timeout**: 30 seconds for AI analysis

---

## 🔒 Security & Governance

### Civic AI Integration
PLUTO maintains full compatibility with Civic AI governance:
- **Hard Guardrails**: Cannot block localhost, rate limiting enforced
- **Audit Trail**: Every tool call logged with Civic audit IDs
- **Permission Control**: AI access can be revoked/restored
- **Tool Validation**: All tools validated before execution

### Security Measures
- **Input Validation**: All agent inputs validated and sanitized
- **Tool Isolation**: Each tool runs independently with error handling
- **Memory Limits**: Prevents memory overflow with automatic cleanup
- **Provider Fallback**: Graceful degradation if AI provider fails

---

## 📁 File Structure

```
/lib/agent/                 # Core agent system
├── sentinelAgent.ts       # Main agent orchestrator
├── aiClient.ts            # AI provider interface
├── tools.ts               # Tool registry and execution
└── memory.ts              # Memory and learning system

/app/api/agent/            # Agent API endpoints
└── route.ts               # Direct agent interaction API

/cli/                      # Command line interface
├── pluto.ts              # Main CLI (renamed from lokey.ts)
└── commands/             # CLI command implementations

/app/                      # Frontend application
├── page.tsx              # Main dashboard (rebranded)
├── layout.tsx            # App layout
└── api/                  # API routes (integrated with agent)

/lib/                      # Existing libraries
├── ai-detection.ts       # Legacy detection (still used)
├── sessionStore.ts       # Data storage
├── civicClient.ts        # Civic integration
└── ...                   # Other existing libraries
```

---

## 🚀 Deployment & Usage

### Development Mode
```bash
# Start the application
npm run dev

# Use PLUTO CLI
npm run pluto scan example.com
npm run pluto ask "Is this IP safe: 192.168.1.1"
npm run pluto agent-run --type manual --data '{"query":"Check system status"}'
```

### Production Considerations
- **AI Provider**: Switch to Gemini for production (`AI_PROVIDER=gemini`)
- **Memory Persistence**: Consider database storage for memory system
- **Rate Limiting**: Configure appropriate rate limits for tools
- **Monitoring**: Set up monitoring for agent performance and decisions

---

## 🧪 Testing & Validation

### Agent Testing
- **Unit Tests**: Test individual agent components
- **Integration Tests**: Test full agent cycles
- **Performance Tests**: Measure response times and accuracy
- **Security Tests**: Validate guardrails and safety measures

### Demo Scenarios
1. **Attack Simulation**: Trigger simulated attack and observe agent response
2. **Manual Query**: Ask PLUTO security questions
3. **Real-time Response**: Monitor live traffic and agent decisions
4. **Tool Execution**: Verify tool execution and audit trails

---

## 🔮 Future Enhancements

### Planned Features
1. **Gemini Integration**: Complete Gemini AI provider implementation
2. **Advanced Memory**: Persistent storage and advanced learning algorithms
3. **Multi-Agent System**: Coordination between multiple PLUTO instances
4. **Custom Tools**: User-defined tools and actions
5. **Advanced Analytics**: Deeper pattern analysis and threat prediction

### Scalability Considerations
- **Distributed Memory**: Shared memory across multiple instances
- **Load Balancing**: Agent workload distribution
- **Real-time Streaming**: Enhanced real-time data processing
- **Cloud Integration**: Native cloud provider integrations

---

## 📚 Dependencies

### Core Dependencies
- **Next.js 16**: Frontend framework
- **Groq SDK**: AI provider (current)
- **Playwright**: Sandbox browser automation
- **TypeScript**: Type safety and development experience

### Agent-Specific Dependencies
- **uuid**: Memory entry identification
- **crypto**: Secure random generation
- All existing project dependencies maintained

---

## 🐛 Troubleshooting

### Common Issues
1. **Agent Not Responding**: Check AI provider configuration and API keys
2. **Memory Overflow**: Verify memory limits and cleanup processes
3. **Tool Execution Failures**: Check Civic integration and permissions
4. **Performance Issues**: Monitor AI response times and optimize prompts

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development` and monitoring console output for agent decision traces.

---

## 📝 Change Log

### v1.0.0 - PLUTO Transformation
- ✅ Implemented core agent loop system
- ✅ Created autonomous decision-making engine
- ✅ Added explainable AI with confidence scores
- ✅ Integrated memory and learning system
- ✅ Rebranded from AI-NMS to PLUTO
- ✅ Updated CLI with agent commands
- ✅ Enhanced dashboard with agent status
- ✅ Maintained backward compatibility

### Previous Versions
- v0.x.x: AI-NMS legacy system (fully preserved)

---

*This document serves as the complete technical reference for PLUTO. All implementation details, architecture decisions, and future plans are documented here.*