'use client';

import { useState, useEffect } from 'react';
import { getMemoryInsight, getMultipleInsights, formatInsightForUI, getInsightColor, MemoryInsight } from '@/lib/agent/memoryInsights';

interface PlutoMemoryInsightProps {
  currentInput?: any;
  showMultiple?: boolean;
  className?: string;
  refreshTrigger?: number; // Used to trigger refresh from parent
}

export default function PlutoMemoryInsight({ 
  currentInput, 
  showMultiple = false, 
  className = '',
  refreshTrigger = 0
}: PlutoMemoryInsightProps) {
  const [insights, setInsights] = useState<MemoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateInsights = () => {
      setIsLoading(true);
      try {
        if (showMultiple) {
          const multipleInsights = getMultipleInsights(3);
          setInsights(multipleInsights);
        } else {
          const singleInsight = getMemoryInsight(currentInput);
          setInsights([singleInsight]);
        }
      } catch (error) {
        console.warn('Error updating memory insights:', error);
        setInsights([{
          type: 'info',
          message: 'PLUTO continues learning and adapting',
          confidence: 0.5
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    updateInsights();
  }, [currentInput, showMultiple, refreshTrigger]);

  const getInsightIcon = (type: MemoryInsight['type']) => {
    switch (type) {
      case 'pattern': return '🔍';
      case 'learning': return '🧠';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💭';
    }
  };

  const getConfidenceBar = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    const color = confidence >= 0.8 ? 'var(--green)' : 
                  confidence >= 0.6 ? 'var(--yellow)' : 
                  confidence >= 0.4 ? 'var(--orange)' : 'var(--red)';
    
    return (
      <div className="confidence-indicator">
        <div className="confidence-bar">
          <div 
            className="confidence-fill" 
            style={{ 
              width: `${percentage}%`, 
              background: color,
              boxShadow: `0 0 4px ${color}40`
            }} 
          />
        </div>
        <span className="confidence-text" style={{ color }}>{percentage}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`pluto-memory-insight loading ${className}`}>
        <div className="insight-header">
          <span className="insight-icon">🧠</span>
          <span className="insight-title">PLUTO MEMORY INSIGHT</span>
        </div>
        <div className="insight-body">
          <div className="loading-state">
            <div className="loading-spinner" />
            <div className="loading-text">Analyzing patterns...</div>
          </div>
        </div>
        <style jsx>{insightStyles}</style>
      </div>
    );
  }

  return (
    <div className={`pluto-memory-insight ${className}`}>
      <div className="insight-header">
        <span className="insight-icon">🧠</span>
        <span className="insight-title">PLUTO MEMORY INSIGHT</span>
        <span className="insight-count">{insights.length}</span>
      </div>

      <div className="insight-body">
        {insights.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <div className="empty-text">Building memory patterns...</div>
          </div>
        ) : (
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className="insight-content">
                  <div className="insight-main">
                    <span 
                      className="insight-type-icon"
                      style={{ color: getInsightColor(insight) }}
                    >
                      {getInsightIcon(insight.type)}
                    </span>
                    <div className="insight-message">{insight.message}</div>
                  </div>
                  
                  <div className="insight-meta">
                    {getConfidenceBar(insight.confidence)}
                    <span className="insight-type" style={{ color: getInsightColor(insight) }}>
                      {insight.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {insight.data && (
                  <div className="insight-data">
                    {Object.entries(insight.data).slice(0, 3).map(([key, value]) => (
                      <span key={key} className="data-point">
                        <span className="data-key">{key}:</span>
                        <span className="data-value">{String(value)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{insightStyles}</style>
    </div>
  );
}

const insightStyles = `
  .pluto-memory-insight {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .pluto-memory-insight:not(.loading) {
    border-left: 3px solid var(--purple);
  }

  .insight-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--bg3);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .insight-icon {
    font-size: 14px;
  }

  .insight-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--purple);
    letter-spacing: 0.1em;
    flex: 1;
  }

  .insight-count {
    font-size: 8px;
    color: var(--faint);
    background: var(--bg);
    padding: 2px 6px;
    border-radius: 2px;
    font-family: monospace;
  }

  .insight-body {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
  }

  .insight-body::-webkit-scrollbar {
    width: 3px;
  }

  .insight-body::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 2px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--faint);
    text-align: center;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top: 2px solid var(--purple);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 8px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--faint);
    text-align: center;
  }

  .empty-icon {
    font-size: 24px;
    margin-bottom: 8px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .insights-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .insight-item {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 8px 10px;
    transition: all 0.2s ease;
  }

  .insight-item:hover {
    background: var(--bg3);
    border-color: var(--purple);
  }

  .insight-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .insight-main {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .insight-type-icon {
    font-size: 12px;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .insight-message {
    font-size: 10px;
    line-height: 1.4;
    color: var(--muted);
    flex: 1;
  }

  .insight-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
  }

  .confidence-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .confidence-bar {
    flex: 1;
    height: 3px;
    background: var(--bg2);
    border-radius: 2px;
    overflow: hidden;
    max-width: 60px;
  }

  .confidence-fill {
    height: 100%;
    transition: width 0.6s ease-out;
    border-radius: 1px;
  }

  .confidence-text {
    font-size: 8px;
    font-weight: 600;
    font-family: monospace;
    min-width: 28px;
    text-align: right;
  }

  .insight-type {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 1px 4px;
    background: var(--bg2);
    border-radius: 2px;
  }

  .insight-data {
    margin-top: 6px;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 6px;
    border-top: 1px solid var(--border);
  }

  .data-point {
    font-size: 8px;
    display: flex;
    gap: 3px;
  }

  .data-key {
    color: var(--faint);
  }

  .data-value {
    color: var(--cyan);
    font-weight: 600;
    font-family: monospace;
  }

  /* Animation for new insights */
  .insight-item {
    animation: insightAppear 0.4s ease-out;
  }

  @keyframes insightAppear {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;