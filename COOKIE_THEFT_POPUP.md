# 🍪 Cookie Theft Popup Feature

## Overview

A real-time security popup that appears when PLUTO detects a website attempting to steal cookies or has vulnerable cookies accessible via JavaScript.

## Design

The popup follows PLUTO's cybersecurity design language:
- Dark theme (#050505 background)
- Cyan (#00eaff) and red (#ff3b3b) accent colors
- Monospace font (JetBrains Mono / Fira Code)
- Terminal-style interface
- Pulsing cookie emoji 🍪 for visual alert
- Auto-blocking countdown timer

## Features

### Visual Elements
- **Pulsing Alert Icon**: Animated cookie emoji that pulses to grab attention
- **Domain Display**: Shows the vulnerable domain in cyan monospace
- **Stealable Cookies List**: Lists all cookies that can be stolen via JavaScript
- **Theft Simulation**: Shows actual `document.cookie` output as proof
- **Auto-Block Countdown**: 10-second countdown with progress bar
- **Action Buttons**: Block now, view report, or dismiss

### Security Information Displayed
1. **Vulnerable Domain**: The site being scanned
2. **Stealable Cookies**: List of cookie names without httpOnly flag
3. **Cookie Data Preview**: First 50 characters of document.cookie
4. **Cookie Length**: Total characters accessible
5. **Risk Explanation**: Clear warning about session hijacking

### Auto-Block Feature
- Countdown starts at 10 seconds
- Visual progress bar shows time remaining
- Automatically blocks site when countdown reaches 0
- User can manually block immediately
- Can be dismissed if user wants to proceed anyway

## When It Appears

The popup triggers when:
1. Sandbox scan completes
2. `cookieStealable` is true
3. `theftSimulation.accessible` is true
4. Cookies are readable via `document.cookie`

## User Actions

### 1. Block Site Now (Primary)
- Immediately blocks the site
- Closes popup
- Logs block action
- Prevents navigation

### 2. View Report
- Closes popup
- Scrolls to scan results
- Shows full security analysis
- Displays all threats

### 3. Dismiss (Secondary)
- Closes popup
- Allows user to proceed
- Does not block site
- User takes responsibility

## Technical Implementation

### Component: `CookieTheftPopup.tsx`

**Props:**
```typescript
interface CookieTheftData {
  domain: string;
  url: string;
  stealableCookies: string[];
  cookieData: string;
  cookieLength: number;
}

interface Props {
  data: CookieTheftData;
  onBlock: () => void;
  onViewReport: () => void;
  onDismiss: () => void;
}
```

**Features:**
- Auto-countdown with useEffect
- Escape key to dismiss
- Slide-in animation from right
- Responsive design (max-width: 94vw)
- Fixed positioning (top-right corner)

### Integration: `app/sandbox/page.tsx`

**State:**
```typescript
const [cookieTheftPopup, setCookieTheftPopup] = useState<CookieTheftData | null>(null);
```

**Trigger Logic:**
```typescript
if (cookieStealable && theftSimulation?.accessible) {
  const stealableCookies = cookieIssues
    ?.filter((c: any) => c.risk === 'JS_ACCESSIBLE')
    .map((c: any) => c.name) || [];
  
  setCookieTheftPopup({
    domain: r.domain,
    url: fullUrl,
    stealableCookies,
    cookieData: (r as any).jsCookies || '',
    cookieLength: theftSimulation.length || 0,
  });
}
```

## Testing

### Test with Vulnerable Site:
```bash
# Start dev server
npm run dev

# Open sandbox
http://localhost:3000/sandbox

# Scan test page
URL: http://localhost:3000/test-cookies.html
Click: Set Vulnerable Cookies
Then scan the page

# Or scan real site
URL: https://amazon.in
```

### Expected Behavior:
1. Scan completes
2. Popup slides in from right
3. Shows cookie theft warning
4. Lists stealable cookies
5. Shows document.cookie output
6. Countdown starts at 10s
7. Auto-blocks at 0s (or user clicks block)

## Demo Script

**For Judges:**

1. **Setup**: "Let me show you PLUTO's real-time cookie theft detection"

2. **Scan**: Enter vulnerable URL and click SCAN

3. **Point to popup**: "See this? PLUTO detected cookies that JavaScript can steal"

4. **Show details**: 
   - "These are the actual cookie names"
   - "This is the real document.cookie output"
   - "An attacker could steal these in an XSS attack"

5. **Countdown**: "PLUTO auto-blocks in 10 seconds to protect you"

6. **Block**: Click "BLOCK SITE NOW"

7. **Result**: "Site is now blocked. Your session is safe."

## Design Rationale

### Why a Popup?
- **Immediate attention**: Can't be missed
- **Real-time alert**: Appears as threat is detected
- **Clear action**: User knows what to do
- **Educational**: Explains the risk

### Why Auto-Block?
- **Default safe**: Protects users who don't act
- **Urgency**: Creates sense of importance
- **Opt-out not opt-in**: Security by default
- **10 seconds**: Enough time to read, not too long

### Why Show Cookie Data?
- **Proof**: Not just a warning, shows actual vulnerability
- **Educational**: Users see what attackers see
- **Credibility**: Demonstrates real scanning, not fake alerts
- **Transparency**: Shows exactly what's at risk

## Styling Details

### Colors:
- Background: `#050505` (near black)
- Border: `#ff3b3b` (red - danger)
- Text: `#9ca3af` (gray)
- Accent: `#00eaff` (cyan)
- Warning: `#facc15` (yellow)

### Animations:
- Slide in: 0.3s ease-out from right
- Pulse: 1.5s infinite on cookie emoji
- Progress bar: 1s linear transition

### Typography:
- Font: JetBrains Mono, Fira Code (monospace)
- Sizes: 8px-11px (compact, terminal-style)
- Letter spacing: 0.05em-0.1em (readable)

## Files Modified

1. **Created**: `components/CookieTheftPopup.tsx`
2. **Modified**: `app/sandbox/page.tsx`
   - Added import
   - Added state
   - Added trigger logic
   - Added popup component

## Build Status

✅ Build successful
✅ No TypeScript errors
✅ All features working
✅ Ready for demo

---

**Last Updated**: December 25, 2024  
**Status**: ✅ COMPLETE  
**Demo Ready**: ✅ YES
