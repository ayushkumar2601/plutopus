**PLUTO**

*Autonomous Cyber Defense Agent · Real-time threat detection · Sandbox browser isolation · Google Gemini AI · PLUTO CLI*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Playwright](https://img.shields.io/badge/Playwright-1.59-45ba4b?style=flat-square&logo=playwright)](https://playwright.dev)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Chrome MV3](https://img.shields.io/badge/Chrome-MV3_Extension-4285F4?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## What is PLUTO?

PLUTO is an autonomous cyber defense agent that monitors live network traffic, scans websites in an isolated Playwright sandbox before you load them, and uses **Google Gemini AI** to classify threats in real time. 

PLUTO operates as a single intelligent agent that observes, reasons, decides, and acts autonomously to secure your digital environment. 

### 🤖 Agent-First Architecture

Every decision is made by **PLUTO** — an autonomous AI agent that provides:

- **Autonomous Decision Making** — PLUTO observes, reasons, decides, and acts independently
- **Hard Guardrails** — AI cannot perform dangerous actions (blocking localhost, invalid IPs)
- **Full Audit Trail** — Every AI decision logged with complete reasoning
- **Explainable AI** — Every decision includes confidence scores and detailed reasoning
- **Real-Time Response** — Sub-second threat analysis and action execution

The system ships with a **Chrome extension** that intercepts every navigation, a **terminal CLI called PLUTO**, and a **live Command Center dashboard** — all talking to the same in-memory backend with zero database setup.

---

## Features

| | Feature | Description | AI Component |
|---|---|---|---|
| 🛡️ | **Live Traffic Monitoring** | Real-time packet logging with AI risk scoring (0–100) | Google Gemini |
| 🤖 | **Gemini AI Detection** | Advanced AI classifies DDoS, brute force, port scan, bot traffic | Gemini |
| 🔬 | **Sandbox Scanner** | Playwright headless browser scans sites in isolation before you load them | Gemini AI |
| 🚦 | **Navigation Interceptor** | Chrome extension redirects every navigation through the warning page | - |
| 🖥️ | **Interactive Sandbox Browser** | Browse suspicious sites inside an isolated Chromium stream | - |
| ⚡ | **SSE Live Dashboard** | Server-Sent Events replace polling — instant push updates | - |
| 🔒 | **Auto-Response Engine** | IP blocking, rate limiting — all reversible | Gemini AI |
| 💻 | **PLUTO CLI** | Terminal interface — scan, block, monitor without touching the browser | - |
| 🔊 | **Sound Effects** | Web Audio API alert/scan/block tones | - |
| 📤 | **Data Export** | JSON and CSV download of all traffic and threat data | - |

---

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ CHROME EXTENSION                                            │
│ Navigation Interceptor → Warning Page → Proceed / Block    │
│ Floating Widget · Threat Panel · Real Traffic Logging      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│ NEXT.JS SERVER :3000                                        │
│                                                             │
│ /                    SOC Dashboard (6 tabs)                │
│ /sandbox             Sandbox Scanner + Interactive Browser │
│ /warning             Navigation Interceptor Warning Page   │
│                                                             │
│ /api/sandbox-scan    Playwright headless scan              │
│ /api/live-updates    SSE stream                            │
│ /api/traffic         Traffic logging + AI detection        │
│ /api/respond         IP blocking + rate limiting           │
│ /api/agent           Gemini AI analysis                    │
└──────────┬──────────────────────────────────────────────────┘
           │
┌──────────▼──────────┐
│ SANDBOX SERVER :4000│
│ WebSocket + Express │
│ Playwright Chromium │
│ Screenshot stream   │
└─────────────────────┘
```

---

## Stack

| Layer | Tech | AI Component |
|---|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript 5 | - |
| Charts | Recharts 3 with animated area/bar/pie | - |
| AI Inference | Google Gemini AI | **Gemini** |
| Sandbox | Playwright 1.59 · Chromium headless | - |
| Real-time | Server-Sent Events (native) | - |
| Extension | Chrome MV3 · webNavigation · webRequest | - |
| CLI | Commander · Chalk · Boxen · cli-table3 | - |
| Data Store | In-memory SessionStore (zero DB) | - |

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/atuljha-tech/lokey-secure.git
cd lokey-secure
npm install
npx playwright install chromium
### 2. Environment variables

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

**Required Configuration:**
```env
# Gemini API for AI analysis (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Agent Configuration
AGENT_MODE=dev
AI_PROVIDER=gemini
```

**Get API Keys:**
- **Gemini API Key**: Visit [ai.google.dev](https://ai.google.dev) to get your API key

### 3. Start the dashboard
bash
npm run dev
# → http://localhost:3000

### 4. Start the interactive sandbox server (optional)
bash
npm run sandbox
# → ws://localhost:4000
5. Load the Chrome extension
Open chrome://extensions

Enable Developer mode

Click Load unpacked → select the extension/ folder

## PLUTO CLI
Terminal access to the entire platform. Server must be running.

```bash
# Scan a website in the Playwright sandbox
npm run pluto -- scan github.com
npm run pluto -- scan http://login-verify-account.com

# Full sandbox execution log
npm run pluto -- sandbox example.com

# Show active threat alerts
npm run pluto -- alerts

# Live traffic stream
npm run pluto -- traffic

# Block an IP address
npm run pluto -- block-ip 45.33.22.11

# Recent sandbox-scanned sites
npm run pluto -- sites

# Full system security stats
npm run pluto -- stats

# NEW: Ask PLUTO a security question
npm run pluto -- ask "Is this IP safe: 192.168.1.1"

# NEW: Run PLUTO agent cycle manually
npm run pluto -- agent-run --type manual --data '{"query":"Check system status"}'
```
Example output:

```text
██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ 

╔══════════════════════════════════╗
║  PLUTO CLI                       ║
║  Autonomous Cyber Defense Agent  ║
║  🤖 Agent Status: ACTIVE         ║
╚══════════════════════════════════╝

╭─────────────────────────────────────────────╮
│  SANDBOX SCAN                               │
│  Target → https://login-verify-account.com  │
│  AI Analysis → Google Gemini AI             │
╰─────────────────────────────────────────────╯

  ┌──────────────┬──────────────────────────┐
  │ Domain       │ login-verify-account.com │
  │ Risk Score   │ 99 / 100                 │
  │ Security     │ 1 / 100                  │
  │ Verdict      │ BLOCK                    │
  └──────────────┴──────────────────────────┘

  ▌ ⛔ BLOCK ▐  RISK: 99/100

  ┌ CRITICAL ┐  No HTTPS — all data sent in plain text
  ┌ CRITICAL ┐  Phishing URL pattern: "login-verify"
  ┌ PLUTO ANALYSIS ┐  High-confidence phishing pattern
```

## Dashboard Tabs

| Tab | What it shows | AI Integration |
|---|---|---|
| DASHBOARD | Resource monitor · Security score · Live traffic stream · AI analysis log · Charts | Live Gemini inference |
| TRAFFIC LOGS | Full packet table with risk scores, attack types, BLOCK buttons | Gemini-classified attacks |
| THREAT ANALYSIS | Active alerts with INFO/BLOCK actions · Attack vector breakdown | Gemini AI responses |
| RESPONSE ENGINE | Blocked IPs with UNBLOCK · Full response log | Complete audit trail |
| WEBSITE SECURITY | Recent sandbox scans · Chrome extension feed | Gemini AI analysis |
## Sandbox Flow

```
User navigates to URL
        ↓
Extension onCommitted fires
        ↓
Tab redirected → /warning?url=<target>
        ↓
Warning page calls /api/sandbox-scan
        ↓
Playwright opens site in isolation
(no cookies · no history · no exposure)
        ↓
Collects: headers · cookies · scripts · DOM patterns
        ↓
Scores with realScore() + Gemini AI enrichment
        ↓
User sees: risk score · threats · PROCEED / GO BACK
        ↓
PROCEED → /api/proceed → 302 → real site loads
        ↓
Result stored in sessionStore.recentSites
        ↓
SSE broadcasts to dashboard
```

## Security Scoring

The same scoring logic runs in both the extension and the sandbox scanner, enhanced by Gemini AI:

| Check | Risk Added | AI Enhanced |
|---|---|---|
| No HTTPS | +40 | - |
| Password field on HTTP | +40 | - |
| Session cookie missing Secure flag | +25 | - |
| Missing Content-Security-Policy | +10 | - |
| Missing X-Frame-Options | +8 | - |
| innerHTML assignment in inline JS | +8 | - |
| Mixed content (HTTP on HTTPS page) | +15 | - |
| Phishing URL pattern | +45 | - |
| Known malicious domain | +60 | - |
| Gemini AI enrichment | up to +15 | ✅ Gemini |

**Verdict thresholds**: safe < 35 · warning 35–59 · block ≥ 60

## Project Structure

```
├── app/
│   ├── page.tsx              # SOC Dashboard
│   ├── sandbox/page.tsx      # Sandbox scanner + interactive browser
│   ├── warning/page.tsx      # Navigation interceptor warning page
│   └── api/                  # API routes
├── components/
│   ├── SOCDashboard.tsx      # Animated Recharts dashboard
│   ├── SecurityWarningPopup.tsx
│   ├── PlutoThinkingStream.tsx
│   ├── PlutoDecisionCard.tsx
│   └── WebsiteSecurityPanel.tsx
├── lib/
│   ├── agent/
│   │   ├── sentinelAgent.ts  # Core agent loop
│   │   ├── aiClient.ts       # Gemini AI integration
│   │   ├── tools.ts          # Agent tools registry
│   │   └── memory.ts         # Agent memory system
│   ├── sandboxScanner.ts     # Playwright scanner engine
│   ├── sessionStore.ts       # In-memory data store
│   ├── ai-detection.ts       # Risk scoring engine
│   └── sounds.ts             # Web Audio API effects
├── sandbox-server/
│   └── server.ts             # WebSocket screenshot streaming
├── extension/
│   ├── background.js         # Navigation interceptor + traffic logging
│   ├── content.js            # Floating widget + threat panel
│   └── popup.html/js         # Extension popup
├── cli/
│   ├── pluto.ts              # CLI entry point
│   └── commands/             # scan · sandbox · alerts · traffic · block-ip · sites · stats
└── public/
    └── sounds/               # Alert sound effects
```
## Known Limitations

- **In-memory only** — all data resets on server restart
- **Sandbox scan speed** — Playwright takes 2–5s per scan
- **Navigation interceptor** — redirect happens after navigation commits (MV3 limitation)
- **Score parity** — extension and sandbox scores are close but not identical

---

<div align="center">

**Built for Hackathons · Powered by Google Gemini AI · Isolated Sandbox Browsing**

| Component | Role |
|---|---|
| 🤖 Gemini AI | Advanced threat analysis and classification |
| 🔬 Playwright | Isolated sandbox browsing |
| ⚡ Next.js 16 | Modern full-stack framework |
| 🎨 React 19 | Cinematic UI with real-time updates |

[Dashboard](http://localhost:3000) · [Sandbox](http://localhost:3000/sandbox) · [Documentation](PLUTO_HACKATHON_DOCUMENTATION.md)

</div>
