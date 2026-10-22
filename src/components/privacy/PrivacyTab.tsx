import { Lock, Eye, AlertOctagon, ShieldCheck } from 'lucide-react';
import { EcosystemDNA } from '../../types/engines';
import { InstalledExtension } from '../../types/extension';
import { StatCard } from '../common/StatCard';

interface PrivacyTabProps {
  dna: EcosystemDNA;
  extensions: InstalledExtension[];
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  dna,
  extensions
}) => {
  const enabled = extensions.filter((e) => e.enabled);
  const broadSiteAccessCount = enabled.filter((e) => e.privacy.sensitiveAccessLevel === 'ALL_SITES').length;
  const cookieAccessCount = enabled.filter((e) => e.privacy.readsCookies).length;
  const networkMonitorsCount = enabled.filter((e) => e.privacy.monitorsNetwork).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Broad Host Access (<all_urls>)"
          value={broadSiteAccessCount}
          subtitle="Extensions reading data across ALL websites"
          icon={<Eye style={{ width: '22px', height: '22px' }} />}
          trendColor={broadSiteAccessCount > 2 ? '#ef4444' : 'var(--accent-primary)'}
          badge={broadSiteAccessCount > 2 ? 'HIGH EXPOSURE' : undefined}
        />
        <StatCard
          title="Cookie Readers"
          value={cookieAccessCount}
          subtitle="Access to browser session cookies"
          icon={<Lock style={{ width: '22px', height: '22px' }} />}
          trendColor="#f59e0b"
        />
        <StatCard
          title="Network Traffic Monitors"
          value={networkMonitorsCount}
          subtitle="Inspects web requests in real-time"
          icon={<AlertOctagon style={{ width: '22px', height: '22px' }} />}
          trendColor="#818cf8"
        />
      </div>

      {/* Broad Site Access List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye style={{ width: '20px', height: '20px', color: '#ef4444' }} />
          Extensions with Universal Site Access (&lt;all_urls&gt;)
        </h3>

        {broadSiteAccessCount === 0 ? (
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--success-color)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>None! No active extension has unrestricted access to all your visited web pages.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {enabled.filter((e) => e.privacy.sensitiveAccessLevel === 'ALL_SITES').map((ext) => (
              <div
                key={ext.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={ext.icons?.[0]?.url || 'https://api.iconify.design/lucide:puzzle.svg'}
                    alt={ext.name}
                    style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{ext.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ext.privacy.plainEnglishSummary}</div>
                  </div>
                </div>

                <span className="badge badge-critical">
                  Privacy Exposure: {ext.privacy.exposureScore}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
