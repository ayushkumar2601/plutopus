'use client';

import { useState, useEffect } from 'react';

export interface AttackNotification {
  id: string;
  timestamp: string;
  attackType: string;
  ip: string;
  port: number;
  riskScore: number;
  action: 'BLOCKED' | 'RATE_LIMITED' | 'MONITORED' | 'ALLOWED';
  reason: string;
  requestCount: number;
}

interface Props {
  notification: AttackNotification;
  onDismiss: () => void;
  autoCloseDelay?: number;
}

export default function LiveAttackNotification({ notification, onDismiss, autoCloseDelay = 8000 }: Props) {
  const [countdown, setCountdown] = useState(autoCloseDelay / 1000);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleDismiss();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [autoCloseDelay]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case 'BLOCKED':
        return { color: '#ff3b3b', icon: '🚫', label: 'IP BLOCKED', bg: '#ff3b3b15' };
      case 'RATE_LIMITED':
        return { color: '#facc15', icon: '⏱️', label: 'RATE LIMITED', bg: '#facc1515' };
      case 'MONITORED':
        return { color: '#00eaff', icon: '👁️', label: 'MONITORING', bg: '#00eaff15' };
      case 'ALLOWED':
        return { color: '#00ff88', icon: '✅', label: 'ALLOWED', bg: '#00ff8815' };
      default:
        return { color: '#9ca3af', icon: '⚡', label: 'PROCESSED', bg: '#9ca3af15' };
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#ff3b3b';
    if (risk >= 60) return '#f97316';
    if (risk >= 35) return '#facc15';
    return '#00ff88';
  };

  const getAttackIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('ddos')) return '⚡';
    if (t.includes('brute')) return '🔑';
    if (t.includes('port')) return '🔍';
    if (t.includes('sql')) return '💉';
    if (t.includes('xss')) return '🕷️';
    return '⚠️';
  };

  const actionConfig = getActionConfig(notification.action);
  const riskColor = getRiskColor(notification.riskScore);

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 10001,
        width: 420,
        maxWidth: '94vw',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        animation: isExiting ? 'slideOutRight 0.3s ease-in' : 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      <div style={{
        background: '#050505',
        border: `1px solid ${actionConfig.color}`,
        borderTop: `3px solid ${actionConfig.color}`,
        boxShadow: `0 0 40px ${actionConfig.color}40, 0 10px 30px rgba(0,0,0,0.8)`,
        overflow: 'hidden',
      }}>

        {/* Animated top bar */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${actionConfig.color}, transparent)`,
          animation: 'scanLine 2s linear infinite',
        }} />

        {/* Header */}
        <div style={{
          padding: '12px 14px',
          background: actionConfig.bg,
          borderBottom: `1px solid ${actionConfig.color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              fontSize: 20,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>
              {getAttackIcon(notification.attackType)}
            </div>
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: actionConfig.color,
                letterSpacing: '0.1em',
                textShadow: `0 0 8px ${actionConfig.color}`,
              }}>
                PLUTO // LIVE THREAT
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>
                {new Date(notification.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
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

        {/* Attack Type */}
        <div style={{
          padding: '10px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
        }}>
          <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.1em', marginBottom: 4 }}>
            // ATTACK_TYPE
          </div>
          <div style={{
            fontSize: 13,
            color: '#ff3b3b',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}>
            {notification.attackType.toUpperCase()}
          </div>
        </div>

        {/* IP and Port Info */}
        <div style={{
          padding: '10px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.08em', marginBottom: 4 }}>
              SOURCE_IP
            </div>
            <div style={{
              fontSize: 11,
              color: '#00eaff',
              fontFamily: 'monospace',
              background: '#111827',
              padding: '4px 8px',
              borderLeft: '2px solid #00eaff',
            }}>
              {notification.ip}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.08em', marginBottom: 4 }}>
              TARGET_PORT
            </div>
            <div style={{
              fontSize: 11,
              color: '#facc15',
              fontFamily: 'monospace',
              background: '#111827',
              padding: '4px 8px',
              borderLeft: '2px solid #facc15',
            }}>
              :{notification.port}
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div style={{
          padding: '10px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}>
            <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.08em' }}>
              RISK_SCORE
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: riskColor,
              fontFamily: 'monospace',
              textShadow: `0 0 10px ${riskColor}60`,
            }}>
              {notification.riskScore}/100
            </div>
          </div>
          <div style={{
            height: 6,
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${notification.riskScore}%`,
              background: riskColor,
              boxShadow: `0 0 8px ${riskColor}60`,
              transition: 'width 0.8s ease-out',
            }} />
          </div>
        </div>

        {/* Action Taken */}
        <div style={{
          padding: '12px 14px',
          background: actionConfig.bg,
          borderBottom: '1px solid #1f2937',
        }}>
          <div style={{ fontSize: 8, color: '#374151', letterSpacing: '0.08em', marginBottom: 6 }}>
            // PLUTO_DECISION
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: '#111827',
            border: `1px solid ${actionConfig.color}`,
            borderLeft: `3px solid ${actionConfig.color}`,
          }}>
            <div style={{ fontSize: 24 }}>{actionConfig.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: actionConfig.color,
                letterSpacing: '0.08em',
                marginBottom: 2,
              }}>
                {actionConfig.label}
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af', lineHeight: 1.4 }}>
                {notification.reason}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          padding: '10px 14px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9,
        }}>
          <div>
            <span style={{ color: '#374151' }}>REQUESTS: </span>
            <span style={{ color: '#00eaff', fontWeight: 700 }}>{notification.requestCount}</span>
          </div>
          <div>
            <span style={{ color: '#374151' }}>ID: </span>
            <span style={{ color: '#374151', fontFamily: 'monospace' }}>
              {notification.id.substring(0, 8)}
            </span>
          </div>
        </div>

        {/* Auto-dismiss countdown */}
        <div style={{
          padding: '8px 14px',
          background: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 8,
          color: '#374151',
        }}>
          <span>AUTO-DISMISS IN {countdown}s</span>
          <div style={{
            flex: 1,
            marginLeft: 12,
            height: 3,
            background: '#1f2937',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(countdown / (autoCloseDelay / 1000)) * 100}%`,
              background: actionConfig.color,
              transition: 'width 1s linear',
            }} />
          </div>
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
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(120%);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
        @keyframes scanLine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}
