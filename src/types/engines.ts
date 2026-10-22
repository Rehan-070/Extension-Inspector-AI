import { CategoryType, InstalledExtension, RiskLevel } from './extension';

export interface ExtensionConflict {
  id: string;
  category: CategoryType;
  categoryName: string;
  extensionIds: string[];
  extensionNames: string[];
  severity: RiskLevel;
  whyConflictOccurs: string;
  performanceImpact: string;
  howToFix: string;
}

export interface DuplicateFeatureGroup {
  id: string;
  featureName: string;
  category: CategoryType;
  extensionIds: string[];
  extensionNames: string[];
  redundantPermissions: string[];
  recommendedKeepId: string;
  estimatedMemorySavedMB: number;
  estimatedStartupSpeedupMs: number;
  reasoning: string;
}

export interface EcosystemDNA {
  totalExtensions: number;
  enabledExtensions: number;
  safeCount: number;
  needsReviewCount: number;
  highRiskCount: number;
  ecosystemHealthScore: number; // 0 to 100
  ecosystemGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  totalEstimatedMemoryMB: number;
  totalHostAccessCount: number;
  conflicts: ExtensionConflict[];
  duplicates: DuplicateFeatureGroup[];
  unusedExtensions: InstalledExtension[];
  categoryDistribution: Record<CategoryType, number>;
  summaryExplanation: string;
}

export interface RecommendationItem {
  id: string;
  extensionId?: string;
  extensionName?: string;
  iconUrl?: string;
  severity: RiskLevel;
  actionType: 'DISABLE' | 'UNINSTALL' | 'REVIEW' | 'KEEP' | 'ENABLE_MV3_ALTERNATIVE';
  title: string;
  reason: string;
  impact: string;
  recommendation: string;
  expectedImprovement: string;
  estimatedMemorySavingsMB?: number;
}

export interface EducationTip {
  id: string;
  category: 'PRIVACY' | 'PERFORMANCE' | 'SECURITY' | 'ARCHITECTURE';
  title: string;
  summary: string;
  actionableAdvice: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  showNotifications: boolean;
  dangerThreshold: number; // score below which extension is flagged high risk (e.g. 50)
  performanceThresholdMB: number; // memory warning threshold (e.g. 70MB)
  autoScanOnInstall: boolean;
  ignoredExtensionIds: string[];
  trustedExtensionIds: string[];
  lastScanTimestamp: number;
}
