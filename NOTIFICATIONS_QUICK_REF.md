# 🚨 Live Attack Notifications - Quick Reference

## What It Does
Shows real-time popups when attacks are detected with IP, port, risk score, and PLUTO's decision.

## Quick Test
```bash
npm run dev
# Open: http://localhost:3000
# Click: SIMULATE DDOS
# Result: Notification slides in from top-right!
```

## What You'll See
```
┌─────────────────────────────┐
│ ⚡ PLUTO // LIVE THREAT   × │
├─────────────────────────────┤
│ DDOS ATTACK                 │
│ IP: 192.168.1.100           │
│ PORT: :80                   │
│ RISK: 85/100 [████████░░░] │
│ 🚫 IP BLOCKED               │
│ AUTO-DISMISS IN 8s          │
└─────────────────────────────┘
```

## Action Types
| Action | Color | Icon | Risk |
|--------|-------|------|------|
| BLOCKED | Red | 🚫 | ≥80 |
| RATE_LIMITED | Yellow | ⏱️ | 60-79 |
| MONITORING | Cyan | 👁️ | 35-59 |
| ALLOWED | Green | ✅ | <35 |

## Attack Icons
- ⚡ DDoS
- 🔑 Brute Force
- 🔍 Port Scan
- 💉 SQL Injection
- 🕷️ XSS

## Features
- ✅ Slides in from right
- ✅ Auto-dismisses in 8s
- ✅ Stacks up to 3 notifications
- ✅ Color-coded by action
- ✅ Animated risk bar
- ✅ Pulsing icon
- ✅ Countdown timer

## Files
- **Component**: `components/LiveAttackNotification.tsx`
- **Manager**: `components/LiveAttackNotificationManager.tsx`
- **Docs**: `LIVE_ATTACK_NOTIFICATIONS.md`
- **Tests**: `TEST_LIVE_NOTIFICATIONS.md`

## Usage
```typescript
import { triggerAttackNotification } from '@/components/LiveAttackNotificationManager';

triggerAttackNotification({
  attackType: 'DDOS',
  ip: '192.168.1.100',
  port: 80,
  riskScore: 85,
  action: 'BLOCKED',
  reason: 'High-risk DDoS detected',
  requestCount: 150,
});
```

## Demo Script (30s)
1. "PLUTO shows real-time decisions"
2. Click SIMULATE DDOS
3. Point to notification
4. "See? IP blocked at 85/100 risk"
5. "Real-time visibility"

## Status
✅ Build successful  
✅ No errors  
✅ Fully tested  
✅ Demo ready  

---

**Ready to demo!** 🚀
