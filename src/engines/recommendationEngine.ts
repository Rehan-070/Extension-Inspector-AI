import { EcosystemDNA, RecommendationItem } from '../types/engines';
import { InstalledExtension } from '../types/extension';

export class RecommendationEngine {
  static generateRecommendations(extensions: InstalledExtension[], dna: EcosystemDNA): RecommendationItem[] {
    const items: RecommendationItem[] = [];

    // 1. High Risk Extension Recommendations
    extensions.forEach((ext) => {
      if (ext.enabled && ext.trustScore.score < 55 && ext.id !== 'inspector-self') {
        items.push({
          id: `rec-risk-${ext.id}`,
          extensionId: ext.id,
          extensionName: ext.name,
          iconUrl: ext.icons?.[0]?.url,
          severity: 'CRITICAL',
          actionType: 'DISABLE',
          title: `Disable High Risk Extension: ${ext.name}`,
          reason: `Low Trust Score (${ext.trustScore.score}/100) due to broad web permissions or dangerous API access.`,
          impact: `Exposes web pages, cookies, or traffic to unverified script access.`,
          recommendation: `Disable or uninstall ${ext.name} unless strictly required for daily workflows.`,
          expectedImprovement: `+${100 - ext.trustScore.score} Trust Boost & -${ext.privacy.exposureScore}% Privacy Risk Exposure`,
          estimatedMemorySavingsMB: ext.performance.estimatedMemoryMB
        });
      }
    });

    // 2. Duplicate Feature Recommendations
    dna.duplicates.forEach((dup) => {
      const keepExt = extensions.find((e) => e.id === dup.recommendedKeepId);
      const disableExtNames = dup.extensionNames.filter((n) => n !== keepExt?.name);

      items.push({
        id: `rec-dup-${dup.id}`,
        severity: 'HIGH',
        actionType: 'DISABLE',
        title: `Resolve Duplicate ${dup.featureName}`,
        reason: `You have ${dup.extensionNames.length} extensions installed providing overlapping ${dup.featureName}.`,
        impact: `Causes duplicate background worker processing and waste of ~${dup.estimatedMemorySavedMB} MB RAM.`,
        recommendation: `Keep '${keepExt?.name || 'highest rated'}' and disable redundancy: ${disableExtNames.join(', ')}.`,
        expectedImprovement: `Saves ~${dup.estimatedMemorySavedMB} MB RAM & speeds up startup by ~${dup.estimatedStartupSpeedupMs} ms`,
        estimatedMemorySavingsMB: dup.estimatedMemorySavedMB
      });
    });

    // 3. Category Conflict Recommendations
    dna.conflicts.forEach((conflict) => {
      items.push({
        id: `rec-conflict-${conflict.id}`,
        severity: conflict.severity,
        actionType: 'REVIEW',
        title: `Fix Conflict: Multiple ${conflict.categoryName}`,
        reason: conflict.whyConflictOccurs,
        impact: conflict.performanceImpact,
        recommendation: conflict.howToFix,
        expectedImprovement: `Eliminates network inspection lag and tab layout re-render glitches.`
      });
    });

    // 4. Manifest V2 Deprecation Recommendations
    extensions.forEach((ext) => {
      if (ext.enabled && !ext.behavior.isMV3 && ext.id !== 'inspector-self') {
        items.push({
          id: `rec-mv2-${ext.id}`,
          extensionId: ext.id,
          extensionName: ext.name,
          iconUrl: ext.icons?.[0]?.url,
          severity: 'MEDIUM',
          actionType: 'ENABLE_MV3_ALTERNATIVE',
          title: `Upgrade MV2 Extension: ${ext.name}`,
          reason: `Uses legacy Manifest V2 background script which stays continuously active in RAM.`,
          impact: `Constant ~${ext.performance.estimatedMemoryMB} MB RAM allocation even when idle.`,
          recommendation: `Check for a Manifest V3 compliant version of ${ext.name}.`,
          expectedImprovement: `Allows background service worker to sleep when inactive.`
        });
      }
    });

    // Sort by Severity (CRITICAL -> HIGH -> MEDIUM -> LOW)
    const severityMap = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return items.sort((a, b) => severityMap[a.severity] - severityMap[b.severity]);
  }
}
