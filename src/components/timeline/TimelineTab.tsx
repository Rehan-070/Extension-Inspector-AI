import React, { useState } from 'react';
import { Clock, ShieldAlert, Trash2, Filter } from 'lucide-react';
import { TimelineEvent } from '../../types/timeline';

interface TimelineTabProps {
  timeline: TimelineEvent[];
  onClearTimeline: () => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  timeline,
  onClearTimeline
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = timeline.filter((evt) => {
    if (filterType === 'ALL') return true;
    return evt.eventType === filterType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock style={{ width: '22px', height: '22px', color: 'var(--accent-primary)' }} />
            Local Security History Timeline
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            All event logs stay strictly offline on your device in chrome.storage.local.
          </p>
        </div>

        <button
          onClick={onClearTimeline}
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
          Clear Log History
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['ALL', 'INSTALLED', 'UNINSTALLED', 'ENABLED', 'DISABLED', 'RISK_DETECTED'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: filterType === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: filterType === t ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)'
            }}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Events List */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No event logs match the selected filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((evt) => {
            const dateStr = new Date(evt.timestamp).toLocaleString();
            return (
              <div
                key={evt.id}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    {evt.iconUrl ? (
                      <img src={evt.iconUrl} alt="" style={{ width: '24px', height: '24px' }} />
                    ) : (
                      <Clock style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className={`badge badge-${evt.severity.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                        {evt.eventType.replace('_', ' ')}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{evt.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{evt.description}</p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', shrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateStr}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-primary)', marginTop: '2px' }}>
                    {evt.impactSummary}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
