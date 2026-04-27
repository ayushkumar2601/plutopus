# 🍪 Cookie Theft Popup - Quick Reference

## What It Does
Shows a popup when PLUTO detects cookies that can be stolen via JavaScript.

## When It Appears
✅ Website has cookies  
✅ Cookies missing httpOnly flag  
✅ document.cookie is accessible  
✅ Theft simulation successful  

## What It Shows
1. 🍪 Pulsing cookie icon
2. Domain name
3. List of stealable cookies
4. Actual document.cookie output
5. 10-second countdown
6. Three action buttons

## User Actions
| Button | Action | Result |
|--------|--------|--------|
| **BLOCK SITE NOW** | Immediate block | Site blocked, popup closes |
| **VIEW REPORT** | See details | Scroll to results, popup closes |
| **X / ESC** | Dismiss | Popup closes, site not blocked |
| **Wait 10s** | Auto-block | Site blocked automatically |

## Quick Test
```bash
npm run dev
# Open: http://localhost:3000/sandbox
# Scan: http://localhost:3000/test-cookies.html
# Result: Popup appears!
```

## Demo Script (90 seconds)
```
1. "Let me show you cookie theft detection"
2. Open sandbox, enter URL, scan
3. "See? These cookies can be stolen"
4. Point to cookie list and data
5. "PLUTO auto-blocks in 10 seconds"
6. Click BLOCK SITE NOW
7. "Site blocked. Session safe."
```

## Files
- **Component**: `components/CookieTheftPopup.tsx`
- **Integration**: `app/sandbox/page.tsx`
- **Docs**: `COOKIE_THEFT_POPUP.md`
- **Tests**: `TEST_COOKIE_POPUP.md`

## Status
✅ Build successful  
✅ No errors  
✅ Fully tested  
✅ Demo ready  

## Key Features
- Real-time detection
- Visual proof (actual cookies)
- Auto-protection (10s countdown)
- User control (3 actions)
- Smooth animations
- Keyboard support (ESC)

## Design
- Position: Top-right corner
- Color: Red (#ff3b3b) danger theme
- Font: Monospace (JetBrains Mono)
- Animation: Slide-in from right
- Size: 420px wide (responsive)

## Trigger Logic
```typescript
if (cookieStealable && theftSimulation?.accessible) {
  // Show popup with cookie data
}
```

## Best Test Sites
1. `http://localhost:3000/test-cookies.html` ← Best for demo
2. `https://amazon.in` ← Real-world example
3. `https://reddit.com` ← Social media example

---

**Ready to demo!** 🚀
