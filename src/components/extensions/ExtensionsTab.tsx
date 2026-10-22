import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Cpu, Lock, Trash2, ExternalLink } from 'lucide-react';
import { InstalledExtension } from '../../types/extension';
import { UiEngine } from '../../engines/uiEngine';

interface ExtensionsTabProps {
  extensions: InstalledExtension[];
  searchTerm: string;
  onSelectExtension: (ext: InstalledExtension) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onUninstall: (id: string) => void;
}

export const ExtensionsTab: React.FC<ExtensionsTabProps> = ({
  extensions,
  searchTerm,
  onSelectExtension,
  onToggleEnabled,
  onUninstall
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SAFE' | 'REVIEW' | 'RISK' | 'DISABLED'>('ALL');

  const filtered = extensions.filter((ext) => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      ext.name.toLowerCase().includes(searchLower) ||
      ext.description.toLowerCase().includes(searchLower) ||
      ext.category.toLowerCase().includes(searchLower) ||
      ext.permissions.some((p) => p.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Filter status match
    if (filterStatus === 'SAFE') return ext.trustScore.score >= 80;
    if (filterStatus === 'REVIEW') return ext.trustScore.score >= 55 && ext.trustScore.score < 80;
    if (filterStatus === 'RISK') return ext.trustScore.score < 55;
    if (filterStatus === 'DISABLED') return !ext.enabled;

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Filter Status:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All (${extensions.length})` },
            { id: 'SAFE', label: 'Safe (≥80)' },
            { id: 'REVIEW', label: 'Needs Review (55-79)' },
            { id: 'RISK', label: 'High Risk (<55)' },
            { id: 'DISABLED', label: 'Disabled' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: filterStatus === f.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: filterStatus === f.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extension Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map((ext) => {
          const trustColors = UiEngine.getTrustColor(ext.trustScore.score);
          return (
            <div
              key={ext.id}
              className="glass-panel"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={ext.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
                      alt={ext.name}
                      style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: '1.2' }}>{ext.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v{ext.version} • {ext.category.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Trust Score Grade Badge */}
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: trustColors.bg,
                    color: trustColors.text,
                    border: `1px solid ${trustColors.border}`,
                    whiteSpace: 'nowrap'
                  }}>
                    {ext.trustScore.score} ({ext.trustScore.grade})
                  </span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4',
                  marginBottom: '14px'
                }}>
                  {ext.description}
                </p>

                {/* Key Metrics Row */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Cpu style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                    {ext.performance.estimatedMemoryMB} MB
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                    {ext.privacy.sensitiveAccessLevel}
                  </span>
                  <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                    {ext.manifestVersion === 3 ? 'MV3' : 'MV2'}
                  </span>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={ext.enabled}
                      onChange={(e) => onToggleEnabled(ext.id, e.target.checked)}
                      disabled={!ext.mayDisable}
                    />
                    <span className="slider"></span>
                  </label>
                  <span style={{ fontSize: '0.8rem', color: ext.enabled ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: '600' }}>
                    {ext.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {ext.mayDisable && (
                    <button
                      onClick={() => onUninstall(ext.id)}
                      title="Uninstall Extension"
                      style={{ padding: '6px', color: 'var(--text-muted)' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                  <button
                    onClick={() => onSelectExtension(ext)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Inspect
                    <ExternalLink style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
