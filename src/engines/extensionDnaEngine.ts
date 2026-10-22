import { EcosystemDNA } from '../types/engines';
import { CategoryType, InstalledExtension } from '../types/extension';
import { ConflictEngine } from './conflictEngine';
import { DuplicateEngine } from './duplicateEngine';

export class ExtensionDnaEngine {
  static analyzeEcosystem(extensions: InstalledExtension[]): EcosystemDNA {
    const totalExtensions = extensions.length;
    const enabledExtensions = extensions.filter((e) => e.enabled).length;

    let safeCount = 0;
    let needsReviewCount = 0;
    let highRiskCount = 0;
    let totalEstimatedMemoryMB = 0;
    let totalHostAccessCount = 0;

    const categoryDistribution: Record<CategoryType, number> = {
      AD_BLOCKER: 0,
      PASSWORD_MANAGER: 0,
      DARK_MODE: 0,
      GRAMMAR_CHECK: 0,
      VPN: 0,
      PDF_VIEWER: 0,
      SHOPPING_ASSISTANT: 0,
      DEVELOPER_TOOLS: 0,
      ACCESSIBILITY: 0,
      PRODUCTIVITY: 0,
      OTHER: 0
    };

    const unusedExtensions: InstalledExtension[] = [];

    extensions.forEach((ext) => {
      if (ext.enabled) {
        totalEstimatedMemoryMB += ext.performance.estimatedMemoryMB;
        if (ext.behavior.hasHostPermissions) {
          totalHostAccessCount++;
        }

        categoryDistribution[ext.category] = (categoryDistribution[ext.category] || 0) + 1;
      }

      if (ext.trustScore.score >= 80) {
        safeCount++;
      } else if (ext.trustScore.score >= 55) {
        needsReviewCount++;
      } else {
        highRiskCount++;
      }

      // Check if extension appears unused (e.g. disabled or redundant)
      if (!ext.enabled && ext.id !== 'inspector-self') {
        unusedExtensions.push(ext);
      }
    });

    const conflicts = ConflictEngine.detectConflicts(extensions);
    const duplicates = DuplicateEngine.detectDuplicates(extensions);

    // Compute Ecosystem Health Score (100 = Perfect)
    let healthScore = 100;
    healthScore -= highRiskCount * 15;
    healthScore -= needsReviewCount * 5;
    healthScore -= conflicts.length * 10;
    healthScore -= duplicates.length * 8;
    if (totalEstimatedMemoryMB > 250) healthScore -= 10;
    if (totalHostAccessCount > 5) healthScore -= 10;

    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    let ecosystemGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (healthScore >= 90) ecosystemGrade = 'A+';
    else if (healthScore >= 80) ecosystemGrade = 'A';
    else if (healthScore >= 70) ecosystemGrade = 'B';
    else if (healthScore >= 60) ecosystemGrade = 'C';
    else if (healthScore >= 50) ecosystemGrade = 'D';

    let summaryExplanation = 'Optimal ecosystem security and performance footprint.';
    if (healthScore < 60) {
      summaryExplanation = `Ecosystem needs attention: ${highRiskCount} high-risk extensions, ${conflicts.length} active conflicts, and ~${totalEstimatedMemoryMB} MB RAM consumption detected.`;
    } else if (healthScore < 80) {
      summaryExplanation = `Moderate ecosystem health: ${conflicts.length} overlapping category conflicts identified.`;
    }

    return {
      totalExtensions,
      enabledExtensions,
      safeCount,
      needsReviewCount,
      highRiskCount,
      ecosystemHealthScore: healthScore,
      ecosystemGrade,
      totalEstimatedMemoryMB,
      totalHostAccessCount,
      conflicts,
      duplicates,
      unusedExtensions,
      categoryDistribution,
      summaryExplanation
    };
  }
}
