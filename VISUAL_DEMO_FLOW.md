# 🎯 PLUTO Visual Demo Flow

**Visual guide for browser demo - Follow the arrows!**

---

## 🎬 DEMO PATH

```
START HERE
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 1. OPEN BROWSER                                             │
│ http://localhost:3000                                       │
│                                                             │
│ SAY: "PLUTO is an autonomous cyber defense agent           │
│       powered by Groq's Llama 3.3 AI"                      │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. DASHBOARD TAB (60 seconds)                               │
│                                                             │
│ POINT TO:                                                   │
│ ✓ PLUTO Agent Status (top panel)                           │
│ ✓ Live metrics (requests, alerts, blocked IPs)             │
│ ✓ Real-time charts (animated)                              │
│                                                             │
│ SAY: "Everything updates in real-time via Server-Sent      │
│       Events. The agent is actively monitoring."           │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CLICK "RUN AI SCAN" (90 seconds)                         │
│                                                             │
│ WATCH:                                                      │
│ ✓ AI log streaming at bottom                               │
│ ✓ Metrics updating                                         │
│ ✓ Charts animating                                         │
│ ✓ Alerts appearing                                         │
│                                                             │
│ SAY: "The agent is detecting and responding to attacks     │
│       autonomously. Watch it think in real-time."          │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. THREAT ANALYSIS TAB (60 seconds)                         │
│                                                             │
│ ACTIONS:                                                    │
│ ✓ Point to alerts with confidence scores                   │
│ ✓ Click "INFO" on a high-risk alert                        │
│ ✓ Show AI reasoning                                        │
│ ✓ Click "BLOCK" to execute action                          │
│                                                             │
│ SAY: "Every decision includes the AI's reasoning and       │
│       confidence score. This is explainable AI."           │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. RESPONSE ENGINE TAB (45 seconds)                         │
│                                                             │
│ SHOW:                                                       │
│ ✓ Blocked IPs table                                        │
│ ✓ Response log with timestamps                             │
│ ✓ Click "UNBLOCK" on an IP                                 │
│                                                             │
│ SAY: "Complete audit trail of every autonomous decision.   │
│       Humans can override when needed."                    │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. CLICK "SANDBOX SCANNER" IN SIDEBAR (90 seconds)          │
│                                                             │
│ FIRST SCAN:                                                 │
│ ✓ Enter: github.com                                        │
│ ✓ Click "SCAN IN SANDBOX"                                  │
│ ✓ Watch execution log stream                               │
│ ✓ Show risk score (low)                                    │
│                                                             │
│ SECOND SCAN:                                                │
│ ✓ Enter: login-verify-account.com                          │
│ ✓ Click "SCAN IN SANDBOX"                                  │
│ ✓ Show risk score (HIGH - 90+)                             │
│ ✓ Show BLOCK verdict                                       │
│                                                             │
│ SAY: "The sandbox analyzes websites BEFORE users visit     │
│       them. AI detects phishing patterns instantly."       │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACK TO DASHBOARD (45 seconds)                           │
│                                                             │
│ SCROLL TO:                                                  │
│ ✓ PLUTO Thinking Stream                                    │
│ ✓ Recent Decisions panel                                   │
│ ✓ Memory Insights                                          │
│                                                             │
│ SAY: "Full agent observability. You can see what the AI    │
│       is thinking, why it decided, and what it learned."   │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. CLOSING (30 seconds)                                     │
│                                                             │
│ SAY: "PLUTO observes traffic, reasons with Groq AI,        │
│       decides on actions, executes security tools, and     │
│       stores decisions in memory. It's the full            │
│       autonomous loop with explainable AI and complete     │
│       audit trails."                                       │
└─────────────────────────────────────────────────────────────┘
    ↓
   DONE! 🎉
```

---

## 🎯 VISUAL NAVIGATION MAP

```
┌─────────────────────────────────────────────────────────────┐
│                    PLUTO DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SIDEBAR              │  MAIN CONTENT AREA                  │
│  ┌──────────────┐    │                                     │
│  │ > COMMAND    │    │  ┌─────────────────────────────┐   │
│  │   CENTER     │◄───┼──┤ Start here - Show metrics   │   │
│  │              │    │  └─────────────────────────────┘   │
│  │ > TRAFFIC    │    │                                     │
│  │   LOGS       │    │  ┌─────────────────────────────┐   │
│  │              │    │  │ Click "RUN AI SCAN" button  │   │
│  │ > THREAT     │    │  └─────────────────────────────┘   │
│  │   ANALYSIS   │◄───┼──┐                                  │
│  │              │    │  │ Then go here                     │
│  │ > RESPONSE   │◄───┼──┤                                  │
│  │   ENGINE     │    │  │ Then here                        │
│  │              │    │  │                                  │
│  │ > WEBSITE    │    │  │                                  │
│  │   SECURITY   │    │  │                                  │
│  │              │    │  │                                  │
│  │ > CIVIC      │    │  │                                  │
│  │   AUDIT      │    │  │                                  │
│  │              │    │  │                                  │
│  ├──────────────┤    │  │                                  │
│  │ TOOLS:       │    │  │                                  │
│  │ $ RUN AI     │◄───┼──┘ Click this second               │
│  │   SCAN       │    │                                     │
│  │ $ REFRESH    │    │                                     │
│  │ $ AUTO-      │    │                                     │
│  │   RESPONSE   │    │                                     │
│  │ $ SANDBOX    │◄───┼──┐ Click this for sandbox demo     │
│  │   SCANNER    │    │  │                                  │
│  └──────────────┘    │  │                                  │
│                      │  │                                  │
└──────────────────────┴──┴──────────────────────────────────┘
```

