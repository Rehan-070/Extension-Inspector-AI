export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TrustGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export type CategoryType = 
  | 'AD_BLOCKER'
  | 'PASSWORD_MANAGER'
  | 'DARK_MODE'
  | 'GRAMMAR_CHECK'
  | 'VPN'
  | 'PDF_VIEWER'
  | 'SHOPPING_ASSISTANT'
  | 'DEVELOPER_TOOLS'
  | 'ACCESSIBILITY'
  | 'PRODUCTIVITY'
  | 'OTHER';

export interface PermissionExplanation {
  permission: string;
  name: string;
  riskLevel: RiskLevel;
  category: 'PRIVACY' | 'SECURITY' | 'PERFORMANCE' | 'SYSTEM';
  description: string;
  technicalImpact: string;
}

export interface TrustScoreBreakdown {
  score: number; // 0 to 100
  grade: TrustGrade;
  baseScore: number;
  permissionDeduction: number;
  hostPermissionDeduction: number;
  developerBonus: number;
  mv3Bonus: number;
  activityDeduction: number;
  positiveFactors: string[];
  negativeFactors: string[];
  improvementSteps: string[];
}

export interface BehaviorAnalysis {
  hasHostPermissions: boolean;
  accessesAllSites: boolean;
  injectsContentScripts: boolean;
  usesWebRequest: boolean;
  usesCookies: boolean;
  usesNativeMessaging: boolean;
  usesDebugger: boolean;
  usesClipboard: boolean;
  canExecuteScript: boolean;
  isMV3: boolean;
  primaryCategory: CategoryType;
  detectedBehaviors: string[];
}

export interface PrivacyReport {
  exposureScore: number; // 0 (Low Risk) to 100 (High Risk)
  sensitiveAccessLevel: 'NONE' | 'SPECIFIC_SITES' | 'ALL_SITES';
  readsCookies: boolean;
  monitorsNetwork: boolean;
  modifiesHeaders: boolean;
  bypassesCORS: boolean;
  dataRiskSummary: string;
  plainEnglishSummary: string;
}

export interface PerformanceReport {
  estimatedMemoryMB: number;
  estimatedStartupDelayMs: number;
  scriptSizeImpact: 'LIGHT' | 'MODERATE' | 'HEAVY';
  contentScriptCount: number;
  hasBackgroundWorker: boolean;
  performanceScore: number; // 0 (Heavy) to 100 (Lightweight)
  explanation: string;
}

export interface InstalledExtension {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  version: string;
  enabled: boolean;
  mayDisable: boolean;
  isApp: boolean;
  installType: chrome.management.ExtensionInstallType;
  homepageUrl?: string;
  updateUrl?: string;
  offlineEnabled: boolean;
  icons?: chrome.management.IconInfo[];
  permissions: string[];
  hostPermissions: string[];
  
  // Computed Engine Data
  manifestVersion: 2 | 3;
  trustScore: TrustScoreBreakdown;
  behavior: BehaviorAnalysis;
  privacy: PrivacyReport;
  performance: PerformanceReport;
  permissionExplanations: PermissionExplanation[];
  category: CategoryType;
  lastUpdatedTimestamp?: number;
}
