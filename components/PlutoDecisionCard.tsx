'use client';

import { useState, useEffect } from 'react';
import { AgentOutput } from '@/lib/agent/sentinelAgent';

interface PlutoDecisionCardProps {
  decision: AgentOutput | null;
  className?: string;
}

export default function PlutoDecisionCard({ decision, className = '' }: PlutoDecisionCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [lastDecisionId, setLastDecisionId] = useState<string | null>(null);

  // Trigger highlight animation on new decision
  useEffect(() => {
    if (decision && decision.memory_id !== lastDecisionId) {
      setIsHighlighted(true);
      setLastDecisionId(decision.memory_id);
      
      // Remove highlight after animation
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [decision?.memory_id, lastDecisionId]);

  if (!decision) {
    return (
      <div className={`pluto-decision-card empty ${className}`}>
        <div className="card-header">
          <span className="card-icon">🤖</span>
          <span className="card-title">PLUTO DECISION</span>
        </div>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <div className="empty-text">Awaiting agent decision...</div>
          </div>
        </div>
        <style jsx>{cardStyles}</style>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'var(--green)';
    if (confidence >= 0.6) return 'var(--yellow)';
    if (confidence >= 0.4) return 'var(--orange)';
    return 'var(--red)';
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'block_ip': return '🚫';
      case 'rate_limit_ip': return '⏱️';
      case 'scan_url': return '🔍';
      case 'log_event': return '📝';
      case 'fetch_recent_threats': return '📊';
      default: return '⚡';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'block_ip': return 'var(--red)';
      case 'rate_limit_ip': return 'var(--yellow)';
      case 'scan_url': return 'var(--cyan)';
      case 'log_event': return 'var(--blue)';
      case 'fetch_recent_threats': return 'var(--purple)';
      default: return 'var(--green)';
    }
  };

  const confidencePercentage = Math.round(decision.confidence * 100);
  const confidenceColor = getConfidenceColor(decision.confidence);

  return (
    <div className={`pluto-decision-card ${isHighlighted ? 'highlighted' : ''} ${className}`}>
      <div className="card-header">
        <span className="card-icon">🚨</span>
        <span className="card-title">PLUTO ACTION</span>
        <span className="card-memory">#{decision.memory_id.split('_')[2]?.substring(0, 6) || 'N/A'}</span>
      </div>

      <div className="card-body">
        {/* Threat Information */}
        <div className="threat-section">
          <div className="threat-label">THREAT DETECTED</div>
          <div className="threat-value">{decision.threat}</div>
        </div>

        {/* Confidence Bar */}
        <div className="confidence-section">
          <div className="confidence-header">
            <span className="confidence-label">CONFIDENCE</span>
            <span className="confidence-value" style={{ color: confidenceColor }}>
              {confidencePercentage}%
            </span>
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ 
                width: `${confidencePercentage}%`,
                background: confidenceColor,
                boxShadow: `0 0 8px ${confidenceColor}40`
              }}
            />
          </div>
        </div>

        {/* Reasoning */}
        <div className="reasoning-section">
          <div className="reasoning-label">REASONING</div>
          <div className="reasoning-list">
            {decision.reasoning.map((reason, index) => (
              <div key={index} className="reasoning-item">
                <span className="reasoning-bullet">•</span>
                <span className="reasoning-text">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Taken */}
        <div className="action-section">
          <div className="action-header">
            <span className="action-label">ACTION TAKEN</span>
            <div className="action-badge" style={{ borderColor: getActionColor(decision.action) }}>
              <span className="action-icon">{getActionIcon(decision.action)}</span>
              <span className="action-text" style={{ color: getActionColor(decision.action) }}>
                {decision.action.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          {decision.toolUsed && (
            <div className="tool-info">
              <span className="tool-label">Tool:</span>
              <span className="tool-value">{decision.toolUsed}</span>
            </div>
          )}
        </div>

        {/* Result Status */}
        {decision.result && (
          <div className="result-section">
            <div className="result-status">
              {decision.result.success ? (
                <span className="status-success">✅ EXECUTED SUCCESSFULLY</span>
              ) : (
                <span className="status-error">❌ EXECUTION FAILED</span>
              )}
            </div>
            {decision.result.result?.message && (
              <div className="result-message">{decision.result.result.message}</div>
            )}
          </div>
        )}
      </div>

      <style jsx>{cardStyles}</style>
    </div>
  );
}

const cardStyles = `
  .pluto-decision-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .pluto-decision-card:not(.empty) {
    border-top: 2px solid var(--purple);
    box-shadow: 0 0 20px rgba(155, 89, 182, 0.1);
  }

  .pluto-decision-card.empty {
    border: 1px dashed var(--border);
  }

  /* Highlight animation for new decisions */
  .pluto-decision-card.highlighted {
    animation: decisionHighlight 0.6s ease-out;
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(155, 89, 182, 0.4);
    border-color: var(--purple);
  }

  @keyframes decisionHighlight {
    0% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(155, 89, 182, 0.1);
    }
    50% {
      transform: scale(1.03);
      box-shadow: 0 0 40px rgba(155, 89, 182, 0.6);
    }
    100% {
      transform: scale(1.02);
      box-shadow: 0 0 30px rgba(155, 89, 182, 0.4);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--bg3);
    border-bottom: 1px solid var(--border);
  }

  .card-icon {
    font-size: 14px;
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--purple);
    letter-spacing: 0.1em;
    flex: 1;
  }

  .card-memory {
    font-size: 8px;
    color: var(--faint);
    font-family: monospace;
    background: var(--bg);
    padding: 2px 6px;
    border-radius: 2px;
  }

  .card-body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: var(--faint);
    text-align: center;
  }

  .empty-icon {
    font-size: 20px;
    margin-bottom: 6px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .threat-section {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px 10px;
  }

  .threat-label {
    font-size: 8px;
    color: var(--faint);
    letter-spacing: 0.1em;
    margin-bottom: 3px;
  }

  .threat-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--red);
    line-height: 1.3;
  }

  .confidence-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .confidence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .confidence-label {
    font-size: 9px;
    color: var(--faint);
    letter-spacing: 0.08em;
  }

  .confidence-value {
    font-size: 12px;
    font-weight: 700;
    font-family: monospace;
  }

  .confidence-bar {
    height: 6px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
  }

  .confidence-fill {
    height: 100%;
    transition: width 0.8s ease-out;
    border-radius: 2px;
  }

  .reasoning-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .reasoning-label {
    font-size: 9px;
    color: var(--faint);
    letter-spacing: 0.08em;
  }

  .reasoning-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .reasoning-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 10px;
    line-height: 1.4;
  }

  .reasoning-bullet {
    color: var(--cyan);
    font-weight: 700;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .reasoning-text {
    color: var(--muted);
  }

  .action-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-label {
    font-size: 9px;
    color: var(--faint);
    letter-spacing: 0.08em;
  }

  .action-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border: 1px solid;
    border-radius: 3px;
    background: var(--bg);
  }

  .action-icon {
    font-size: 10px;
  }

  .action-text {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .tool-info {
    display: flex;
    gap: 6px;
    font-size: 9px;
  }

  .tool-label {
    color: var(--faint);
  }

  .tool-value {
    color: var(--cyan);
    font-family: monospace;
  }

  .result-section {
    border-top: 1px solid var(--border);
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .result-status {
    display: flex;
    align-items: center;
  }

  .status-success {
    font-size: 9px;
    color: var(--green);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .status-error {
    font-size: 9px;
    color: var(--red);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .result-message {
    font-size: 9px;
    color: var(--muted);
    line-height: 1.3;
  }
`;