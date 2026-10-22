import React from 'react';
import { Shield, RefreshCw, Sun, Moon, Search } from 'lucide-react';
import { UserSettings } from '../../types/engines';

interface HeaderProps {
  settings: UserSettings;
  onThemeToggle: () => void;
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onThemeToggle,
  onRefresh,
  searchTerm,
  onSearchChange,
  isScanning
}) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-glow)'
        }}>
          <Shield style={{ color: '#fff', width: '24px', height: '24px' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Extension Inspector <span className="gradient-text">AI</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Browser Intelligence Platform • Privacy & Performance Engine
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '480px', justifyContent: 'flex-end' }}>
        {/* Global Search Bar */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search extensions, permissions, categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Refresh Ecosystem Button */}
        <button
          onClick={onRefresh}
          disabled={isScanning}
          title="Rescan Browser Ecosystem"
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}
        >
          <RefreshCw style={{ width: '16px', height: '16px', animation: isScanning ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isScanning ? 'Scanning...' : 'Rescan'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          title="Toggle Light/Dark Theme"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {settings.theme === 'dark' ? (
            <Sun style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
          ) : (
            <Moon style={{ width: '18px', height: '18px', color: '#6366f1' }} />
          )}
        </button>
      </div>
    </header>
  );
};
