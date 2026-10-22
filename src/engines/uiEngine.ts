export class UiEngine {
  static updateBadge(highRiskCount: number): void {
    if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setBadgeText) {
      if (highRiskCount > 0) {
        chrome.action.setBadgeText({ text: highRiskCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // red alert
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
    }
  }

  static formatMemory(mb: number): string {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${Math.round(mb)} MB`;
  }

  static formatTime(ms: number): string {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)} s`;
    }
    return `${Math.round(ms)} ms`;
  }

  static getTrustColor(score: number): { text: string; bg: string; border: string } {
    if (score >= 80) return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 55) return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
    return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
  }
}
