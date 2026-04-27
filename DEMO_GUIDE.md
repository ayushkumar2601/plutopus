# 🚀 PLUTO Demo Guide

**Complete setup and demonstration guide for PLUTO - Autonomous Cyber Defense Agent**

---

## 🎯 Quick Demo Setup (5 minutes)

### 1. **Prerequisites Check**
```bash
# Verify Node.js (16+ required)
node --version

# Verify npm
npm --version

# Check if you have Git
git --version
```

### 2. **Clone & Install**
```bash
# Clone the repository
git clone https://github.com/atuljha-tech/lokey-secure.git
cd lokey-secure

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 3. **Environment Setup**
The `.env` file is already configured with a working Groq API key for demo purposes:

```bash
# Check current configuration
cat .env | grep GROQ_API_KEY
```

**✅ Ready to go!** The demo Groq API key is already set up.

### 4. **Start PLUTO**
```bash
# Terminal 1: Start the main dashboard
npm run dev
# → Dashboard available at http://localhost:3000

# Terminal 2 (Optional): Start interactive sandbox
npm run sandbox
# → Sandbox server at ws://localhost:4000
```

---

## 🎬 Demo Script (10-minute presentation)

### **Scene 1: PLUTO Command Center (2 minutes)**

1. **Open the Dashboard**
   ```
   http://localhost:3000
   ```

2. **Highlight Key Features:**
   - **PLUTO Narrative Anchor**: Shows the autonomous agent lifecycle
   - **Agent Status Panel**: Real-time status with breathing animation
   - **Thinking Stream**: Live agent reasoning (currently empty, will populate)
   - **Decision Card**: Latest autonomous decisions
   - **Memory Insights**: Learning behavior patterns

3. **Demo Quote:**
   > "This is PLUTO - not just a security dashboard, but an autonomous AI agent that observes, reasons, decides, and acts independently to protect your digital environment."

### **Scene 2: Agent Simulation (3 minutes)**

1. **Trigger Agent Demo**
   - Click the **"👉 SIMULATE ATTACK + RUN AGENT"** button in the dashboard
   - Watch the cinematic UX in action:
     - **Thinking Stream**: Shows step-by-step reasoning with delays
     - **Decision Card**: Highlights with glow animation
     - **Memory Insights**: Updates with new learning patterns

2. **Explain What Happened:**
   > "PLUTO just detected a simulated attack, reasoned through the threat, decided on an action, and executed it autonomously. Notice the confidence score and detailed reasoning - this is explainable AI in action."

### **Scene 3: CLI Power User Demo (2 minutes)**

1. **Open Terminal and Show CLI**
   ```bash
   # Show PLUTO CLI banner
   npm run pluto

   # Scan a suspicious website
   npm run pluto -- scan login-verify-account.com

   # Show system stats
   npm run pluto -- stats

   # Show active alerts
   npm run pluto -- alerts
   ```

2. **Demo Quote:**
   > "PLUTO isn't just a web interface - it's a complete autonomous agent accessible via CLI for power users and automation."

### **Scene 4: Chrome Extension (2 minutes)**

1. **Load the Extension**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" → select `extension/` folder

2. **Test Navigation Interception**
   - Try navigating to a suspicious URL (the extension will intercept)
   - Show the warning page with risk analysis
   - Demonstrate the sandbox scanning in action

3. **Demo Quote:**
   > "Every website you visit is automatically scanned by PLUTO in an isolated sandbox before you see it. This is proactive security, not reactive."

### **Scene 5: Civic AI Governance (1 minute)**

1. **Navigate to Civic Tab**
   - Click "CIVIC AUDIT" in the sidebar
   - Show the governance dashboard
   - Demonstrate the "REVOKE ACCESS" button

2. **Demo Quote:**
   > "PLUTO operates under strict AI governance. Every action is audited, rate-limited, and can be revoked in real-time. This is responsible AI deployment."

---

## 🎪 Advanced Demo Features

### **Live Traffic Simulation**
```bash
# Generate realistic traffic data
npm run simulate
```
This creates realistic network traffic that PLUTO will analyze and classify.

### **Interactive Sandbox Browser**
1. Go to `http://localhost:3000/sandbox`
2. Enter a suspicious URL
3. Watch PLUTO scan it in real-time with Playwright
4. See the live browser stream and security analysis

