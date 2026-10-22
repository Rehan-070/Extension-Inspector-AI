import { Cpu, Zap, Layers } from 'lucide-react';
import { EcosystemDNA } from '../../types/engines';
import { InstalledExtension } from '../../types/extension';
import { StatCard } from '../common/StatCard';
import { UiEngine } from '../../engines/uiEngine';

interface PerformanceTabProps {
  dna: EcosystemDNA;
  extensions: InstalledExtension[];
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  dna,
  extensions
}) => {
  const enabled = extensions.filter((e) => e.enabled);
  const sortedByRAM = [...enabled].sort((a, b) => b.performance.estimatedMemoryMB - a.performance.estimatedMemoryMB);
  const totalStartupMs = enabled.reduce((acc, curr) => acc + curr.performance.estimatedStartupDelayMs, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Est. Extension RAM"
          value={`${dna.totalEstimatedMemoryMB} MB`}
          subtitle="Combined RAM memory allocation"
          icon={<Cpu style={{ width: '22px', height: '22px' }} />}
          trendColor="#38bdf8"
        />
        <StatCard
          title="Est. Startup Speedup Impact"
          value={`+${totalStartupMs} ms`}
          subtitle="Additional browser launch latency"
          icon={<Zap style={{ width: '22px', height: '22px' }} />}
          trendColor="#fbbf24"
        />
        <StatCard
          title="Active Content Scripts"
          value={enabled.reduce((acc, curr) => acc + curr.performance.contentScriptCount, 0)}
          subtitle="DOM background observers"
          icon={<Layers style={{ width: '22px', height: '22px' }} />}
          trendColor="var(--accent-primary)"
        />
      </div>

      {/* RAM Footprint Breakdown List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
          Extension RAM Footprint Ranking
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedByRAM.map((ext) => {
            const pct = Math.min(100, Math.round((ext.performance.estimatedMemoryMB / 80) * 100));
            return (
              <div
                key={ext.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <img
                  src={ext.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
                  alt={ext.name}
                  style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{ext.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>
                      {ext.performance.estimatedMemoryMB} MB
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: '3px',
                      background: pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#38bdf8',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {ext.performance.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
