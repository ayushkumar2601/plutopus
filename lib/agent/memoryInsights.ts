// ============================================================
// PLUTO MEMORY INSIGHTS - Pattern Analysis and Learning
// Generates intelligent insights from agent memory
// ============================================================

import { memory } from './memory';

export interface MemoryInsight {
  type: 'pattern' | 'learning' | 'success' | 'warning' | 'info';
  message: string;
  confidence: number;
  data?: any;
}

// ============================================
// MAIN INSIGHT GENERATION
// ============================================
export function getMemoryInsight(currentInput?: any): MemoryInsight {
  try {
    const recentMemory = memory.getRecent(20);
    const stats = memory.getStats();
    
    if (recentMemory.length === 0) {
      return {
        type: 'info',
        message: 'PLUTO is learning from new experiences',
        confidence: 1.0
      };
    }
    
    // Check for IP patterns
    if (currentInput?.ip) {
      const ipInsight = analyzeIPPattern(currentInput.ip, recentMemory);
      if (ipInsight) return ipInsight;
    }
    
    // Check for attack type patterns
    if (currentInput?.attackType) {
      const attackInsight = analyzeAttackPattern(currentInput.attackType, recentMemory);
      if (attackInsight) return attackInsight;
    }
    
    // Check recent success patterns
    const successInsight = analyzeSuccessPatterns(recentMemory, stats);
    if (successInsight) return successInsight;
    
    // Check for learning trends
    const learningInsight = analyzeLearningTrends(recentMemory, stats);
    if (learningInsight) return learningInsight;
    
    // Default insight based on recent activity
    return generateDefaultInsight(recentMemory, stats);
    
  } catch (error) {
    console.warn('Memory insight generation error:', error);
    return {
      type: 'info',
      message: 'PLUTO continues monitoring and learning',
      confidence: 0.5
    };
  }
}

// ============================================
// IP PATTERN ANALYSIS
// ============================================
function analyzeIPPattern(currentIP: string, recentMemory: any[]): MemoryInsight | null {
  const ipEntries = recentMemory.filter(entry => 
    entry.input?.ip === currentIP || 
    entry.decision?.params?.ip === currentIP
  );
  
  if (ipEntries.length > 1) {
    const lastEntry = ipEntries[0];
    const previousActions = ipEntries.map(e => e.decision?.action).filter(Boolean);
    const successCount = ipEntries.filter(e => e.result?.success !== false).length;
    
    if (previousActions.includes('block_ip')) {
      return {
        type: 'pattern',
        message: `IP ${currentIP} was blocked ${ipEntries.length - 1} time(s) before. Previous action: BLOCK → ${successCount > 0 ? 'SUCCESS' : 'FAILED'}`,
        confidence: 0.9,
        data: { ip: currentIP, previousCount: ipEntries.length - 1, successRate: successCount / ipEntries.length }
      };
    }
    
    if (previousActions.includes('rate_limit_ip')) {
      return {
        type: 'learning',
        message: `IP ${currentIP} pattern detected. Previously rate-limited ${ipEntries.length - 1} time(s). Escalating response.`,
        confidence: 0.8,
        data: { ip: currentIP, escalation: true }
      };
    }
  }
  
  return null;
}

// ============================================
// ATTACK TYPE PATTERN ANALYSIS
// ============================================
function analyzeAttackPattern(attackType: string, recentMemory: any[]): MemoryInsight | null {
  const attackEntries = recentMemory.filter(entry => 
    entry.analysis?.attackType === attackType ||
    entry.input?.attackType === attackType
  );
  
  if (attackEntries.length > 2) {
    const successfulBlocks = attackEntries.filter(e => 
      e.decision?.action === 'block_ip' && e.result?.success !== false
    ).length;
    
    const recentTrend = attackEntries.slice(0, 5);
    const avgConfidence = recentTrend.reduce((sum, e) => sum + (e.analysis?.confidence || 0), 0) / recentTrend.length;
    
    return {
      type: 'pattern',
      message: `${attackType} attacks detected ${attackEntries.length} times. Success rate: ${Math.round((successfulBlocks / attackEntries.length) * 100)}%. Confidence improving: ${Math.round(avgConfidence * 100)}%`,
      confidence: avgConfidence,
      data: { attackType, count: attackEntries.length, successRate: successfulBlocks / attackEntries.length }
    };
  }
  
  return null;
}

// ============================================
// SUCCESS PATTERN ANALYSIS
// ============================================
function analyzeSuccessPatterns(recentMemory: any[], stats: any): MemoryInsight | null {
  if (stats.successfulActions > 5) {
    const recentSuccesses = recentMemory.filter(e => e.result?.success !== false).slice(0, 10);
    const mostCommonTool = stats.mostCommonActions?.[0];
    
    if (mostCommonTool && mostCommonTool.count > 3) {
      return {
        type: 'success',
        message: `PLUTO has successfully executed ${stats.successfulActions} actions. Most effective tool: ${mostCommonTool.action} (${mostCommonTool.count} uses)`,
        confidence: 0.85,
        data: { successCount: stats.successfulActions, preferredTool: mostCommonTool.action }
      };
    }
  }
  
  return null;
}

