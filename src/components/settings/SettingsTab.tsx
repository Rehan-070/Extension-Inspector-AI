import React from 'react';
import { Settings, Shield, Bell, Moon, Sliders } from 'lucide-react';
import { UserSettings } from '../../types/engines';
import { InstalledExtension } from '../../types/extension';

interface SettingsTabProps {
  settings: UserSettings;
  extensions: InstalledExtension[];
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onToggleTrusted: (id: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  extensions,
  onUpdateSettings,
  onToggleTrusted
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings style={{ width: '22px', height: '22px', color: 'var(--accent-primary)' }} />
          Platform Settings & Custom Thresholds
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Configure danger thresholds, notification alerts, white-listed trusted extensions, and theme preferences.
        </p>
      </div>

      {/* General Settings Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          General & Appearance
        </h3>

        {/* Theme Picker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Moon style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Theme Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose between Dark or Light theme.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['dark', 'light'].map((t) => (
              <button
                key={t}
                onClick={() => onUpdateSettings({ theme: t as any })}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: settings.theme === t ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: settings.theme === t ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Desktop Alert Notifications</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notify when high risk extensions are installed.</div>
            </div>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={settings.showNotifications}
              onChange={(e) => onUpdateSettings({ showNotifications: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Security & Performance Thresholds */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Risk & Resource Thresholds
        </h3>

        {/* Danger Score Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>High Risk Danger Threshold (Trust Score)</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444' }}>Score &lt; {settings.dangerThreshold}</span>
          </div>
          <input
            type="range"
            min="30"
            max="75"
            value={settings.dangerThreshold}
            onChange={(e) => onUpdateSettings({ dangerThreshold: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* RAM Warning Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>RAM Footprint Alert Threshold</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8' }}>&gt; {settings.performanceThresholdMB} MB</span>
          </div>
          <input
            type="range"
            min="30"
            max="120"
            step="5"
            value={settings.performanceThresholdMB}
            onChange={(e) => onUpdateSettings({ performanceThresholdMB: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Trusted Whitelist Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
          Whitelisted Trusted Extensions ({settings.trustedExtensionIds.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Extensions marked as trusted will bypass ecosystem high-risk warnings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {extensions.map((ext) => {
            const isTrusted = settings.trustedExtensionIds.includes(ext.id);
            return (
              <div
                key={ext.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ext.name}</div>
                <button
                  onClick={() => onToggleTrusted(ext.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: isTrusted ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-secondary)',
                    color: isTrusted ? 'var(--success-color)' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {isTrusted ? 'Trusted' : 'Mark Trusted'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
