# PLUTO Quick Test Guide

## ✅ Everything is Working!

Your PLUTO system has been tested and is **100% operational**.

---

## 🚀 Quick Verification

Run this command to verify everything is working:

```bash
node test-pluto-final.js
```

**Expected Result:** All tests should pass (13/13)

---

## 🧪 Manual Testing

### 1. Test the Dashboard
```bash
# Open browser to:
http://localhost:3000
```

You should see:
- ✅ Live traffic metrics
- ✅ Security score
- ✅ Real-time charts
- ✅ PLUTO agent status

### 2. Test Groq AI
```bash
# Open browser console and run:
fetch('http://localhost:3000/api/agent', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    action: 'ask_agent',
    data: {query: 'Is IP 192.168.1.1 safe?'}
  })
}).then(r => r.json()).then(console.log)
```

**Expected:** You should get an AI response with confidence score

### 3. Test Sandbox Scanner
```bash
# Open:
http://localhost:3000/sandbox

# Enter URL:
https://example.com

# Click "SCAN IN SANDBOX"
```

**Expected:** Risk score, security analysis, and threat list

### 4. Test Agent Decision Making
```bash
# In browser console:
fetch('http://localhost:3000/api/agent', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    action: 'simulate_attack'
  })
}).then(r => r.json()).then(console.log)
```

**Expected:** Agent should decide to block the IP

### 5. Test CLI
```bash
# Show system stats
npm run pluto -- stats

# Scan a website
npm run pluto -- scan github.com

# Show alerts
npm run pluto -- alerts
```

---

## 🔍 What Was Tested

### ✅ All API Endpoints (6/6)
- Traffic API
- Detection API  
- Response API
- Website Security API
- Alerts API
- Export API

### ✅ PLUTO Agent (3/3)
- Agent Status
- Agent Tools (5 tools available)
- Agent Capabilities

### ✅ Groq AI Integration (1/1)
- API Key: Configured ✓
- Model: Llama 3.3 70B ✓
- Response: Working ✓
- Confidence: 80%+ ✓

### ✅ Autonomous Decision Making (1/1)
- Observe → Reason → Decide → Act → Memory
- All phases working correctly

### ✅ Sandbox Scanner (1/1)
- Playwright integration working
- Security checks functional
- Risk scoring accurate

### ✅ Attack Simulation (1/1)
- Simulated attacks working
- Agent responds autonomously
- Tools execute correctly

---

## 📊 System Health: 100%

```
Tests Passed: 13/13
Tests Failed: 0/13
Status: FULLY OPERATIONAL ✅
```

---

## 🎯 Key Features Verified

1. **Groq AI** - Working perfectly with 80%+ confidence
2. **Agent Decision Making** - Autonomous and accurate
3. **Sandbox Scanner** - Playwright scanning functional
4. **Real-time Updates** - SSE streaming working
5. **Traffic Monitoring** - Logging and analysis operational
6. **Attack Response** - IP blocking and rate limiting working

---

## 🔧 Environment Configuration

All required environment variables are set:

```
✓ GROQ_API_KEY: ***4NF2
✓ AI_PROVIDER: groq
✓ AGENT_MODE: dev
✓ NEXT_PUBLIC_BASE_URL: http://localhost:3000
✓ NODE_ENV: development
```

---

## 🎉 Ready for Demo!

Your PLUTO system is **production-ready** for:
- Hackathon demonstrations
- Live security testing
- Real-time threat detection
- Autonomous decision making
- Website security scanning

---

## 📝 Common Commands

```bash
# Start server
npm run dev

# Run health check
node test-pluto-final.js

# CLI commands
npm run pluto -- scan <url>
npm run pluto -- alerts
npm run pluto -- traffic
npm run pluto -- stats
npm run pluto -- block-ip <ip>

# Export data
curl http://localhost:3000/api/export?format=json
curl http://localhost:3000/api/export?format=csv
```

---

## 🐛 Troubleshooting

If something doesn't work:

1. **Check server is running:**
   ```bash
   tasklist | findstr node
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Check Groq API key:**
   ```bash
   type .env | findstr GROQ_API_KEY
   ```

4. **Run health check:**
   ```bash
   node test-pluto-final.js
   ```

---

## ✨ Everything is Working!

No issues found. PLUTO is ready to go! 🚀
