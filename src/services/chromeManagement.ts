export class ChromeManagementService {
  public static isExtensionEnv(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.management && !!chrome.management.getAll;
  }

  static async getAllExtensions(): Promise<chrome.management.ExtensionInfo[]> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.management.getAll((items) => resolve(items));
      });
    } else {
      return this.getMockExtensions();
    }
  }

  static async setExtensionEnabled(id: string, enabled: boolean): Promise<void> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.management.setEnabled(id, enabled, () => resolve());
      });
    } else {
      console.log(`[Mock Management] Set extension ${id} enabled = ${enabled}`);
    }
  }

  static async uninstallExtension(id: string): Promise<void> {
    if (this.isExtensionEnv()) {
      return new Promise((resolve) => {
        chrome.management.uninstall(id, { showConfirmDialog: true }, () => resolve());
      });
    } else {
      console.log(`[Mock Management] Uninstall extension ${id}`);
    }
  }

  private static getMockExtensions(): chrome.management.ExtensionInfo[] {
    return [
      {
        id: "inspector-self",
        name: "Extension Inspector AI",
        shortName: "Extension Inspector",
        description: "Smartest Browser Extension Inspector - Trust, Performance, Privacy & DNA Engine",
        version: "1.0.0",
        enabled: true,
        mayDisable: false,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: true,
        permissions: ["management", "storage", "alarms"],
        hostPermissions: [],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:shield-check.svg" }]
      },
      {
        id: "adblock-plus-mock",
        name: "uBlock Origin Pro",
        shortName: "uBlock Pro",
        description: "An efficient ad blocker. Easy on CPU and memory.",
        version: "1.55.0",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: true,
        permissions: ["webRequest", "webRequestBlocking", "storage", "tabs", "declarativeNetRequest"],
        hostPermissions: ["<all_urls>"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:shield-alert.svg" }]
      },
      {
        id: "adblock-second-mock",
        name: "AdBlock Ultimate",
        shortName: "AdBlock",
        description: "Block all unwanted ads, popups, and banners across websites.",
        version: "3.7.2",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: true,
        permissions: ["webRequest", "cookies", "tabs", "declarativeNetRequest"],
        hostPermissions: ["*://*/*"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:ban.svg" }]
      },
      {
        id: "grammarly-mock",
        name: "Grammar & Spell Checker",
        shortName: "GrammarCheck",
        description: "Improve your writing with real-time spell checking and grammar corrections.",
        version: "14.1082.0",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: false,
        permissions: ["activeTab", "contextMenus", "storage", "cookies"],
        hostPermissions: ["https://*/*", "http://*/*"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:file-text.svg" }]
      },
      {
        id: "languagetool-mock",
        name: "LanguageTool Grammar Inspector",
        shortName: "LanguageTool",
        description: "Check spelling and grammar in over 30 languages.",
        version: "8.2.1",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: false,
        permissions: ["activeTab", "storage"],
        hostPermissions: ["<all_urls>"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:check-check.svg" }]
      },
      {
        id: "dark-reader-mock",
        name: "Dark Reader Eye Care",
        shortName: "Dark Reader",
        description: "Invert brightness of web pages and apply dark mode for night reading.",
        version: "4.9.77",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: true,
        permissions: ["storage", "fontSettings", "tabs"],
        hostPermissions: ["<all_urls>"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:moon.svg" }]
      },
      {
        id: "pdf-magic-mock",
        name: "PDF Convertor & Reader",
        shortName: "PDF Reader",
        description: "View, edit, and convert PDF files directly in your browser.",
        version: "2.1.0",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: true,
        permissions: ["fileSystem", "storage", "downloads"],
        hostPermissions: ["file://*/*"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:file-code.svg" }]
      },
      {
        id: "suspicious-free-vpn-mock",
        name: "Super Fast Unlimited Free VPN",
        shortName: "Free VPN",
        description: "Unblock restricted websites and secure your connection for free.",
        version: "0.9.1",
        enabled: true,
        mayDisable: true,
        isApp: false,
        type: "extension" as chrome.management.ExtensionType,
        installType: "normal" as chrome.management.ExtensionInstallType,
        offlineEnabled: false,
        permissions: ["proxy", "privacy", "webRequest", "webRequestBlocking", "cookies", "management", "debugger"],
        hostPermissions: ["<all_urls>"],
        icons: [{ size: 48, url: "https://api.iconify.design/lucide:lock-keyhole.svg" }]
      }
    ];
  }
}