---

## 📊 WHAT JUDGES WILL SEE

### Screen 1: Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ PLUTO // AUTONOMOUS CYBER DEFENSE AGENT v1.0               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤖 PLUTO AGENT STATUS                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ STATUS: ACTIVE  │  LAST ACTION: LOG_EVENT           │   │
│  │ CONFIDENCE: 87% │  MODE: DEV                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 METRICS                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ 156  │  │  12  │  │   3  │  │ 143  │  │  25  │        │
│  │REQS  │  │ALERT │  │BLOCK │  │SAFE  │  │SCANS │        │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘        │
│                                                             │
│  📈 REAL-TIME TRAFFIC ANALYSIS                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     ╱╲                                              │   │
│  │    ╱  ╲      ╱╲                                     │   │
│  │   ╱    ╲    ╱  ╲    ╱╲                             │   │
│  │  ╱      ╲  ╱    ╲  ╱  ╲                            │   │
│  │ ╱        ╲╱      ╲╱    ╲                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🎯 THREAT LEVEL DISTRIBUTION                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         ╱───╲                                       │   │
│  │        │ 72% │  SAFE                                │   │
│  │         ╲───╱                                       │   │
│  │    ╱─╲           MEDIUM                             │   │
│  │   │15%│                                             │   │
│  │    ╲─╱                                              │   │
│  │  ╱─╲              HIGH                              │   │
│  │ │13%│                                               │   │
│  │  ╲─╱                                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💬 AI LOG                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PLUTO> initiating full network scan...             │   │
│  │ PLUTO> analyzing 156 packets...                    │   │
│  │ PLUTO> scan complete — 12 threats detected         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Screen 2: Threat Analysis
```
┌─────────────────────────────────────────────────────────────┐
│ THREAT ANALYSIS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🚨 ACTIVE ALERTS (12)                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠ CRITICAL │ 45.33.22.11 │ RISK: 92 │ [INFO] [BLOCK]│   │
│  │ Brute Force Attack on SSH Port                      │   │
│  │ Confidence: 85% │ Attack Type: Brute Force          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠ HIGH │ 192.168.1.50 │ RISK: 78 │ [INFO] [BLOCK]  │   │
│  │ Port Scan Detected                                  │   │
│  │ Confidence: 80% │ Attack Type: Port Scan            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠ MEDIUM │ 10.0.0.25 │ RISK: 65 │ [INFO] [BLOCK]   │   │
│  │ Suspicious Traffic Pattern                          │   │
│  │ Confidence: 75% │ Attack Type: Unknown              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Screen 3: Sandbox Scanner
```
┌─────────────────────────────────────────────────────────────┐
│ PLUTO // SANDBOX SCANNER                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔬 ENTER TARGET URL                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ https://login-verify-account.com                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [SCAN IN SANDBOX]                                          │
│                                                             │
│  📋 SANDBOX EXECUTION LOG                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ SANDBOX> initializing isolated browser context...  │   │
│  │ SANDBOX> target: https://login-verify-account.com  │   │
│  │ SANDBOX> launching Playwright Chromium...          │   │
│  │ SANDBOX> collecting security signals...            │   │
│  │ SANDBOX> analyzing with Groq AI...                 │   │
│  │ SANDBOX> scan complete                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🎯 SCAN RESULTS                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DOMAIN: login-verify-account.com                    │   │
│  │ RISK SCORE: 99/100                                  │   │
│  │ SECURITY SCORE: 1/100                               │   │
│  │ VERDICT: ⛔ BLOCK                                    │   │
│  │                                                     │   │
│  │ THREATS DETECTED:                                   │   │
│  │ • No HTTPS — data sent in plain text               │   │
│  │ • Phishing URL pattern: "login-verify"             │   │
│  │ • Domain matches known malicious list              │   │
│  │ • Missing security headers                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CURSOR MOVEMENT GUIDE

```
1. Start at top-left (PLUTO logo)
   ↓
2. Move to PLUTO Agent Status panel
   ↓
3. Sweep across metrics
   ↓
4. Point to charts (let them animate)
   ↓
5. Scroll down to AI log
   ↓
6. Click "RUN AI SCAN" in sidebar
   ↓
7. Watch AI log stream
   ↓
8. Click "THREAT ANALYSIS" tab
   ↓
9. Point to first alert
   ↓
10. Click "INFO" button
    ↓
11. Click "BLOCK" button
    ↓
12. Click "RESPONSE ENGINE" tab
    ↓
13. Point to blocked IPs
    ↓
14. Click "SANDBOX SCANNER" in sidebar
    ↓
15. Type URL in input
    ↓
16. Click "SCAN IN SANDBOX"
    ↓
17. Watch execution log
    ↓
18. Point to results
```

---

## 🎬 PERFECT DEMO = SMOOTH FLOW

**Remember:**
- Move cursor deliberately
- Pause to let judges read
- Let animations complete
- Speak while pointing
- Smile and be confident!

**YOU'VE GOT THIS! 🚀**
