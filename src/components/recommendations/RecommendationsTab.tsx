import { Sparkles, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { RecommendationItem } from '../../types/engines';

interface RecommendationsTabProps {
  recommendations: RecommendationItem[];
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onUninstall: (id: string) => void;
}

export const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  recommendations,
  onToggleEnabled,
  onUninstall
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles style={{ width: '24px', height: '24px', color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>AI Recommendation Engine</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Every issue detected includes a clear plain-English reason, technical impact, recommended resolution, and estimated performance/privacy gain.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--success-color)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>Your Ecosystem is Fully Optimized!</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No security or performance recommendations found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${item.severity.toLowerCase()}`}>{item.severity}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{item.title}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--success-color)' }}>
                  <Cpu style={{ width: '14px', height: '14px' }} />
                  {item.expectedImprovement}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Reason:</strong> {item.reason}</div>
                <div><strong>Impact:</strong> {item.impact}</div>
                <div><strong>Recommendation:</strong> {item.recommendation}</div>
              </div>

              {item.extensionId && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={() => onToggleEnabled(item.extensionId!, false)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Disable Extension
                  </button>

                  <button
                    onClick={() => onUninstall(item.extensionId!)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Uninstall
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
