import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar, TabId } from '../components/layout/Sidebar';
import { OverviewTab } from '../components/overview/OverviewTab';
import { ExtensionsTab } from '../components/extensions/ExtensionsTab';
import { DnaTab } from '../components/dna/DnaTab';
import { PerformanceTab } from '../components/performance/PerformanceTab';
import { PrivacyTab } from '../components/privacy/PrivacyTab';
import { RecommendationsTab } from '../components/recommendations/RecommendationsTab';
import { TimelineTab } from '../components/timeline/TimelineTab';
import { SettingsTab } from '../components/settings/SettingsTab';
import { ExtensionDetailModal } from '../components/common/ExtensionDetailModal';

import { InstalledExtension } from '../types/extension';
import { EcosystemDNA, RecommendationItem, UserSettings } from '../types/engines';
import { TimelineEvent } from '../types/timeline';

import { MessagingService } from '../services/messaging';
import { ChromeManagementService } from '../services/chromeManagement';
import { DiscoveryEngine } from '../engines/discoveryEngine';
import { ExtensionDnaEngine } from '../engines/extensionDnaEngine';
import { RecommendationEngine } from '../engines/recommendationEngine';
import { SettingsEngine } from '../engines/settingsEngine';
import { TimelineEngine } from '../engines/timelineEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedExtension, setSelectedExtension] = useState<InstalledExtension | null>(null);

  const [extensions, setExtensions] = useState<InstalledExtension[]>([]);
  const [dna, setDna] = useState<EcosystemDNA | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    showNotifications: true,
    dangerThreshold: 55,
    performanceThresholdMB: 60,
    autoScanOnInstall: true,
    ignoredExtensionIds: [],
    trustedExtensionIds: [],
    lastScanTimestamp: Date.now()
  });

  const loadData = async () => {
    setIsScanning(true);
    try {
      if (ChromeManagementService.isExtensionEnv()) {
        const res = await MessagingService.sendMessage({ action: 'GET_ECOSYSTEM_DATA' });
        if (res.success && res.data) {
          setExtensions(res.data.extensions || []);
          setDna(res.data.dna);
          setRecommendations(res.data.recommendations || []);
          if (res.data.settings) setSettings(res.data.settings);
        }
        const timelineData = await MessagingService.sendMessage({ action: 'GET_TIMELINE' });
        if (timelineData.success && timelineData.data) {
          setTimeline(timelineData.data);
        }
      } else {
        // Fallback for standalone dev environment
        const raw = await ChromeManagementService.getAllExtensions();
        const parsed = DiscoveryEngine.processAll(raw);
        const ecosystemDna = ExtensionDnaEngine.analyzeEcosystem(parsed);
        const recs = RecommendationEngine.generateRecommendations(parsed, ecosystemDna);
        const loadedSettings = await SettingsEngine.loadSettings();
        const timelineEvents = await TimelineEngine.getEvents();

        setExtensions(parsed);
        setDna(ecosystemDna);
        setRecommendations(recs);
        setSettings(loadedSettings);
        setTimeline(timelineEvents);
      }
    } catch (err) {
      console.error('Failed to load extension ecosystem data:', err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    if (ChromeManagementService.isExtensionEnv()) {
      await MessagingService.sendMessage({ action: 'TOGGLE_EXTENSION', payload: { id, enabled } });
    } else {
      await ChromeManagementService.setExtensionEnabled(id, enabled);
    }
    await loadData();
    if (selectedExtension && selectedExtension.id === id) {
      setSelectedExtension({ ...selectedExtension, enabled });
    }
  };

  const handleUninstall = async (id: string) => {
    if (ChromeManagementService.isExtensionEnv()) {
      await MessagingService.sendMessage({ action: 'UNINSTALL_EXTENSION', payload: { id } });
    } else {
      await ChromeManagementService.uninstallExtension(id);
    }
    await loadData();
  };

  const handleUpdateSettings = async (partial: Partial<UserSettings>) => {
    const updated = await SettingsEngine.updateSettings(partial);
    setSettings(updated);
  };

  const handleToggleTrusted = async (id: string) => {
    const updated = await SettingsEngine.toggleTrustedExtension(id);
    setSettings(updated);
  };

  const handleClearTimeline = async () => {
    await TimelineEngine.clearHistory();
    setTimeline([]);
  };

  if (!dna) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Initializing Extension Inspector AI...
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Parsing extension manifests, calculating trust scores & DNA health matrix.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      <Header
        settings={settings}
        onThemeToggle={() => handleUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
        onRefresh={loadData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isScanning={isScanning}
      />

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          recommendationsCount={recommendations.length}
          highRiskCount={dna.highRiskCount}
        />

        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'overview' && (
            <OverviewTab
              dna={dna}
              extensions={extensions}
              recommendations={recommendations}
              onNavigateToTab={setActiveTab}
              onSelectExtension={setSelectedExtension}
            />
          )}

          {activeTab === 'extensions' && (
            <ExtensionsTab
              extensions={extensions}
              searchTerm={searchTerm}
              onSelectExtension={setSelectedExtension}
              onToggleEnabled={handleToggleEnabled}
              onUninstall={handleUninstall}
            />
          )}

          {activeTab === 'dna' && (
            <DnaTab
              dna={dna}
              extensions={extensions}
              onToggleEnabled={handleToggleEnabled}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceTab
              dna={dna}
              extensions={extensions}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyTab
              dna={dna}
              extensions={extensions}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsTab
              recommendations={recommendations}
              onToggleEnabled={handleToggleEnabled}
              onUninstall={handleUninstall}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              timeline={timeline}
              onClearTimeline={handleClearTimeline}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              extensions={extensions}
              onUpdateSettings={handleUpdateSettings}
              onToggleTrusted={handleToggleTrusted}
            />
          )}
        </main>
      </div>

      <ExtensionDetailModal
        extension={selectedExtension}
        onClose={() => setSelectedExtension(null)}
        onToggleEnabled={handleToggleEnabled}
        onUninstall={handleUninstall}
      />
    </div>
  );
};

export default App;
