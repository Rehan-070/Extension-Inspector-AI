import { UserSettings } from '../types/engines';
import { TimelineEvent } from '../types/timeline';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  showNotifications: true,
  dangerThreshold: 55,
  performanceThresholdMB: 60,
  autoScanOnInstall: true,
  ignoredExtensionIds: [],
  trustedExtensionIds: [],
  lastScanTimestamp: Date.now()
};

export class ChromeStorageService {
  private static isExtensionEnv(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
  }

  static async getSettings(): Promise<UserSettings> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['settings'], (result) => {
          if (result.settings) {
            resolve({ ...DEFAULT_SETTINGS, ...result.settings });
          } else {
            resolve(DEFAULT_SETTINGS);
          }
        });
      });
    } else {
      const stored = localStorage.getItem('ext_inspector_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ settings }, () => resolve());
      });
    } else {
      localStorage.setItem('ext_inspector_settings', JSON.stringify(settings));
    }
  }

  static async getTimeline(): Promise<TimelineEvent[]> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['timeline'], (result) => {
          resolve(result.timeline || []);
        });
      });
    } else {
      const stored = localStorage.getItem('ext_inspector_timeline');
      return stored ? JSON.parse(stored) : [];
    }
  }

  static async addTimelineEvent(event: TimelineEvent): Promise<void> {
    const current = await this.getTimeline();
    // Keep max 200 events to prevent unbounded growth
    const updated = [event, ...current].slice(0, 200);

    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ timeline: updated }, () => resolve());
      });
    } else {
      localStorage.setItem('ext_inspector_timeline', JSON.stringify(updated));
    }
  }

  static async clearTimeline(): Promise<void> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.storage.local.remove(['timeline'], () => resolve());
      });
    } else {
      localStorage.removeItem('ext_inspector_timeline');
    }
  }
}
