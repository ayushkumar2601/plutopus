# 🎯 PLUTO Browser Demo Script for Judges

**Duration:** 3-5 minutes  
**Goal:** Show autonomous AI agent making real security decisions

---

## 🎬 OPENING (30 seconds)

### What to Say:
> "PLUTO is an autonomous cyber defense agent powered by Groq's Llama 3.3 AI. It monitors network traffic, scans websites in isolated sandboxes, and makes autonomous security decisions in real-time. Let me show you how it works."

### What to Show:
**Open:** `http://localhost:3000`

**Point out immediately:**
- "This is the live command center - everything you see is real-time"
- "Notice the PLUTO agent status at the top - it's actively monitoring"
- "These metrics update live via Server-Sent Events, no polling"

---

## 🎯 DEMO PART 1: Live Dashboard (60 seconds)

### Tab: COMMAND CENTER

**What to Show:**
1. **Point to the metrics at top:**
   - "Total requests being monitored"
   - "Active alerts from the AI"
   - "IPs blocked autonomously"

2. **Point to PLUTO Agent Status panel:**
   - "The agent is in MONITORING mode"
   - "It's using Groq AI for threat analysis"
   - "Shows last action and confidence level"

3. **Scroll to the charts:**
   - "Real-time traffic analysis - requests and risk scores"
   - "Threat level distribution - AI classifies each packet"
   - "Attack vector analysis - shows what types of attacks detected"

### What to Say:
> "Every data point here is analyzed by the AI agent. It observes traffic, reasons about threats, decides on actions, and stores decisions in memory. This is the full autonomous loop."

---

## 🔥 DEMO PART 2: Simulate Live Attack (90 seconds)

### Action: Trigger Attack Simulation

**Click:** "RUN AI SCAN" button in the sidebar

**What Happens:**
- AI log starts streaming at bottom
- New alerts appear
- Charts update in real-time
- Blocked IPs increase

### What to Say While It Runs:
> "I'm simulating realistic attack traffic - DDoS, brute force, port scans. Watch the AI agent detect and respond autonomously."

**Point out as it happens:**
1. **AI Log (bottom of page):**
   - "See the agent thinking in real-time"
   - "PLUTO> initiating full network scan..."
   - "PLUTO> scan complete - X packets analyzed"

2. **Metrics updating:**
   - "Active alerts increasing"
   - "Agent is blocking IPs automatically"

3. **Charts animating:**
   - "Risk scores spiking"
   - "Attack types being classified"

---

## 🚨 DEMO PART 3: Threat Analysis (60 seconds)

### Tab: THREAT ANALYSIS

**What to Show:**
1. **Active Alerts List:**
   - Point to a high-risk alert
   - "Each alert shows the AI's confidence score"
   - "Risk score, attack type, and reasoning"

2. **Click "INFO" on an alert:**
   - Shows detailed AI reasoning
   - "The agent explains WHY it flagged this"
   - "This is explainable AI - full transparency"

3. **Click "BLOCK" on an alert:**
   - IP gets blocked immediately
   - "The agent just executed a security action"
   - "This happened autonomously based on AI analysis"

### What to Say:
> "Every decision includes the AI's reasoning and confidence score. The agent can explain every action it takes. This is critical for security operations."

---

## 🛡️ DEMO PART 4: Response Engine (45 seconds)

### Tab: RESPONSE ENGINE

**What to Show:**
1. **Blocked IPs Table:**
   - "These IPs were blocked autonomously by the agent"
   - Point to risk scores and attack types
   - "Each has a reason and timestamp"

2. **Response Log:**
   - Scroll through recent actions
   - "Full audit trail of every AI decision"
   - "Action taken, severity, auto-executed status"

3. **Click "UNBLOCK" on an IP:**
   - IP gets unblocked
   - "Human operators can override AI decisions"
   - "This is human-in-the-loop when needed"

### What to Say:
> "The agent maintains a complete audit trail. Every action is logged with reasoning. Operators can review and override decisions."

---

## 🔬 DEMO PART 5: Sandbox Scanner (90 seconds)

### Tab: WEBSITE SECURITY

**What to Show:**
1. **Recent Scans:**
   - "These websites were scanned in isolated Playwright browsers"
   - Point to risk scores and verdicts

2. **Click "OPEN SANDBOX SCANNER" in sidebar**
   - Opens `/sandbox` page

### In Sandbox Page:

**Enter a safe URL first:**
```
https://github.com
```

**Click "SCAN IN SANDBOX"**

**What Happens:**
- Sandbox execution log streams
- "SANDBOX> initializing isolated browser context..."
- "SANDBOX> target: https://github.com"
- Real security checks run
- Results appear with risk score

**Point out:**
- "Playwright opens the site in isolation"
- "Checks HTTPS, cookies, headers, scripts"
- "AI enriches the analysis with threat intelligence"
- "Risk score: X/100, Security score: Y/100"

**Then enter a suspicious URL:**
```
login-verify-account.com
```

**Click "SCAN IN SANDBOX"**

**What Happens:**
- Risk score will be HIGH (90+)
- Multiple critical threats detected
- Verdict: BLOCK

**Point out:**
- "AI detected phishing pattern in the URL"
- "Multiple security issues found"
- "Agent recommends blocking - user never exposed"

### What to Say:
> "The sandbox scanner analyzes websites BEFORE users visit them. It's like a security preview. The AI checks for phishing, malware, insecure configurations - all in isolation."

---

