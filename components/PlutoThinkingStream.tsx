'use client';

import { useState, useEffect, useRef } from 'react';
import { AgentStep, subscribe, getEventHistory } from '@/lib/agent/agentEvents';

interface PlutoThinkingStreamProps {
  maxEntries?: number;
  className?: string;
}

interface QueuedStep extends AgentStep {
  id: string;
  rendered: boolean;
}

// Cinematic step delays (frontend only)
const STEP_DELAYS = {
  OBSERVE: 0,
  REASON: 400,
  DECIDE: 300,
  ACT: 200,
  MEMORY: 200,
  ERROR: 0
};

export default function PlutoThinkingStream({ maxEntries = 20, className = '' }: PlutoThinkingStreamProps) {
  const [displayedSteps, setDisplayedSteps] = useState<QueuedStep[]>([]);
  const [stepQueue, setStepQueue] = useState<QueuedStep[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    // Load initial history
    const history = getEventHistory(maxEntries);
    const queuedHistory = history.map(step => ({
      ...step,
      id: `${step.timestamp}-${Math.random()}`,
      rendered: true
    }));
    setDisplayedSteps(queuedHistory);

    // Subscribe to new events
    const unsubscribe = subscribe((step: AgentStep) => {
      const queuedStep: QueuedStep = {
        ...step,
        id: `${step.timestamp}-${Math.random()}`,
        rendered: false
      };
      
      setStepQueue(prev => [queuedStep, ...prev]);
      
      // Show activity indicator
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [maxEntries]);

  // Process step queue with cinematic delays
  useEffect(() => {
    if (stepQueue.length === 0 || processingRef.current) return;

    const processNextStep = async () => {
      processingRef.current = true;
      setIsProcessing(true);

      const nextStep = stepQueue[0];
      const delay = STEP_DELAYS[nextStep.type] || 0;

      // Wait for cinematic delay
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Add step to displayed list
      setDisplayedSteps(prev => {
        const newSteps = [{ ...nextStep, rendered: true }, ...prev];
        return newSteps.slice(0, maxEntries);
      });

      // Remove from queue
      setStepQueue(prev => prev.slice(1));

      processingRef.current = false;
      setIsProcessing(false);
    };

    processNextStep();
  }, [stepQueue, maxEntries]);

  // Auto-scroll to top when new steps arrive
  useEffect(() => {
    if (streamRef.current && displayedSteps.length > 0) {
      streamRef.current.scrollTop = 0;
    }
  }, [displayedSteps]);

  const getStepIcon = (type: AgentStep['type']) => {
    switch (type) {
      case 'OBSERVE': return '👁️';
      case 'REASON': return '🧠';
      case 'DECIDE': return '⚖️';
      case 'ACT': return '⚡';
      case 'MEMORY': return '💾';
      case 'ERROR': return '❌';
      default: return '•';
    }
  };

  const getStepColor = (type: AgentStep['type']) => {
    switch (type) {
      case 'OBSERVE': return 'var(--cyan)';
      case 'REASON': return 'var(--purple)';
      case 'DECIDE': return 'var(--yellow)';
      case 'ACT': return 'var(--green)';
      case 'MEMORY': return 'var(--blue)';
      case 'ERROR': return 'var(--red)';
      default: return 'var(--muted)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } catch {
      return '--:--:--';
    }
  };

  // Enhanced message formatting for tool selection visibility
  const formatMessage = (step: QueuedStep) => {
    if (step.type === 'DECIDE' && step.message.includes('Selected tool:')) {
      const toolName = step.message.split('Selected tool: ')[1]?.split(' ')[0];
      if (toolName) {
        return (
          <div className="tool-selection">
            <div className="tool-evaluation">🔍 Evaluating available tools...</div>
            <div className="tool-options">
              <div className="tool-option muted">
                <span className="tool-bullet">→</span>
                <span className="tool-name">scan_url</span>
                <span className="tool-priority">low priority</span>
              </div>
              <div className="tool-option muted">
                <span className="tool-bullet">→</span>
                <span className="tool-name">rate_limit_ip</span>
                <span className="tool-priority">moderate</span>
              </div>
              <div className="tool-option selected">
                <span className="tool-bullet">✔</span>
                <span className="tool-name">{toolName}</span>
                <span className="tool-priority">SELECTED</span>
              </div>
            </div>
            <div className="tool-execution">⚡ Executing {toolName}...</div>
          </div>
        );
      }
    }
    
    // Enhanced formatting for other step types
    if (step.type === 'OBSERVE') {
      return (
        <div className="step-enhanced">
          <span className="step-prefix">👁️</span>
          <span className="step-content">{step.message}</span>
        </div>
      );
    }
    
    if (step.type === 'REASON') {
      return (
        <div className="step-enhanced">
          <span className="step-prefix">🧠</span>
          <span className="step-content">{step.message}</span>
        </div>
      );
    }
    
    if (step.type === 'ACT') {
      return (
        <div className="step-enhanced">
          <span className="step-prefix">⚡</span>
          <span className="step-content">{step.message}</span>
        </div>
      );
    }
    
    return step.message;
  };

  return (
    <div className={`pluto-thinking-stream ${className}`}>
      <div className="stream-header">
        <div className="stream-title">
          <span className="stream-icon">🧠</span>
          <span className="stream-text">PLUTO THINKING...</span>
          {(isActive || isProcessing) && <span className="stream-pulse" />}
          {stepQueue.length > 0 && (
            <span className="queue-indicator">+{stepQueue.length}</span>
          )}
        </div>
        <div className="stream-count">{displayedSteps.length}/{maxEntries}</div>
      </div>
      
      <div className="stream-body" ref={streamRef}>
        {displayedSteps.length === 0 ? (
          <div className="stream-empty">
            <div className="empty-icon">🤖</div>
            <div className="empty-text">Waiting for PLUTO to think...</div>
          </div>
        ) : (
          displayedSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`stream-step ${index === 0 ? 'latest' : ''}`}
            >
              <div className="step-header">
                <span 
                  className="step-icon" 
                  style={{ color: getStepColor(step.type) }}
                >
                  {getStepIcon(step.type)}
                </span>
                <span className="step-type" style={{ color: getStepColor(step.type) }}>
                  [{step.type}]
                </span>
                <span className="step-time">{formatTimestamp(step.timestamp)}</span>
              </div>
              <div className="step-message">
                {formatMessage(step)}
              </div>
              {step.data && (
                <div className="step-data">
                  {Object.entries(step.data).map(([key, value]) => (
                    <span key={key} className="data-item">
                      {key}: <span className="data-value">{String(value)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .pluto-thinking-stream {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 4px;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: var(--font);
          overflow: hidden;
        }

        .stream-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg3);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .stream-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--purple);
          letter-spacing: 0.1em;
        }

        .stream-icon {
          font-size: 12px;
        }

        .stream-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--purple);
          animation: pulse 1s ease-in-out infinite;
        }

        .queue-indicator {
          font-size: 8px;
          background: var(--yellow);
          color: var(--bg);
          padding: 1px 4px;
          border-radius: 2px;
          font-weight: 700;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .stream-count {
          font-size: 9px;
          color: var(--faint);
          font-family: monospace;
        }

        .stream-body {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stream-body::-webkit-scrollbar {
          width: 3px;
        }

        .stream-body::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }

        .stream-empty {
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
          font-size: 11px;
          letter-spacing: 0.05em;
        }

        .stream-step {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 6px 8px;
          font-size: 10px;
          transition: all 0.3s ease;
        }

        .stream-step:hover {
          background: var(--bg3);
          border-color: var(--purple);
        }

        .stream-step.latest {
          animation: slideInGlow 0.5s ease-out;
          border-color: var(--purple);
          box-shadow: 0 0 8px rgba(155, 89, 182, 0.3);
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .step-icon {
          font-size: 11px;
          width: 14px;
          text-align: center;
        }

        .step-type {
          font-weight: 700;
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .step-time {
          margin-left: auto;
          font-size: 8px;
          color: var(--faint);
          font-family: monospace;
        }

        .step-message {
          color: var(--muted);
          line-height: 1.4;
          margin-left: 20px;
        }

        .tool-selection {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tool-evaluation {
          color: var(--yellow);
          font-style: italic;
          font-size: 9px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .tool-options {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-left: 8px;
        }

        .tool-option {
          font-size: 9px;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 0;
        }

        .tool-option.muted {
          color: var(--faint);
          opacity: 0.6;
        }

        .tool-option.selected {
          color: var(--green);
          font-weight: 600;
          animation: toolSelect 0.5s ease-out;
        }

        .tool-bullet {
          width: 12px;
          text-align: center;
        }

        .tool-name {
          min-width: 80px;
        }

        .tool-priority {
          font-size: 8px;
          opacity: 0.8;
        }

        .tool-execution {
          color: var(--cyan);
          font-size: 9px;
          margin-top: 3px;
          font-style: italic;
          animation: fadeInUp 0.3s ease-out 0.2s both;
        }

        .step-enhanced {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .step-prefix {
          font-size: 10px;
          width: 16px;
          text-align: center;
        }

        .step-content {
          flex: 1;
        }

        @keyframes toolSelect {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-data {
          margin-top: 4px;
          margin-left: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .data-item {
          font-size: 8px;
          color: var(--faint);
        }

        .data-value {
          color: var(--cyan);
          font-weight: 600;
        }

        @keyframes slideInGlow {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
            box-shadow: 0 0 0 rgba(155, 89, 182, 0);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            box-shadow: 0 0 8px rgba(155, 89, 182, 0.3);
          }
        }
      `}</style>
    </div>
  );
}