'use client';

import { useEffect, useState } from 'react';

export interface CookieTheftData {
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

export default function CookieTheftPopup({ data, onBlock, onViewReport, onDismiss }: Props) {
  const [countdown, setCountdown] = useState(10);

  // Auto-close countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onBlock(); // Auto-block when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onBlock]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 10000,
        width: 420,
        maxWidth: '94vw',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div style={{
        background: '#050505',
        border: '1px solid #ff3b3b',
        borderTop: '3px solid #ff3b3b',
        boxShadow: '0 0 40px rgba(255, 59, 59, 0.3), 0 10px 30px rgba(0,0,0,0.8)',
        overflow: 'hidden',
      }}>

        {/* Header with pulsing alert */}
        <div style={{
          padding: '12px 14px',
          background: '#ff3b3b15',
          borderBottom: '1px solid #ff3b3b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              fontSize: 20,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>🍪</div>
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#ff3b3b',
                letterSpacing: '0.1em',
                textShadow: '0 0 8px #ff3b3b',
              }}>
                COOKIE THEFT DETECTED
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>
                PLUTO // SECURITY ALERT
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: '1px solid #1f2937',
              color: '#374151',
              width: 24,
              height: 24,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'monospace',
            }}
          >×</button>
        </div>

        {/* Domain info */}
        <div style={{
          padding: '10px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
        }}>
          <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.1em', marginBottom: 4 }}>
            // VULNERABLE_DOMAIN
          </div>
          <div style={{
            fontSize: 11,
            color: '#00eaff',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}>
            {data.domain}
          </div>
        </div>

        {/* Main warning message */}
        <div style={{
          padding: '12px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
        }}>
          <div style={{
            fontSize: 10,
            color: '#ff3b3b',
            lineHeight: 1.6,
            marginBottom: 10,
          }}>
            ⚠️ This website {data.stealableCookies.length > 0 
              ? 'allows JavaScript to access cookies. Attackers can steal your session tokens and impersonate you.'
              : 'can set cookies via JavaScript without httpOnly protection. Any cookies set will be vulnerable to theft via XSS attacks.'}
          </div>
          
          {/* Stealable cookies list */}
          {data.stealableCookies.length > 0 && (
            <div style={{
              background: '#111827',
              padding: '8px 10px',
              marginBottom: 8,
              borderLeft: '2px solid #ff3b3b',
            }}>
              <div style={{ fontSize: 8, color: '#374151', marginBottom: 4, letterSpacing: '0.08em' }}>
                // STEALABLE_COOKIES [{data.stealableCookies.length}]
              </div>
              {data.stealableCookies.slice(0, 4).map((cookie, i) => (
                <div key={i} style={{
                  fontSize: 9,
                  color: '#ff3b3b',
                  fontFamily: 'monospace',
                  padding: '2px 0',
                }}>
                  • {cookie}
                </div>
              ))}
              {data.stealableCookies.length > 4 && (
                <div style={{ fontSize: 8, color: '#374151', marginTop: 2 }}>
                  + {data.stealableCookies.length - 4} more...
                </div>
              )}
            </div>
          )}

          {/* Cookie data preview or vulnerability warning */}
          {data.cookieData ? (
            <div style={{
              background: '#111827',
              padding: '8px 10px',
              borderLeft: '2px solid #facc15',
            }}>
              <div style={{ fontSize: 8, color: '#374151', marginBottom: 4, letterSpacing: '0.08em' }}>
                // THEFT_SIMULATION
              </div>
              <div style={{
                fontSize: 9,
                color: '#9ca3af',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                marginBottom: 4,
              }}>
                document.cookie → "{data.cookieData.substring(0, 50)}{data.cookieData.length > 50 ? '...' : ''}"
              </div>
              <div style={{ fontSize: 9, color: '#facc15' }}>
                Status: ❌ STEALABLE ({data.cookieLength} characters)
              </div>
            </div>
          ) : (
            <div style={{
              background: '#111827',
              padding: '8px 10px',
              borderLeft: '2px solid #facc15',
            }}>
              <div style={{ fontSize: 8, color: '#374151', marginBottom: 4, letterSpacing: '0.08em' }}>
                // VULNERABILITY_TEST
              </div>
              <div style={{
                fontSize: 9,
                color: '#9ca3af',
                fontFamily: 'monospace',
                marginBottom: 4,
              }}>
                document.cookie = "test=value" → ✅ ALLOWED
              </div>
              <div style={{ fontSize: 9, color: '#facc15' }}>
                Status: ❌ NO httpOnly PROTECTION
              </div>
            </div>
          )}
        </div>

        {/* Auto-block countdown */}
        <div style={{
          padding: '10px 14px',
          background: '#ff3b3b10',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 9, color: '#ff3b3b', letterSpacing: '0.05em' }}>
            ⛔ AUTO-BLOCKING IN {countdown}s
          </div>
          <div style={{ flex: 1, marginLeft: 12, height: 4, background: '#1f2937', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(countdown / 10) * 100}%`,
              background: '#ff3b3b',
              transition: 'width 1s linear',
            }} />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '12px 14px',
          background: '#0a0a0a',
        }}>
          <button
            onClick={onBlock}
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#ff3b3b',
              border: 'none',
              color: '#000',
              fontFamily: 'inherit',
              fontSize: 9,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            [ BLOCK SITE NOW ]
          </button>
          <button
            onClick={onViewReport}
            style={{
              flex: 1,
              padding: '8px 0',
              background: 'transparent',
              border: '1px solid #ff3b3b',
              color: '#ff3b3b',
              fontFamily: 'inherit',
              fontSize: 9,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            [ VIEW REPORT ]
          </button>
        </div>

        {/* Footer warning */}
        <div style={{
          padding: '8px 14px',
          background: '#050505',
          borderTop: '1px solid #1f2937',
          fontSize: 8,
          color: '#374151',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}>
          PLUTO DETECTED ACTIVE COOKIE THEFT VULNERABILITY
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
