import { UserSettings } from '../types/engines';
import { ChromeStorageService } from '../services/chromeStorage';

export class SettingsEngine {
  static async loadSettings(): Promise<UserSettings> {
    return ChromeStorageService.getSettings();
  }

  static async updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
    const current = await this.loadSettings();
    const updated = { ...current, ...partial, lastScanTimestamp: Date.now() };
    await ChromeStorageService.saveSettings(updated);
    return updated;
  }

  static async toggleTrustedExtension(extensionId: string): Promise<UserSettings> {
    const current = await this.loadSettings();
    const trusted = new Set(current.trustedExtensionIds);
    if (trusted.has(extensionId)) {
      trusted.delete(extensionId);
    } else {
      trusted.add(extensionId);
    }
    return this.updateSettings({ trustedExtensionIds: Array.from(trusted) });
  }

  static async toggleIgnoredExtension(extensionId: string): Promise<UserSettings> {
    const current = await this.loadSettings();
    const ignored = new Set(current.ignoredExtensionIds);
    if (ignored.has(extensionId)) {
      ignored.delete(extensionId);
    } else {
      ignored.add(extensionId);
    }
    return this.updateSettings({ ignoredExtensionIds: Array.from(ignored) });
  }
}
