import { BehaviorAnalysis, PerformanceReport } from '../types/extension';

export class PerformanceEngine {
  static analyzePerformance(behavior: BehaviorAnalysis, permissions: string[], hostPermissions: string[]): PerformanceReport {
    let estimatedMemoryMB = 15; // baseline extension runtime overhead
    let estimatedStartupDelayMs = 5; // baseline registration overhead
    let contentScriptCount = 0;

    const allPerms = [...permissions, ...hostPermissions];

    // Heavy features assessment
    if (behavior.accessesAllSites) {
      estimatedMemoryMB += 25;
      estimatedStartupDelayMs += 20;
      contentScriptCount += 2;
    } else if (behavior.hasHostPermissions) {
      estimatedMemoryMB += 12;
      estimatedStartupDelayMs += 10;
      contentScriptCount += 1;
    }

    if (behavior.usesWebRequest) {
      estimatedMemoryMB += 18;
      estimatedStartupDelayMs += 15;
    }

    if (behavior.usesDebugger) {
      estimatedMemoryMB += 35;
      estimatedStartupDelayMs += 40;
    }

    if (allPerms.includes('declarativeNetRequest')) {
      estimatedMemoryMB += 8; // MV3 declarative is light
      estimatedStartupDelayMs += 3;
    }

    // MV2 background pages stay alive, while MV3 service workers sleep
    const hasBackgroundWorker = true;
    if (!behavior.isMV3) {
      estimatedMemoryMB += 20; // persistent background page penalty
      estimatedStartupDelayMs += 25;
    }

    let scriptSizeImpact: 'LIGHT' | 'MODERATE' | 'HEAVY' = 'LIGHT';
    if (estimatedMemoryMB > 55) {
      scriptSizeImpact = 'HEAVY';
    } else if (estimatedMemoryMB > 30) {
      scriptSizeImpact = 'MODERATE';
    }

    // Performance Score (100 = optimal light, 0 = severe overhead)
    const performanceScore = Math.max(10, Math.min(100, 100 - Math.round(estimatedMemoryMB * 0.9 + estimatedStartupDelayMs * 0.4)));

    let explanation = 'Lightweight extension with minimal RAM and CPU footprint.';
    if (performanceScore < 50) {
      explanation = `Heavy footprint: consumes ~${estimatedMemoryMB} MB RAM and adds ~${estimatedStartupDelayMs} ms to browser startup time.`;
    } else if (performanceScore < 75) {
      explanation = `Moderate footprint: consumes ~${estimatedMemoryMB} MB RAM with standard script injection.`;
    }

    return {
      estimatedMemoryMB,
      estimatedStartupDelayMs,
      scriptSizeImpact,
      contentScriptCount,
      hasBackgroundWorker,
      performanceScore,
      explanation
    };
  }
}
