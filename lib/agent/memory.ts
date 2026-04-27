// ============================================================
// PLUTO MEMORY SYSTEM - Agent Memory and Learning
// Stores agent decisions, outcomes, and patterns
// ============================================================

export interface MemoryEntry {
  id: string;
  timestamp: string;
  input?: any;
  analysis?: any;
  decision?: any;
  result?: any;
  error?: string;
  processingTime?: number;
  tags?: string[];
}

export interface MemoryStats {
  totalEntries: number;
  successfulActions: number;
  failedActions: number;
  averageProcessingTime: number;
  mostCommonActions: Array<{ action: string; count: number }>;
  recentErrors: string[];
}

// ============================================
// IN-MEMORY STORAGE
// ============================================
class PlutoMemory {
  private entries: MemoryEntry[] = [];
  private maxEntries = 1000;
  
  // ============================================
  // STORE MEMORY ENTRY
  // ============================================
  store(entry: Omit<MemoryEntry, 'id'>): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const memoryEntry: MemoryEntry = {
      id,
      ...entry,
      tags: this.generateTags(entry)
    };
    
    this.entries.unshift(memoryEntry);
    
    // Keep memory size manageable
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
    
    return id;
  }
  
  // ============================================
  // RETRIEVE MEMORIES
  // ============================================
  get(id: string): MemoryEntry | null {
    return this.entries.find(e => e.id === id) || null;
  }
  
  getRecent(limit = 10): MemoryEntry[] {
    return this.entries.slice(0, limit);
  }
  
  getByTag(tag: string, limit = 20): MemoryEntry[] {
    return this.entries
      .filter(e => e.tags?.includes(tag))
      .slice(0, limit);
  }
  
  search(query: string, limit = 20): MemoryEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries
      .filter(e => 
        JSON.stringify(e).toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }
  
  // ============================================
  // MEMORY ANALYTICS
  // ============================================
  getStats(): MemoryStats {
    const successful = this.entries.filter(e => !e.error && e.result?.success !== false);
    const failed = this.entries.filter(e => e.error || e.result?.success === false);
    
    // Calculate average processing time
    const withProcessingTime = this.entries.filter(e => e.processingTime);
    const avgProcessingTime = withProcessingTime.length > 0
      ? withProcessingTime.reduce((sum, e) => sum + (e.processingTime || 0), 0) / withProcessingTime.length
      : 0;
    
    // Count actions
    const actionCounts: Record<string, number> = {};
    this.entries.forEach(e => {
      const action = e.decision?.action || e.result?.action || 'unknown';
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    });
    
    const mostCommonActions = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));
    
    // Recent errors
    const recentErrors = this.entries
      .filter(e => e.error)
      .slice(0, 5)
      .map(e => e.error || 'Unknown error');
    
    return {
      totalEntries: this.entries.length,
      successfulActions: successful.length,
      failedActions: failed.length,
      averageProcessingTime: Math.round(avgProcessingTime),
      mostCommonActions,
      recentErrors
    };
  }
  
  // ============================================
  // LEARNING AND PATTERNS
  // ============================================
  getPatterns(): any {
    // Analyze patterns in agent behavior
    const patterns = {
      commonInputTypes: this.getCommonInputTypes(),
      successfulStrategies: this.getSuccessfulStrategies(),
      failurePatterns: this.getFailurePatterns(),
      responseTimesByAction: this.getResponseTimesByAction()
    };
    
    return patterns;
  }
  
  private getCommonInputTypes(): Array<{ type: string; count: number }> {
    const typeCounts: Record<string, number> = {};
    this.entries.forEach(e => {
      const type = e.input?.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([type, count]) => ({ type, count }));
  }
  
  private getSuccessfulStrategies(): Array<{ strategy: string; successRate: number }> {
    const strategies: Record<string, { total: number; successful: number }> = {};
    
    this.entries.forEach(e => {
      const action = e.decision?.action || 'unknown';
      if (!strategies[action]) {
        strategies[action] = { total: 0, successful: 0 };
      }
      strategies[action].total++;
      if (!e.error && e.result?.success !== false) {
        strategies[action].successful++;
      }
    });
    
    return Object.entries(strategies)
      .map(([strategy, stats]) => ({
        strategy,
        successRate: stats.total > 0 ? stats.successful / stats.total : 0
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }
  
  private getFailurePatterns(): string[] {
    const failures = this.entries.filter(e => e.error || e.result?.success === false);
    const patterns: Record<string, number> = {};
    
    failures.forEach(e => {
      const error = e.error || e.result?.message || 'Unknown failure';
      patterns[error] = (patterns[error] || 0) + 1;
    });
    
    return Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pattern]) => pattern);
  }
  
  private getResponseTimesByAction(): Array<{ action: string; avgTime: number }> {
    const actionTimes: Record<string, number[]> = {};
    
    this.entries.forEach(e => {
      if (e.processingTime && e.decision?.action) {
        const action = e.decision.action;
        if (!actionTimes[action]) actionTimes[action] = [];
        actionTimes[action].push(e.processingTime);
      }
    });
    
    return Object.entries(actionTimes)
      .map(([action, times]) => ({
        action,
        avgTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length)
      }))
      .sort((a, b) => a.avgTime - b.avgTime);
  }
  
  // ============================================
  // UTILITY METHODS
  // ============================================
  getLastAction(): any {
    const lastEntry = this.entries[0];
    return lastEntry ? {
      action: lastEntry.decision?.action || 'unknown',
      timestamp: lastEntry.timestamp,
      success: !lastEntry.error && lastEntry.result?.success !== false
    } : null;
  }
  
  getSize(): number {
    return this.entries.length;
  }
  
  clear(): void {
    this.entries = [];
  }
  
  // ============================================
  // AUTO-TAGGING
  // ============================================
  private generateTags(entry: Omit<MemoryEntry, 'id'>): string[] {
    const tags: string[] = [];
    
    // Input type tags
    if (entry.input?.type) {
      tags.push(`input:${entry.input.type}`);
    }
    
    // Action tags
    if (entry.decision?.action) {
      tags.push(`action:${entry.decision.action}`);
    }
    
    // Success/failure tags
    if (entry.error) {
      tags.push('status:error');
    } else if (entry.result?.success === false) {
      tags.push('status:failed');
    } else {
      tags.push('status:success');
    }
    
    // Confidence tags
    if (entry.analysis?.confidence) {
      const confidence = entry.analysis.confidence;
      if (confidence >= 0.8) tags.push('confidence:high');
      else if (confidence >= 0.5) tags.push('confidence:medium');
      else tags.push('confidence:low');
    }
    
    // Risk level tags
    if (entry.analysis?.riskScore) {
      const risk = entry.analysis.riskScore;
      if (risk >= 70) tags.push('risk:high');
      else if (risk >= 35) tags.push('risk:medium');
      else tags.push('risk:low');
    }
    
    // Processing time tags
    if (entry.processingTime) {
      if (entry.processingTime > 5000) tags.push('speed:slow');
      else if (entry.processingTime > 1000) tags.push('speed:medium');
      else tags.push('speed:fast');
    }
    
    return tags;
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================
export const memory = new PlutoMemory();