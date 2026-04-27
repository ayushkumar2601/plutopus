# Cookie Theft Popup - Visual Preview

```
┌─────────────────────────────────────────────────────────┐
│  🍪  COOKIE THEFT DETECTED                          × │
│      PLUTO // SECURITY ALERT                           │
├─────────────────────────────────────────────────────────┤
│  // VULNERABLE_DOMAIN                                  │
│  example.com                                           │
├─────────────────────────────────────────────────────────┤
│  ⚠️ This website allows JavaScript to access cookies. │
│  Attackers can steal your session tokens and           │
│  impersonate you.                                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ // STEALABLE_COOKIES [3]                         │ │
│  │ • session_id                                     │ │
│  │ • user_token                                     │ │
│  │ • auth_key                                       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ // THEFT_SIMULATION                              │ │
│  │ document.cookie → "session_id=abc123; user_to... │ │
│  │ Status: ❌ STEALABLE (45 characters)             │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ⛔ AUTO-BLOCKING IN 7s  [███████░░░░░░░░░░░░░░░░░░] │
├─────────────────────────────────────────────────────────┤
│  [ BLOCK SITE NOW ]  [ VIEW REPORT ]                  │
├─────────────────────────────────────────────────────────┤
│  PLUTO DETECTED ACTIVE COOKIE THEFT VULNERABILITY      │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme

```
┌─────────────────────────────────────────────────────────┐
│  🍪 (pulsing)  RED TEXT (#ff3b3b)                  × │  ← Red border
│      GRAY TEXT (#9ca3af)                               │
├─────────────────────────────────────────────────────────┤
│  GRAY TEXT (#374151)                                   │
│  CYAN TEXT (#00eaff)                                   │  ← Cyan domain
├─────────────────────────────────────────────────────────┤
│  RED WARNING TEXT (#ff3b3b)                            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ DARK BACKGROUND (#111827)                        │ │  ← Red left border
│  │ RED TEXT (#ff3b3b)                               │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ DARK BACKGROUND (#111827)                        │ │  ← Yellow left border
│  │ GRAY TEXT (#9ca3af)                              │ │
│  │ YELLOW TEXT (#facc15)                            │ │
│  └───────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  RED TEXT (#ff3b3b)  [RED PROGRESS BAR]               │  ← Red background
├─────────────────────────────────────────────────────────┤
│  [RED BUTTON]  [RED OUTLINE BUTTON]                   │
├─────────────────────────────────────────────────────────┤
│  GRAY TEXT (#374151)                                   │
└─────────────────────────────────────────────────────────┘
```

## Animation States

### 1. Slide In (0.3s)
```
                                    ┌──────┐
                                    │      │
                                    │ POP  │
                                    │ UP   │
                                    │      │
                                    └──────┘
                                         ↓
                              ┌──────────────┐
                              │              │
                              │    POPUP     │
                              │              │
                              └──────────────┘
```

### 2. Cookie Pulse (1.5s loop)
```
🍪  →  🍪  →  🍪  →  🍪
100%   70%    100%   70%
```

### 3. Countdown Progress (10s)
```
[██████████████████████] 10s
[████████████████░░░░░░]  7s
[██████████░░░░░░░░░░░░]  5s
[████░░░░░░░░░░░░░░░░░░]  2s
[░░░░░░░░░░░░░░░░░░░░░░]  0s → AUTO-BLOCK
```

## Responsive Behavior

### Desktop (420px width)
```
┌─────────────────────────────────────────────┐
│  Full width popup                           │
│  All content visible                        │
│  Comfortable spacing                        │
└─────────────────────────────────────────────┘
```

### Mobile (94vw max-width)
```
┌───────────────────────────────┐
│  Responsive width             │
│  Scrollable content           │
│  Touch-friendly buttons       │
└───────────────────────────────┘
```

## Position

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                    ┌──────────────────┐ │
│                                    │                  │ │
│                                    │  COOKIE THEFT   │ │
│                                    │  POPUP          │ │
│                                    │                  │ │
│                                    │  (Fixed)        │ │
│                                    │  (Top: 20px)    │ │
│                                    │  (Right: 20px)  │ │
│                                    │  (Z-index: 10k) │ │
│                                    │                  │ │
│                                    └──────────────────┘ │
│                                                         │
│  Main Page Content                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
1. Scan Website
      ↓
2. Cookie Theft Detected
      ↓
3. Popup Slides In (0.3s)
      ↓
4. User Reads Warning
      ↓
5. Countdown Starts (10s)
      ↓
┌─────┴─────┐
│           │
User        Auto
Acts        Block
│           │
↓           ↓
Block       Block
Now         @0s
```

## Button States

### Block Site Now (Primary)
```
Normal:   [  BLOCK SITE NOW  ]  ← Red background
Hover:    [  BLOCK SITE NOW  ]  ← Slightly lighter
Active:   [  BLOCK SITE NOW  ]  ← Pressed effect
```

### View Report (Secondary)
```
Normal:   [  VIEW REPORT  ]  ← Red outline
Hover:    [  VIEW REPORT  ]  ← Red background
Active:   [  VIEW REPORT  ]  ← Pressed effect
```

## Typography Hierarchy

```
COOKIE THEFT DETECTED        ← 11px, Bold, Red, Uppercase
PLUTO // SECURITY ALERT      ← 9px, Gray

// VULNERABLE_DOMAIN          ← 8px, Gray, Uppercase
example.com                  ← 11px, Cyan, Monospace

Warning text                 ← 10px, Red, Line height 1.6

// STEALABLE_COOKIES [3]     ← 8px, Gray, Uppercase
• session_id                 ← 9px, Red, Monospace

// THEFT_SIMULATION          ← 8px, Gray, Uppercase
document.cookie → "..."      ← 9px, Gray, Monospace
Status: ❌ STEALABLE         ← 9px, Yellow

⛔ AUTO-BLOCKING IN 7s       ← 9px, Red, Uppercase

[ BLOCK SITE NOW ]           ← 9px, Bold, Uppercase
[ VIEW REPORT ]              ← 9px, Uppercase

Footer text                  ← 8px, Gray, Uppercase
```

## Accessibility

- **Keyboard**: ESC to dismiss
- **Focus**: Tab through buttons
- **Screen readers**: Semantic HTML
- **Color contrast**: WCAG AA compliant
- **Animation**: Respects prefers-reduced-motion

## Demo Timing

```
0:00 - Scan starts
0:05 - Scan completes
0:05 - Popup appears (slide in)
0:06 - User reads warning
0:08 - User sees stealable cookies
0:10 - User sees theft simulation
0:12 - Countdown at 3s
0:15 - Auto-block OR user clicks
```

Total: 15 seconds for full demo

---

**Visual Style**: Cybersecurity terminal aesthetic  
**Design Language**: PLUTO monospace dark theme  
**User Experience**: Clear, urgent, actionable
