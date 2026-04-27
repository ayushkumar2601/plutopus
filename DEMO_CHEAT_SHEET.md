# 🎯 PLUTO Demo Cheat Sheet

**Quick reference for live demo - Print this!**

---

## ⚡ QUICK START

```bash
# 1. Start server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. You're ready!
```

---

## 🎬 DEMO SEQUENCE (5 minutes)

| Step | Tab | Action | Time | Key Point |
|------|-----|--------|------|-----------|
| 1 | Dashboard | Show live metrics | 60s | "Real-time AI monitoring" |
| 2 | Dashboard | Click "RUN AI SCAN" | 90s | "Autonomous threat detection" |
| 3 | Threat Analysis | Show alerts, click INFO | 60s | "Explainable AI reasoning" |
| 4 | Response Engine | Show blocked IPs | 45s | "Complete audit trail" |
| 5 | Sandbox | Scan github.com | 90s | "Isolated browser scanning" |
| 6 | Sandbox | Scan login-verify-account.com | - | "Phishing detection" |
| 7 | Dashboard | Show agent panels | 45s | "Agent observability" |

---

## 🎯 WHAT TO POINT OUT

### Dashboard Tab
- ✅ PLUTO agent status (top panel)
- ✅ Live metrics (requests, alerts, blocked IPs)
- ✅ Real-time charts (traffic, threats, attacks)
- ✅ AI log streaming (bottom)

### Threat Analysis Tab
- ✅ Active alerts with confidence scores
- ✅ Click "INFO" to show AI reasoning
- ✅ Click "BLOCK" to show autonomous action
- ✅ Risk scores and attack types

### Response Engine Tab
- ✅ Blocked IPs table
- ✅ Response log with timestamps
- ✅ Click "UNBLOCK" to show human override
- ✅ Complete audit trail

### Sandbox Scanner
- ✅ Enter URL: `github.com` (safe)
- ✅ Watch execution log stream
- ✅ Show risk score and analysis
- ✅ Enter URL: `login-verify-account.com` (dangerous)
- ✅ Show high risk score and BLOCK verdict

---

## 💬 KEY PHRASES TO USE

### Opening:
> "PLUTO is an autonomous cyber defense agent powered by Groq's Llama 3.3 AI"

### During Attack Simulation:
> "Watch the AI agent detect and respond autonomously in real-time"

### Showing Alerts:
> "Every decision includes the AI's reasoning and confidence score - this is explainable AI"

### Showing Blocked IPs:
> "The agent maintains a complete audit trail of every autonomous decision"

### Showing Sandbox:
> "The sandbox analyzes websites BEFORE users visit them - they're never exposed to threats"

### Closing:
> "PLUTO observes, reasons, decides, acts, and learns - the full autonomous AI loop"

---

## 🔥 POWER WORDS

Use these to impress judges:
- **Autonomous** (not just automated)
- **Explainable AI** (not black box)
- **Real-time** (sub-second response)
- **Isolated sandbox** (zero exposure)
- **Groq-powered** (fast inference)
- **Audit trail** (full transparency)
- **Human-in-the-loop** (override capability)

---

## 🎯 JUDGE QUESTIONS - QUICK ANSWERS

**"Is this really autonomous?"**
→ "Yes - observes, reasons with Groq AI, decides, and acts without human intervention"

**"How fast is it?"**
→ "Sub-second inference with Groq's Llama 3.3 - you can see it responding in real-time"

**"What about false positives?"**
→ "Confidence scores on every decision - low confidence triggers human review"

**"Can it scale?"**
→ "Stateless architecture with in-memory storage for speed - production would add database"

**"Why Groq?"**
→ "Fastest inference for real-time security - we need sub-second response times"

**"What's the tech stack?"**
→ "Next.js 16, Groq Llama 3.3, Playwright, TypeScript, SSE for real-time"

---

## 🚨 EMERGENCY BACKUP

### If Dashboard Breaks:
```bash
# Show CLI instead
npm run pluto -- stats
npm run pluto -- scan github.com
```

### If Attack Simulation Fails:
```javascript
// Run in browser console (F12)
fetch('/api/agent', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({action: 'simulate_attack'})
}).then(r => r.json()).then(console.log)
```

### If Sandbox Fails:
- Show Website Security tab with recent scans
- Explain architecture verbally
- Show code: `lib/sandboxScanner.ts`

---

## ✅ PRE-DEMO CHECKLIST

- [ ] `npm run dev` running
- [ ] Browser at `http://localhost:3000`
- [ ] Terminal ready
- [ ] Practiced once
- [ ] Confident!

---

## 🎯 DEMO URLS TO USE

**Safe URLs (low risk):**
- `https://github.com`
- `https://example.com`
- `https://google.com`

**Dangerous URLs (high risk):**
- `login-verify-account.com`
- `secure-update.net`
- `account-verify.org`

---

## 📊 EXPECTED RESULTS

### GitHub Scan:
- Risk: 10-30
- Security: 70-90
- Verdict: SAFE
- Threats: 2-4 minor

### login-verify-account.com:
- Risk: 90-99
- Security: 1-10
- Verdict: BLOCK
- Threats: Multiple critical

---

## 🎬 TIMING GUIDE

```
00:00 - Opening pitch (30s)
00:30 - Dashboard overview (60s)
01:30 - Attack simulation (90s)
03:00 - Threat analysis (60s)
04:00 - Response engine (45s)
04:45 - Sandbox demo (90s)
06:15 - Agent observability (45s)
07:00 - Closing (30s)
```

**Total: 7 minutes (adjust as needed)**

---

## 💡 PRO TIPS

1. **Slow down** - Let judges see the AI thinking
2. **Point with cursor** - Guide their eyes
3. **Emphasize "autonomous"** - Key differentiator
4. **Show confidence scores** - Judges love numbers
5. **Let charts animate** - Visual impact
6. **Smile and be confident** - You built something amazing!

---

## 🚀 YOU'VE GOT THIS!

**Remember:**
- PLUTO is impressive
- Everything is working (100% tested)
- You know your system
- Judges want to see cool tech
- Have fun!

---

**Print this page and keep it next to your laptop during the demo!**
