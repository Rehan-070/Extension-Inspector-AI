import { ChromeManagementService } from '../services/chromeManagement';
import { DiscoveryEngine } from '../engines/discoveryEngine';
import { ExtensionDnaEngine } from '../engines/extensionDnaEngine';
import { TimelineEngine } from '../engines/timelineEngine';
import { UiEngine } from '../engines/uiEngine';

export class BackgroundEventListenerService {
  static registerListeners(): void {
    if (!ChromeManagementService.isExtensionEnv()) {
      console.log('[Background] Non-extension environment. Event listeners skipped.');
      return;
    }

    // 1. Action Click Listener: Open dashboard tab
    chrome.action.onClicked.addListener(() => {
      chrome.tabs.create({ url: chrome.runtime.getURL('src/dashboard/index.html') });
    });

    // 2. Extension Installed Listener
    chrome.management.onInstalled.addListener(async (info) => {
      const ext = DiscoveryEngine.processExtension(info);
      await TimelineEngine.recordEvent(
        ext.id,
        ext.name,
        'INSTALLED',
        ext.trustScore.score < 55 ? 'CRITICAL' : 'LOW',
        `New Extension Installed: ${ext.name}`,
        `Version ${ext.version} installed with ${ext.permissions.length} permissions.`,
        `Trust Score: ${ext.trustScore.score}/100`,
        ext.icons?.[0]?.url
      );
      await this.refreshEcosystem();
    });

    // 3. Extension Uninstalled Listener
    chrome.management.onUninstalled.addListener(async (id) => {
      await TimelineEngine.recordEvent(
        id,
        id,
        'UNINSTALLED',
        'LOW',
        `Extension Removed`,
        `Extension ${id} was uninstalled from browser.`,
        `Freed browser resources.`
      );
      await this.refreshEcosystem();
    });

    // 4. Extension Enabled Listener
    chrome.management.onEnabled.addListener(async (info) => {
      await TimelineEngine.recordEvent(
        info.id,
        info.name,
        'ENABLED',
        'LOW',
        `Extension Enabled: ${info.name}`,
        `Extension was reactivated by user.`,
        `Re-allocated memory & permission access.`,
        info.icons?.[0]?.url
      );
      await this.refreshEcosystem();
    });

    // 5. Extension Disabled Listener
    chrome.management.onDisabled.addListener(async (info) => {
      await TimelineEngine.recordEvent(
        info.id,
        info.name,
        'DISABLED',
        'LOW',
        `Extension Disabled: ${info.name}`,
        `Extension was deactivated by user.`,
        `Freed background resources.`,
        info.icons?.[0]?.url
      );
      await this.refreshEcosystem();
    });
  }

  static async refreshEcosystem() {
    const rawList = await ChromeManagementService.getAllExtensions();
    const parsed = DiscoveryEngine.processAll(rawList);
    const dna = ExtensionDnaEngine.analyzeEcosystem(parsed);
    UiEngine.updateBadge(dna.highRiskCount);
    return { extensions: parsed, dna };
  }
}
