import { BackgroundEventListenerService } from './eventListeners';
import { ChromeManagementService } from '../services/chromeManagement';
import { DiscoveryEngine } from '../engines/discoveryEngine';
import { ExtensionDnaEngine } from '../engines/extensionDnaEngine';
import { RecommendationEngine } from '../engines/recommendationEngine';
import { SettingsEngine } from '../engines/settingsEngine';
import { TimelineEngine } from '../engines/timelineEngine';
import { EducationEngine } from '../engines/educationEngine';
import { ExtensionMessage, ExtensionResponse } from '../services/messaging';

// Register background listeners
BackgroundEventListenerService.registerListeners();

// Initialize on install or startup
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    BackgroundEventListenerService.refreshEcosystem();
  });
}

// Handle messaging from Dashboard
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse: (res: ExtensionResponse) => void) => {
    handleIncomingMessage(message)
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // async response
  });
}

async function handleIncomingMessage(message: ExtensionMessage): Promise<any> {
  switch (message.action) {
    case 'GET_ECOSYSTEM_DATA':
    case 'RESCAN_ECOSYSTEM': {
      const raw = await ChromeManagementService.getAllExtensions();
      const extensions = DiscoveryEngine.processAll(raw);
      const dna = ExtensionDnaEngine.analyzeEcosystem(extensions);
      const recommendations = RecommendationEngine.generateRecommendations(extensions, dna);
      const tips = EducationEngine.getTips();
      const settings = await SettingsEngine.loadSettings();

      return {
        extensions,
        dna,
        recommendations,
        tips,
        settings
      };
    }

    case 'TOGGLE_EXTENSION': {
      const { id, enabled } = message.payload;
      await ChromeManagementService.setExtensionEnabled(id, enabled);
      return BackgroundEventListenerService.refreshEcosystem();
    }

    case 'UNINSTALL_EXTENSION': {
      const { id } = message.payload;
      await ChromeManagementService.uninstallExtension(id);
      return BackgroundEventListenerService.refreshEcosystem();
    }

    case 'GET_SETTINGS': {
      return SettingsEngine.loadSettings();
    }

    case 'SAVE_SETTINGS': {
      return SettingsEngine.updateSettings(message.payload);
    }

    case 'GET_TIMELINE': {
      return TimelineEngine.getEvents();
    }

    case 'CLEAR_TIMELINE': {
      await TimelineEngine.clearHistory();
      return [];
    }

    default:
      throw new Error(`Unknown message action: ${message.action}`);
  }
}
