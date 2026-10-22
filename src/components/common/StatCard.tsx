import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendColor = 'var(--accent-primary)',
  badge
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {icon && <div style={{ color: trendColor }}>{icon}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
          {value}
        </span>
        {badge && (
          <span style={{
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: '700',
            backgroundColor: trendColor,
            color: '#fff'
          }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
      {trend && (
        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: trendColor, marginTop: '4px' }}>
          {trend}
        </div>
      )}
    </div>
  );
};
