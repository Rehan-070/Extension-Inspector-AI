import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { EcosystemDNA, RecommendationItem } from '../../types/engines';
import { InstalledExtension } from '../../types/extension';
import { StatCard } from '../common/StatCard';
import { UiEngine } from '../../engines/uiEngine';

interface OverviewProps {
  dna: EcosystemDNA;
  extensions: InstalledExtension[];
  recommendations: RecommendationItem[];
  onNavigateToTab: (tab: any) => void;
  onSelectExtension: (ext: InstalledExtension) => void;
}

export const OverviewTab: React.FC<OverviewProps> = ({
  dna,
  extensions,
  recommendations,
  onNavigateToTab,
  onSelectExtension
}) => {
  const healthColors = UiEngine.getTrustColor(dna.ecosystemHealthScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Ecosystem Health Hero Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid var(--border-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '540px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-medium" style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--accent-primary)' }}>
              Ecosystem Intelligence Engine
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyzed {dna.totalExtensions} installed extensions</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Browser Health Score: <span style={{ color: healthColors.text }}>{dna.ecosystemHealthScore}/100</span>
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {dna.summaryExplanation}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '18px' }}>
            <button
              onClick={() => onNavigateToTab('dna')}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--accent-glow)'
              }}
            >
              <Activity style={{ width: '16px', height: '16px' }} />
              Inspect Extension DNA
            </button>

            <button
              onClick={() => onNavigateToTab('recommendations')}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px', color: 'var(--accent-primary)' }} />
              View {recommendations.length} Action Items
            </button>
          </div>
        </div>

        {/* Grade Circle Badge */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `4px solid ${healthColors.border}`,
          backgroundColor: healthColors.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 30px ${healthColors.bg}`
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: healthColors.text, lineHeight: '1' }}>
            {dna.ecosystemGrade}
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>
            Grade
          </span>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Installed Extensions"
          value={dna.totalExtensions}
          subtitle={`${dna.enabledExtensions} Active • ${dna.totalExtensions - dna.enabledExtensions} Disabled`}
          icon={<Layers style={{ width: '22px', height: '22px' }} />}
        />
        <StatCard
          title="Safe Extensions"
          value={dna.safeCount}
          subtitle="Score >= 80 (Verified & Restricted)"
          icon={<ShieldCheck style={{ width: '22px', height: '22px' }} />}
          trendColor="var(--success-color)"
        />
        <StatCard
          title="Needs Review"
          value={dna.needsReviewCount}
          subtitle="Score 55 - 79 (Broad permissions)"
          icon={<AlertTriangle style={{ width: '22px', height: '22px' }} />}
          trendColor="var(--warning-color)"
        />
        <StatCard
          title="High Risk Flags"
          value={dna.highRiskCount}
          subtitle="Score < 55 (Dangerous capabilities)"
          icon={<ShieldAlert style={{ width: '22px', height: '22px' }} />}
          trendColor="#ef4444"
          badge={dna.highRiskCount > 0 ? 'ATTENTION' : undefined}
        />
      </div>

      {/* High Risk Warning Callout if present */}
      {dna.highRiskCount > 0 && (
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert style={{ width: '24px', height: '24px', color: '#ef4444', shrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f87171' }}>
                {dna.highRiskCount} High Risk Extensions Require Your Attention
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                These extensions request excessive host access or browser debugger permissions.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('extensions')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            Filter High Risk
          </button>
        </div>
      )}

      {/* Key Action Recommendations */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: 'var(--accent-primary)' }} />
            Top AI Recommendations
          </h3>
          <button
            onClick={() => onNavigateToTab('recommendations')}
            style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All ({recommendations.length})
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge badge-${item.severity.toLowerCase()}`}>{item.severity}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item.title}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.reason}</p>
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--success-color)', whiteSpace: 'nowrap' }}>
                {item.expectedImprovement}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Extension Ecosystem Overview Grid */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
          Recently Active Extensions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {extensions.slice(0, 6).map((ext) => {
            const trustColors = UiEngine.getTrustColor(ext.trustScore.score);
            return (
              <div
                key={ext.id}
                onClick={() => onSelectExtension(ext)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <img
                  src={ext.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
                  alt={ext.name}
                  style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ext.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Est. RAM: {ext.performance.estimatedMemoryMB} MB
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: trustColors.bg,
                  color: trustColors.text
                }}>
                  {ext.trustScore.score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