// ============================================
// LEARNING TRENDS ANALYSIS
// ============================================
function analyzeLearningTrends(recentMemory: any[], stats: any): MemoryInsight | null {
  if (recentMemory.length > 10) {
    const recent5 = recentMemory.slice(0, 5);
    const previous5 = recentMemory.slice(5, 10);
    
    const recentAvgConfidence = recent5.reduce((sum, e) => sum + (e.analysis?.confidence || 0), 0) / recent5.length;
    const previousAvgConfidence = previous5.reduce((sum, e) => sum + (e.analysis?.confidence || 0), 0) / previous5.length;
    
    const confidenceImprovement = recentAvgConfidence - previousAvgConfidence;
    
    if (confidenceImprovement > 0.1) {
      return {
        type: 'learning',
        message: `PLUTO's decision confidence is improving. Recent average: ${Math.round(recentAvgConfidence * 100)}% (+${Math.round(confidenceImprovement * 100)}%)`,
        confidence: recentAvgConfidence,
        data: { improvement: confidenceImprovement, trend: 'improving' }
      };
    }
    
    if (confidenceImprovement < -0.1) {
      return {
        type: 'warning',
        message: `PLUTO is encountering more complex threats. Adapting decision models. Recent confidence: ${Math.round(recentAvgConfidence * 100)}%`,
        confidence: recentAvgConfidence,
        data: { improvement: confidenceImprovement, trend: 'adapting' }
      };
    }
  }
  
  return null;
}

// ============================================
// DEFAULT INSIGHT GENERATION
// ============================================
function generateDefaultInsight(recentMemory: any[], stats: any): MemoryInsight {
  const totalActions = stats.totalEntries;
  const avgProcessingTime = stats.averageProcessingTime;
  
  if (totalActions < 5) {
    return {
      type: 'info',
      message: `PLUTO is building threat intelligence. ${totalActions} decisions made so far.`,
      confidence: 0.7,
      data: { totalActions, phase: 'learning' }
    };
  }
  
  if (avgProcessingTime < 1000) {
    return {
      type: 'success',
      message: `PLUTO is operating efficiently. Average response time: ${avgProcessingTime}ms. ${totalActions} total decisions.`,
      confidence: 0.8,
      data: { avgProcessingTime, totalActions, performance: 'optimal' }
    };
  }
  
  return {
    type: 'info',
    message: `PLUTO continues autonomous monitoring. ${totalActions} security decisions made.`,
    confidence: 0.75,
    data: { totalActions, status: 'monitoring' }
  };
}

// ============================================
// INSIGHT FORMATTING HELPERS
// ============================================
export function formatInsightForUI(insight: MemoryInsight): string {
  const icons = {
    pattern: '🔍',
    learning: '🧠',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  return `${icons[insight.type]} ${insight.message}`;
}

export function getInsightColor(insight: MemoryInsight): string {
  const colors = {
    pattern: '#00eaff',    // cyan
    learning: '#9B59B6',   // purple
    success: '#00ff88',    // green
    warning: '#facc15',    // yellow
    info: '#6b7280'        // gray
  };
  
  return colors[insight.type];
}

// ============================================
// BATCH INSIGHTS FOR DASHBOARD
// ============================================
export function getMultipleInsights(limit = 3): MemoryInsight[] {
  const insights: MemoryInsight[] = [];
  const recentMemory = memory.getRecent(20);
  const stats = memory.getStats();
  
  // Get different types of insights
  const mainInsight = getMemoryInsight();
  insights.push(mainInsight);
  
  // Add performance insight if different
  if (stats.averageProcessingTime > 0) {
    const perfInsight: MemoryInsight = {
      type: stats.averageProcessingTime < 1000 ? 'success' : 'info',
      message: `Response time: ${stats.averageProcessingTime}ms avg`,
      confidence: 0.9,
      data: { metric: 'performance', value: stats.averageProcessingTime }
    };
    insights.push(perfInsight);
  }
  
  // Add memory utilization insight
  if (stats.totalEntries > 0) {
    const memoryInsight: MemoryInsight = {
      type: 'info',
      message: `Memory: ${stats.totalEntries} entries, ${stats.successfulActions} successful`,
      confidence: 0.8,
      data: { metric: 'memory', entries: stats.totalEntries, success: stats.successfulActions }
    };
    insights.push(memoryInsight);
  }
  
  return insights.slice(0, limit);
}