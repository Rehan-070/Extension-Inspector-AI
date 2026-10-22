import { InstalledExtension } from '../types/extension';
import { PermissionTranslatorEngine } from './permissionTranslator';
import { BehaviorEngine } from './behaviorEngine';
import { PrivacyEngine } from './privacyEngine';
import { PerformanceEngine } from './performanceEngine';
import { TrustEngine } from './trustEngine';

export class DiscoveryEngine {
  static processExtension(raw: chrome.management.ExtensionInfo): InstalledExtension {
    const rawPermissions = raw.permissions || [];
    const hostPermissions = raw.hostPermissions || [];

    // Detect Manifest Version (MV3 uses declarativeNetRequest or service workers, fallback check)
    let manifestVersion: 2 | 3 = 3;
    if (rawPermissions.includes('webRequestBlocking') && !rawPermissions.includes('declarativeNetRequest')) {
      manifestVersion = 2;
    }

    const permissionExplanations = PermissionTranslatorEngine.translateAll(rawPermissions, hostPermissions);
    const behavior = BehaviorEngine.analyzeBehavior(
      rawPermissions,
      hostPermissions,
      manifestVersion,
      raw.description,
      raw.name
    );
    const privacy = PrivacyEngine.analyzePrivacy(behavior, rawPermissions, hostPermissions);
    const performance = PerformanceEngine.analyzePerformance(behavior, rawPermissions, hostPermissions);
    const trustScore = TrustEngine.calculateTrustScore(
      raw.name,
      rawPermissions,
      hostPermissions,
      behavior,
      privacy,
      raw.installType
    );

    return {
      id: raw.id,
      name: raw.name,
      shortName: raw.shortName || raw.name,
      description: raw.description || 'No description provided.',
      version: raw.version,
      enabled: raw.enabled,
      mayDisable: raw.mayDisable ?? true,
      isApp: raw.isApp || false,
      installType: raw.installType,
      homepageUrl: raw.homepageUrl,
      updateUrl: raw.updateUrl,
      offlineEnabled: raw.offlineEnabled || false,
      icons: raw.icons,
      permissions: rawPermissions,
      hostPermissions,
      manifestVersion,
      trustScore,
      behavior,
      privacy,
      performance,
      permissionExplanations,
      category: behavior.primaryCategory,
      lastUpdatedTimestamp: Date.now()
    };
  }

  static processAll(rawList: chrome.management.ExtensionInfo[]): InstalledExtension[] {
    return rawList.map((ext) => this.processExtension(ext));
  }
}
