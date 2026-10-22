import React from 'react';
import { X, ShieldAlert, Cpu, Lock, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { InstalledExtension } from '../../types/extension';
import { UiEngine } from '../../engines/uiEngine';

interface ModalProps {
  extension: InstalledExtension | null;
  onClose: () => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onUninstall: (id: string) => void;
}

export const ExtensionDetailModal: React.FC<ModalProps> = ({
  extension,
  onClose,
  onToggleEnabled,
  onUninstall
}) => {
  if (!extension) return null;

  const trustColors = UiEngine.getTrustColor(extension.trustScore.score);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-highlight)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '6px',
            borderRadius: '50%',
            color: 'var(--text-muted)'
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <img
            src={extension.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
            alt={extension.name}
            style={{ width: '48px', height: '48px', borderRadius: '10px' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>{extension.name}</h2>
              <span style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                backgroundColor: trustColors.bg,
                color: trustColors.text,
                border: `1px solid ${trustColors.border}`
              }}>
                Grade {extension.trustScore.grade} • Score {extension.trustScore.score}/100
              </span>
              <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                {extension.manifestVersion === 3 ? 'Manifest V3' : 'Manifest V2'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              v{extension.version} • Category: {extension.category.replace('_', ' ')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              {extension.description}
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-primary)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Extension Status:</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={extension.enabled}
                onChange={(e) => onToggleEnabled(extension.id, e.target.checked)}
                disabled={!extension.mayDisable}
              />
              <span className="slider"></span>
            </label>
            <span style={{ fontSize: '0.85rem', color: extension.enabled ? 'var(--success-color)' : 'var(--text-muted)', fontWeight: '600' }}>
              {extension.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>

          {extension.mayDisable && (
            <button
              onClick={() => {
                onUninstall(extension.id);
                onClose();
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Uninstall
            </button>
          )}
        </div>

        {/* Grid Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Trust Score Factors */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert style={{ width: '18px', height: '18px', color: trustColors.text }} />
              Trust Breakdown & Factors
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--success-color)', marginBottom: '6px' }}>Positive Factors</div>
                {extension.trustScore.positiveFactors.map((fact, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--success-color)', shrink: 0, marginTop: '2px' }} />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ef4444', marginBottom: '6px' }}>Risk / Deductions</div>
                {extension.trustScore.negativeFactors.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No negative risk factors identified.</div>
                ) : (
                  extension.trustScore.negativeFactors.map((fact, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                      <AlertTriangle style={{ width: '14px', height: '14px', color: '#ef4444', shrink: 0, marginTop: '2px' }} />
                      <span>{fact}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Performance & Privacy Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                Performance Overhead
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Est. RAM: <strong style={{ color: 'var(--text-primary)' }}>{extension.performance.estimatedMemoryMB} MB</strong></div>
                <div>Startup Delay: <strong style={{ color: 'var(--text-primary)' }}>+{extension.performance.estimatedStartupDelayMs} ms</strong></div>
                <div>Weight Rating: <strong style={{ color: 'var(--text-primary)' }}>{extension.performance.scriptSizeImpact}</strong></div>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                Privacy Impact
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Site Reach: <strong style={{ color: 'var(--text-primary)' }}>{extension.privacy.sensitiveAccessLevel}</strong></div>
                <div>Cookie Access: <strong style={{ color: extension.privacy.readsCookies ? '#ef4444' : 'var(--success-color)' }}>{extension.privacy.readsCookies ? 'Yes' : 'No'}</strong></div>
                <div>Network Interception: <strong style={{ color: extension.privacy.monitorsNetwork ? '#f59e0b' : 'var(--text-primary)' }}>{extension.privacy.monitorsNetwork ? 'Active' : 'None'}</strong></div>
              </div>
            </div>
          </div>

          {/* Permissions Plain English */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px' }}>
              Permissions Explained in Plain English ({extension.permissionExplanations.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {extension.permissionExplanations.map((exp, idx) => (
                <div key={idx} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{exp.name}</span>
                    <span className={`badge badge-${exp.riskLevel.toLowerCase()}`}>{exp.riskLevel}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
