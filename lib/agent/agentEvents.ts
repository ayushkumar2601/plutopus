// ============================================================
// PLUTO AGENT EVENTS - Non-invasive Event System
// Provides real-time observability without breaking existing logic
// ============================================================

export type AgentStep = 
  | { type: "OBSERVE"; message: string; timestamp: string; data?: any }
  | { type: "REASON"; message: string; timestamp: string; data?: any }
  | { type: "DECIDE"; message: string; timestamp: string; data?: any }
  | { type: "ACT"; message: string; timestamp: string; data?: any }
  | { type: "MEMORY"; message: string; timestamp: string; data?: any }
  | { type: "ERROR"; message: string; timestamp: string; data?: any };

export type AgentEventListener = (step: AgentStep) => void;

// In-memory event system (lightweight, non-blocking)
let listeners: AgentEventListener[] = [];
let eventHistory: AgentStep[] = [];
const MAX_HISTORY = 50; // Keep last 50 events

// ============================================
// EVENT EMISSION (Non-blocking)
// ============================================
export function emitStep(step: Omit<AgentStep, 'timestamp'>): void {
  try {
    const timestampedStep: AgentStep = {
      ...step,
      timestamp: new Date().toISOString()
    };
    
    // Add to history (FIFO)
    eventHistory.unshift(timestampedStep);
    if (eventHistory.length > MAX_HISTORY) {
      eventHistory = eventHistory.slice(0, MAX_HISTORY);
    }
    
    // Notify listeners (non-blocking)
    listeners.forEach(listener => {
      try {
        listener(timestampedStep);
      } catch (error) {
        console.warn('Agent event listener error:', error);
      }
    });
  } catch (error) {
    console.warn('Agent event emission error:', error);
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================
export function subscribe(listener: AgentEventListener): () => void {
  listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function unsubscribe(listener: AgentEventListener): void {
  listeners = listeners.filter(l => l !== listener);
}

// ============================================
// HISTORY ACCESS
// ============================================
export function getEventHistory(limit = 20): AgentStep[] {
  return eventHistory.slice(0, limit);
}

export function clearEventHistory(): void {
  eventHistory = [];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function getActiveListenerCount(): number {
  return listeners.length;
}

export function createStepMessage(type: AgentStep['type'], message: string, data?: any): Omit<AgentStep, 'timestamp'> {
  return { type, message, data };
}

// ============================================
// HELPER FUNCTIONS FOR COMMON EVENTS
// ============================================
export const AgentEvents = {
  observe: (message: string, data?: any) => emitStep({ type: "OBSERVE", message, data }),
  reason: (message: string, data?: any) => emitStep({ type: "REASON", message, data }),
  decide: (message: string, data?: any) => emitStep({ type: "DECIDE", message, data }),
  act: (message: string, data?: any) => emitStep({ type: "ACT", message, data }),
  memory: (message: string, data?: any) => emitStep({ type: "MEMORY", message, data }),
  error: (message: string, data?: any) => emitStep({ type: "ERROR", message, data })
};

// ============================================
// BROWSER-SAFE EVENT SYSTEM
// ============================================
export function createBrowserEventSystem() {
  if (typeof window === 'undefined') return null;
  
  // Custom event for browser-based real-time updates
  const PLUTO_EVENT = 'pluto-agent-step';
  
  return {
    emit: (step: AgentStep) => {
      window.dispatchEvent(new CustomEvent(PLUTO_EVENT, { detail: step }));
    },
    
    listen: (callback: (step: AgentStep) => void) => {
      const handler = (event: CustomEvent) => callback(event.detail);
      window.addEventListener(PLUTO_EVENT, handler as EventListener);
      return () => window.removeEventListener(PLUTO_EVENT, handler as EventListener);
    }
  };
}