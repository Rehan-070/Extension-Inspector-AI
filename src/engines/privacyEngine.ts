import { BehaviorAnalysis, PrivacyReport } from '../types/extension';

export class PrivacyEngine {
  static analyzePrivacy(behavior: BehaviorAnalysis, permissions: string[], hostPermissions: string[]): PrivacyReport {
    let exposureScore = 10; // baseline score
    const allPerms = [...permissions, ...hostPermissions];

    let sensitiveAccessLevel: 'NONE' | 'SPECIFIC_SITES' | 'ALL_SITES' = 'NONE';
    if (behavior.accessesAllSites) {
      sensitiveAccessLevel = 'ALL_SITES';
      exposureScore += 45;
    } else if (behavior.hasHostPermissions) {
      sensitiveAccessLevel = 'SPECIFIC_SITES';
      exposureScore += 25;
    }

    const readsCookies = behavior.usesCookies;
    if (readsCookies) exposureScore += 20;

    const monitorsNetwork = behavior.usesWebRequest || allPerms.includes('webNavigation');
    if (monitorsNetwork) exposureScore += 15;

    const modifiesHeaders = allPerms.includes('webRequestBlocking') || allPerms.includes('declarativeNetRequest');
    if (modifiesHeaders) exposureScore += 10;

    const bypassesCORS = allPerms.includes('declarativeNetRequestWithHostAccess') || allPerms.includes('proxy');
    if (bypassesCORS) exposureScore += 15;

    exposureScore = Math.min(100, Math.max(0, exposureScore));

    let dataRiskSummary = 'Minimal privacy exposure. Extension operates with safe, restricted permissions.';
    if (exposureScore > 75) {
      dataRiskSummary = 'HIGH PRIVACY EXPOSURE: Extension can inspect web pages, cookies, or traffic across all websites.';
    } else if (exposureScore > 40) {
      dataRiskSummary = 'MODERATE PRIVACY EXPOSURE: Scoped host access or specific tab reading permissions present.';
    }

    let plainEnglishSummary = 'This extension does not read or intercept your sensitive browsing data.';
    if (behavior.accessesAllSites && readsCookies) {
      plainEnglishSummary = 'This extension can read information from websites you visit AND view session cookies.';
    } else if (behavior.accessesAllSites) {
      plainEnglishSummary = 'This extension can read information from websites you visit.';
    } else if (behavior.hasHostPermissions) {
      plainEnglishSummary = 'This extension can access data on specific configured websites.';
    }

    return {
      exposureScore,
      sensitiveAccessLevel,
      readsCookies,
      monitorsNetwork,
      modifiesHeaders,
      bypassesCORS,
      dataRiskSummary,
      plainEnglishSummary
    };
  }
}
