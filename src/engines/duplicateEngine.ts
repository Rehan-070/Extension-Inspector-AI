import { DuplicateFeatureGroup } from '../types/engines';
import { InstalledExtension } from '../types/extension';

export class DuplicateEngine {
  static detectDuplicates(extensions: InstalledExtension[]): DuplicateFeatureGroup[] {
    const enabled = extensions.filter((ext) => ext.enabled && ext.id !== 'inspector-self');
    const duplicates: DuplicateFeatureGroup[] = [];

    // Group by Category
    const categoryMap: Map<string, InstalledExtension[]> = new Map();
    enabled.forEach((ext) => {
      const cat = ext.category;
      if (cat !== 'OTHER') {
        const list = categoryMap.get(cat) || [];
        list.push(ext);
        categoryMap.set(cat, list);
      }
    });

    categoryMap.forEach((group, cat) => {
      if (group.length >= 2) {
        // Find best candidate to keep based on Trust Score and Performance Score
        const sorted = [...group].sort((a, b) => {
          const scoreA = a.trustScore.score * 0.6 + a.performance.performanceScore * 0.4;
          const scoreB = b.trustScore.score * 0.6 + b.performance.performanceScore * 0.4;
          return scoreB - scoreA;
        });

        const keepExt = sorted[0];
        const redundantExts = sorted.slice(1);

        const totalSavedMB = redundantExts.reduce((acc, curr) => acc + curr.performance.estimatedMemoryMB, 0);
        const totalSavedMs = redundantExts.reduce((acc, curr) => acc + curr.performance.estimatedStartupDelayMs, 0);

        const allPermissions = Array.from(new Set(redundantExts.flatMap((e) => e.permissions)));

        duplicates.push({
          id: `dup-${cat.toLowerCase()}`,
          featureName: `${cat.replace('_', ' ')} Functionality`,
          category: cat as any,
          extensionIds: group.map((e) => e.id),
          extensionNames: group.map((e) => e.name),
          redundantPermissions: allPermissions,
          recommendedKeepId: keepExt.id,
          estimatedMemorySavedMB: Math.round(totalSavedMB),
          estimatedStartupSpeedupMs: Math.round(totalSavedMs),
          reasoning: `Recommended keeping '${keepExt.name}' due to higher Trust Score (${keepExt.trustScore.score}/100) and lighter performance footprint.`
        });
      }
    });

    return duplicates;
  }
}
