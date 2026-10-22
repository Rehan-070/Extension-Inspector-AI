import React from 'react';
import { LayoutDashboard, Puzzle, Dna, Cpu, Lock, Sparkles, Clock, Settings } from 'lucide-react';

export type TabId = 'overview' | 'extensions' | 'dna' | 'performance' | 'privacy' | 'recommendations' | 'timeline' | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  recommendationsCount: number;
  highRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  recommendationsCount,
  highRiskCount
}) => {
  const navItems: { id: TabId; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard style={{ width: '18px', height: '18px' }} /> },
    { id: 'extensions', label: 'Installed Extensions', icon: <Puzzle style={{ width: '18px', height: '18px' }} />, badge: highRiskCount > 0 ? highRiskCount : undefined, badgeColor: '#ef4444' },
    { id: 'dna', label: 'Extension DNA', icon: <Dna style={{ width: '18px', height: '18px' }} /> },
    { id: 'performance', label: 'Performance', icon: <Cpu style={{ width: '18px', height: '18px' }} /> },
    { id: 'privacy', label: 'Privacy & Permissions', icon: <Lock style={{ width: '18px', height: '18px' }} /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Sparkles style={{ width: '18px', height: '18px' }} />, badge: recommendationsCount > 0 ? recommendationsCount : undefined, badgeColor: '#6366f1' },
    { id: 'timeline', label: 'Security History', icon: <Clock style={{ width: '18px', height: '18px' }} /> },
    { id: 'settings', label: 'Settings', icon: <Settings style={{ width: '18px', height: '18px' }} /> }
  ];

  return (
    <aside className="glass-panel" style={{ width: '240px', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', shrink: 0 }}>
      <div style={{ padding: '4px 12px 12px 12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        Navigation
      </div>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
              fontWeight: isActive ? '600' : '500',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span style={{
                padding: '2px 7px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: '700',
                backgroundColor: item.badgeColor || 'var(--accent-primary)',
                color: '#ffffff'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
