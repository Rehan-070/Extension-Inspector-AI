import { BehaviorAnalysis, PrivacyReport, TrustGrade, TrustScoreBreakdown } from '../types/extension';

export class TrustEngine {
  static calculateTrustScore(
    name: string,
    permissions: string[],
    hostPermissions: string[],
    behavior: BehaviorAnalysis,
    privacy: PrivacyReport,
    installType: chrome.management.ExtensionInstallType = 'normal'
  ): TrustScoreBreakdown {
    let score = 100;
    const positiveFactors: string[] = [];
    const negativeFactors: string[] = [];
    const improvementSteps: string[] = [];

    // Base Manifest V3 Bonus
    let mv3Bonus = 0;
    if (behavior.isMV3) {
      mv3Bonus = 10;
      positiveFactors.push('Uses Manifest V3 architecture (Enhanced background security & automatic idle worker sleeping)');
    } else {
      negativeFactors.push('Uses deprecated Manifest V2 persistent background page');
      improvementSteps.push('Migrate or replace with a Manifest V3 alternative when available');
    }

    // Developer / Admin Install Bonus
    let developerBonus = 0;
    if (installType === 'admin') {
      developerBonus = 5;
      positiveFactors.push('Installed & managed by Enterprise Admin policy');
    }

    // Permission Deductions
    let permissionDeduction = 0;
    if (permissions.includes('debugger')) {
      permissionDeduction += 30;
      negativeFactors.push('Requests full Browser Debugger control (V8 JavaScript inspection & network capture)');
    }
    if (permissions.includes('proxy')) {
      permissionDeduction += 25;
      negativeFactors.push('Requests Network Proxy modification capabilities');
    }
    if (permissions.includes('webRequestBlocking')) {
      permissionDeduction += 20;
      negativeFactors.push('Requests blocking network request modification (MV2 style webRequestBlocking)');
    }
    if (permissions.includes('cookies')) {
      permissionDeduction += 15;
      negativeFactors.push('Requests access to browser cookies');
    }

    // Host Permission Deductions
    let hostPermissionDeduction = 0;
    if (behavior.accessesAllSites) {
      hostPermissionDeduction += 25;
      negativeFactors.push('Has host access permissions for ALL websites (<all_urls> or *://*/*)');
      improvementSteps.push('Restrict host permissions in Chrome extension settings to specific sites if possible');
    } else if (behavior.hasHostPermissions) {
      hostPermissionDeduction += 10;
      negativeFactors.push('Has host access permissions for specific external web domains');
    } else {
      positiveFactors.push('Zero host access permissions (Cannot read external web pages)');
    }

    // Activity / Privacy Deductions
    let activityDeduction = 0;
    if (privacy.exposureScore > 75) {
      activityDeduction += 15;
      negativeFactors.push('High overall privacy exposure score');
    }

    // Minimal Permissions Bonus
    if (permissions.length <= 3 && hostPermissions.length === 0) {
      positiveFactors.push('Follows Principle of Least Privilege (Minimal requested permissions)');
    }

    // Calculate final score
    score = score + mv3Bonus + developerBonus - permissionDeduction - hostPermissionDeduction - activityDeduction;
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Assign Grade
    let grade: TrustGrade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';

    if (improvementSteps.length === 0) {
      improvementSteps.push('No actions required. Extension trust score is optimal.');
    }

    return {
      score,
      grade,
      baseScore: 100,
      permissionDeduction,
      hostPermissionDeduction,
      developerBonus,
      mv3Bonus,
      activityDeduction,
      positiveFactors,
      negativeFactors,
      improvementSteps
    };
  }
}
