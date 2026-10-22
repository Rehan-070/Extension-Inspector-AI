import React from 'react';
import { Dna, Zap, AlertTriangle, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { EcosystemDNA } from '../../types/engines';
import { InstalledExtension } from '../../types/extension';

interface DnaTabProps {
  dna: EcosystemDNA;
  extensions: InstalledExtension[];
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

export const DnaTab: React.FC<DnaTabProps> = ({
  dna,
  extensions,
  onToggleEnabled
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Dna style={{ width: '28px', height: '28px', color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            Extension DNA & Ecosystem Intelligence
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Extension DNA analyzes the entire ecosystem as a cohesive system rather than individual isolated extensions. It detects functional redundancy, overlapping network hooks, and performance conflicts across your browser.
        </p>
      </div>

      {/* Flagship Feature 1: Duplicate Feature Detector */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
            Duplicate Feature Detector ({dna.duplicates.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Functionality Comparator</span>
        </div>

        {dna.duplicates.length === 0 ? (
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--success-color)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No duplicate extension features detected in your browser!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dna.duplicates.map((dup) => {
              const keepExt = extensions.find((e) => e.id === dup.recommendedKeepId);
              return (
                <div
                  key={dup.id}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-medium">{dup.featureName}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                        {dup.extensionNames.join(' + ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                      <span style={{ color: 'var(--success-color)' }}>Est. Saved: ~{dup.estimatedMemorySavedMB} MB RAM</span>
                      <span style={{ color: '#38bdf8' }}>Startup: +{dup.estimatedStartupSpeedupMs} ms faster</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {dup.reasoning}
                  </p>

                  <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Recommended action:</span>
                      <strong style={{ color: 'var(--success-color)' }}>Keep '{keepExt?.name}'</strong>
                    </div>

                    <button
                      onClick={() => {
                        dup.extensionIds.forEach((id) => {
                          if (id !== dup.recommendedKeepId) {
                            onToggleEnabled(id, false);
                          }
                        });
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-gradient)',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Disable Duplicates (Save ~{dup.estimatedMemorySavedMB} MB)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Flagship Feature 2: Category Conflict Matrix */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
          Active Category Conflicts ({dna.conflicts.length})
        </h3>

        {dna.conflicts.length === 0 ? (
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--success-color)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No conflicting extensions active! Your extensions operate smoothly without category collisions.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {dna.conflicts.map((conf) => (
              <div
                key={conf.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge badge-${conf.severity.toLowerCase()}`}>
                    {conf.categoryName} Conflict
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Involves {conf.extensionNames.length} extensions
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                  Why Conflict Occurs:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {conf.whyConflictOccurs}
                </p>

                <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: '600' }}>
                  Impact: {conf.performanceImpact}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: '600' }}>
                  Fix: {conf.howToFix}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unused Extensions Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
          Disabled / Inactive Extensions ({dna.unusedExtensions.length})
        </h3>

        {dna.unusedExtensions.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            All installed extensions are currently enabled.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {dna.unusedExtensions.map((ext) => (
              <div
                key={ext.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={ext.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
                    alt={ext.name}
                    style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ext.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disabled</div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleEnabled(ext.id, true)}
                  style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}
                >
                  Enable
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
