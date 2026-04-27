'use client';

import { useState, useEffect } from 'react';

interface WebsiteScan {
  _id: string;
  domain: string;
  securityScore: number;
  riskScore: number;
  threats: string[];
  timestamp: string;
}

interface WebsiteAlert {
  _id: string;
  domain: string;
  riskScore: number;
  threats: string[];
  severity: string;
  timestamp: string;
}

interface WebsiteSecurityPanelProps {
  onThreatClick?: (threat: WebsiteAlert) => void;
}

export default function WebsiteSecurityPanel({ onThreatClick }: WebsiteSecurityPanelProps) {
  const [scans, setScans] = useState<WebsiteScan[]>([]);
  const [alerts, setAlerts] = useState<WebsiteAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await fetch('/api/website-security');
      const result = await response.json();
      if (result.success) {
        const realScans = (result.scans || []).filter((scan: WebsiteScan) => {
          return scan.threats && scan.threats.length > 0 && scan.threats[0] !== 'No threats detected';
        });
        
        const realAlerts = (result.alerts || []).filter((alert: WebsiteAlert) => {
          return alert.threats && alert.threats.length > 0 && alert.riskScore > 0;
        });
        
        setScans(realScans);
        setAlerts(realAlerts);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'var(--red)';
    if (score >= 35) return 'var(--yellow)';
    return 'var(--green)';
  };

  const getRiskTag = (score: number) => {
    if (score >= 70) return { label: 'CRITICAL', color: 'var(--red)' };
    if (score >= 50) return { label: 'HIGH', color: 'var(--red)' };
    if (score >= 35) return { label: 'MEDIUM', color: 'var(--yellow)' };
    return { label: 'LOW', color: 'var(--green)' };
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', { hour12: false });
    } catch {
      return '--:--:--';
    }
  };

  if (loading) {
    return (
      <div className="t-panel-body" style={{ textAlign: 'center', color: 'var(--faint)' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.1em' }}>// loading security data...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 1 }}>
        {[
          { label: 'SITES_WITH_ISSUES', value: scans.length, icon: '🌐', color: 'var(--cyan)' },
          { label: 'ACTIVE_THREATS', value: alerts.length, icon: '🚨', color: 'var(--red)' },
          { label: 'SECURE_SITES', value: scans.filter(s => s.securityScore >= 80).length, icon: '✅', color: 'var(--green)' },
          { label: 'TOTAL_SCANS', value: stats?.totalScans || 0, icon: '📊', color: 'var(--purple)' }
        ].map((stat, i) => (
          <div key={i} className="t-panel" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{stat.icon}</span>
              <div style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, textShadow: `0 0 8px ${stat.color}` }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Active Threats */}
      <div className="t-panel">
        <div className="t-panel-header">
          <span className="t-panel-title">🚨 ACTIVE_SECURITY_THREATS</span>
          <span className="t-panel-meta">{alerts.length} ENTRIES</span>
        </div>
        <div className="t-panel-body" style={{ maxHeight: 320, overflowY: 'auto' }}>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--faint)' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 12, letterSpacing: '0.05em' }}>// no active threats detected</div>
              <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>all websites are secure</div>
            </div>
          ) : (
            alerts.map((alert, i) => {
              const riskTag = getRiskTag(alert.riskScore);
              return (
                <div key={i} className="t-alert-line" onClick={() => onThreatClick?.(alert)}>
                  <span className={`t-alert-tag ${riskTag.label.toLowerCase()}`} style={{ color: riskTag.color, borderColor: riskTag.color }}>
                    {riskTag.label}
                  </span>
                  <span className="t-alert-ip">{alert.domain}</span>
                  <span className="t-alert-reason">{alert.threats?.length || 0} issues</span>
                  <span className="t-alert-time">[{formatTime(alert.timestamp)}]</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Scans */}
      {scans.length > 0 && (
        <div className="t-panel">
          <div className="t-panel-header">
            <span className="t-panel-title">📋 RECENT_SECURITY_SCANS</span>
            <span className="t-panel-meta">{scans.length} ENTRIES</span>
          </div>
          <div className="t-panel-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="t-table">
                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>DOMAIN</th>
                    <th>SECURITY_SCORE</th>
                    <th>RISK_LEVEL</th>
                    <th>ISSUES</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.slice(0, 10).map((scan, i) => {
                    const riskTag = getRiskTag(scan.riskScore);
                    return (
                      <tr key={i}>
                        <td className="t-td-time">[{formatTime(scan.timestamp)}]</td>
                        <td className="t-td-ip">{scan.domain}</td>
                        <td className="t-td-score" style={{ color: getRiskColor(100 - scan.riskScore) }}>
                          {scan.securityScore}/100
                        </td>
                        <td>
                          <span className="t-tag" style={{ color: riskTag.color, borderColor: riskTag.color }}>
                            {riskTag.label}
                          </span>
                        </td>
                        <td>{scan.threats?.length || 0} issues</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}