## 🤖 DEMO PART 6: Agent Observability (45 seconds)

### Back to Dashboard

**Scroll to Agent Panels:**

1. **PLUTO Thinking Stream:**
   - Shows real-time agent reasoning
   - "This is the agent's thought process"
   - "Observe → Reason → Decide → Act"

2. **Recent Decisions:**
   - Shows last few autonomous decisions
   - Point to confidence scores
   - "Each decision includes full reasoning"

3. **Memory Insights:**
   - Shows patterns the agent learned
   - "The agent remembers past threats"
   - "It learns from every decision"

### What to Say:
> "This is full agent observability. You can see exactly what the AI is thinking, why it made decisions, and what patterns it's learning. This is critical for trust in autonomous systems."

---

## 💻 DEMO PART 7: CLI (Optional - 30 seconds)

### If Time Permits:

**Open terminal and run:**
```bash
npm run pluto -- stats
```

**Show:**
- ASCII art banner
- System statistics
- Security metrics

**Then run:**
```bash
npm run pluto -- scan example.com
```

**Show:**
- Live sandbox scan from terminal
- Risk analysis
- Verdict

### What to Say:
> "PLUTO also has a full CLI for security teams. Same AI, same analysis, terminal interface."

---

## 🎯 CLOSING (30 seconds)

### What to Say:
> "To summarize: PLUTO is an autonomous AI agent that observes network traffic, reasons about threats using Groq's Llama 3.3, decides on actions, executes security tools, and stores decisions in memory. It's the full autonomous loop with explainable AI, human oversight, and complete audit trails."

### Key Points to Emphasize:
1. **Autonomous** - Makes decisions without human intervention
2. **Explainable** - Every decision includes reasoning and confidence
3. **Real-time** - Analyzes threats as they happen
4. **Isolated** - Sandbox scanning protects users
5. **Auditable** - Complete trail of all actions
6. **Groq-Powered** - Fast AI inference with Llama 3.3

---

## 🎬 DEMO FLOW SUMMARY

```
1. Dashboard (60s)
   ↓
2. Simulate Attack (90s)
   ↓
3. Threat Analysis (60s)
   ↓
4. Response Engine (45s)
   ↓
5. Sandbox Scanner (90s)
   ↓
6. Agent Observability (45s)
   ↓
7. CLI (30s - optional)
   ↓
8. Closing (30s)
```

**Total Time:** 5 minutes (or 4:30 without CLI)

---

## 🔥 PRO TIPS FOR JUDGES

### Before Demo:
1. ✅ Run `npm run dev` and let it warm up
2. ✅ Open `http://localhost:3000` in a clean browser window
3. ✅ Have terminal ready with `npm run pluto --` commands
4. ✅ Test the attack simulation once to ensure it works
5. ✅ Clear browser console (F12) to avoid clutter

### During Demo:
1. 🎯 **Speak confidently** - You built something impressive
2. 🎯 **Point with cursor** - Guide judges' eyes to what matters
3. 🎯 **Let AI work** - Don't rush, let them see it thinking
4. 🎯 **Emphasize "autonomous"** - This is the key differentiator
5. 🎯 **Show confidence scores** - Judges love explainable AI

### What Judges Love:
- ✨ **Real-time updates** - Show SSE streaming
- ✨ **AI reasoning** - Show the "why" behind decisions
- ✨ **Autonomous actions** - Show agent blocking IPs
- ✨ **Sandbox isolation** - Show Playwright scanning
- ✨ **Audit trails** - Show complete logging
- ✨ **Groq integration** - Mention fast inference

### Common Questions & Answers:

**Q: "Is this really autonomous?"**
A: "Yes - the agent observes traffic, analyzes with Groq AI, decides actions, and executes tools without human intervention. Humans can override, but the agent acts independently."

**Q: "How fast is the AI?"**
A: "Groq's Llama 3.3 gives us sub-second inference. You can see the agent responding in real-time as threats appear."

**Q: "What about false positives?"**
A: "Every decision includes a confidence score. Low confidence triggers human review. High confidence (80%+) allows autonomous action. Plus full audit trail for review."

**Q: "Can it scale?"**
A: "Yes - the architecture is stateless with in-memory storage for speed. For production, we'd add database persistence and horizontal scaling."

**Q: "Why Groq?"**
A: "Groq gives us the fastest inference for real-time threat detection. We need sub-second response times for security, and Groq delivers."

---

## 🎯 BACKUP DEMO (If Something Breaks)

### If Dashboard Won't Load:
1. Show the CLI instead: `npm run pluto -- stats`
2. Run sandbox scan: `npm run pluto -- scan github.com`
3. Show the code: Open `lib/agent/sentinelAgent.ts`

### If Attack Simulation Fails:
1. Go directly to Threat Analysis tab
2. Show existing alerts (there should be some)
3. Manually trigger: Open browser console, run:
```javascript
fetch('/api/agent', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({action: 'simulate_attack'})
}).then(r => r.json()).then(console.log)
```

### If Sandbox Scanner Fails:
1. Show the Website Security tab with recent scans
2. Explain the architecture instead
3. Show the code: `lib/sandboxScanner.ts`

---

## 🎉 FINAL CHECKLIST

Before you start:
- [ ] Server running (`npm run dev`)
- [ ] Browser open to `http://localhost:3000`
- [ ] Terminal ready
- [ ] You've practiced once
- [ ] You're confident and ready

**You've got this! PLUTO is impressive - show it off! 🚀**