### **CLI Advanced Commands**
```bash
# Ask PLUTO a security question
npm run pluto -- ask "Is this IP safe: 192.168.1.1"

# Manual agent execution
npm run pluto -- agent-run --type manual --data '{"query":"Check system status"}'

# Block an IP (governed by Civic AI)
npm run pluto -- block-ip 45.33.22.11

# Show recent sandbox scans
npm run pluto -- sites
```

---

## 🎨 Cinematic UX Features to Highlight

### **1. Thinking Stream Animations**
- **Step Delays**: OBSERVE (0ms) → REASON (400ms) → DECIDE (300ms) → ACT (200ms)
- **Tool Selection Theater**: Shows PLUTO evaluating different tools
- **Queue System**: Multiple decisions queue up with visual indicators

### **2. Decision Card Highlights**
- **Auto-Glow**: New decisions automatically highlight with scale/glow effects
- **Confidence Bars**: Animated progress bars with color coding
- **Action Badges**: Color-coded action types with icons

### **3. Memory Insights**
- **Pattern Recognition**: Shows PLUTO learning from past decisions
- **Confidence Trends**: Displays improving decision confidence over time
- **Learning Behavior**: Real-time analysis of agent adaptation

### **4. Dashboard Narrative**
- **Breathing Animation**: PLUTO title pulses with enhanced glow
- **Status Indicators**: Enhanced pulse effects with dynamic shadows
- **Agent Lifecycle**: Visual representation of the autonomous loop

---

## 🔧 Troubleshooting

### **Common Issues:**

1. **Port Already in Use**
   ```bash
   # Kill processes on port 3000
   npx kill-port 3000
   
   # Or use different port
   npm run dev -- -p 3001
   ```

2. **Playwright Installation Issues**
   ```bash
   # Reinstall Playwright
   npx playwright install --force chromium
   ```

3. **API Key Issues**
   ```bash
   # Check if Groq API key is set
   echo $GROQ_API_KEY
   
   # Or check .env file
   grep GROQ_API_KEY .env
   ```

4. **Extension Not Loading**
   - Ensure Chrome Developer mode is enabled
   - Check for manifest errors in Chrome extensions page
   - Reload the extension after changes

### **Performance Tips:**

1. **For Smooth Demos:**
   - Close unnecessary browser tabs
   - Use Chrome for best extension compatibility
   - Ensure stable internet connection for AI API calls

2. **For Large Audiences:**
   - Increase browser zoom to 125-150%
   - Use full-screen mode (F11)
   - Pre-load the dashboard before presenting

---

## 📊 Demo Metrics to Mention

- **Response Time**: Sub-second AI analysis with Groq Llama 3.3 70B
- **Sandbox Speed**: 2-5 seconds per website scan
- **Memory Efficiency**: In-memory storage, zero database setup
- **Real-time Updates**: Server-Sent Events for instant dashboard updates
- **Governance**: 100% of AI actions audited and governed

---

## 🎯 Key Demo Messages

1. **"This is an Agent, Not a Tool"**
   - PLUTO makes autonomous decisions
   - Observes → Reasons → Decides → Acts → Learns

2. **"Explainable AI"**
   - Every decision includes confidence scores
   - Detailed reasoning for each action
   - Full audit trail of all activities

3. **"Proactive Security"**
   - Scans websites before you visit them
   - Real-time traffic analysis
   - Autonomous threat response

4. **"Responsible AI"**
   - Civic AI governance and guardrails
   - Rate limiting and safety controls
   - Revocable permissions

5. **"Zero Setup"**
   - No database required
   - Works out of the box
   - In-memory session storage

---

## 🚀 Next Steps After Demo

1. **For Developers:**
   - Explore the codebase structure
   - Check out the agent architecture in `lib/agent/`
   - Review the API routes in `app/api/`

2. **For Security Teams:**
   - Test with real network traffic
   - Configure custom threat intelligence feeds
   - Set up Civic AI governance for production

3. **For DevOps:**
   - Deploy to production environment
   - Set up monitoring and alerting
   - Configure backup and recovery

---

**🎬 Ready to Demo!** 

PLUTO is now configured and ready for demonstration. The cinematic UX features will make your presentation engaging and memorable, showcasing the power of autonomous AI agents in cybersecurity.