import { PermissionExplanation, RiskLevel } from '../types/extension';

const PERMISSION_MAP: Record<string, { name: string; riskLevel: RiskLevel; category: 'PRIVACY' | 'SECURITY' | 'PERFORMANCE' | 'SYSTEM'; description: string; technicalImpact: string }> = {
  // Critical & High Risk Permissions
  '<all_urls>': {
    name: 'Full Web Access',
    riskLevel: 'CRITICAL',
    category: 'PRIVACY',
    description: 'This extension can read, modify, and intercept data on every website you visit.',
    technicalImpact: 'Grants access to document DOM, session tokens, passwords, and form entries across all domains.'
  },
  '*://*/*': {
    name: 'Universal HTTP/HTTPS Access',
    riskLevel: 'CRITICAL',
    category: 'PRIVACY',
    description: 'This extension can access data on any standard website.',
    technicalImpact: 'Allows content script injection and fetch requests on all non-chrome web pages.'
  },
  'http://*/*': {
    name: 'Insecure Web Access',
    riskLevel: 'HIGH',
    category: 'PRIVACY',
    description: 'Accesses data on all unencrypted HTTP websites.',
    technicalImpact: 'Can view unencrypted network traffic and modify page DOM.'
  },
  'https://*/*': {
    name: 'Secure Web Access',
    riskLevel: 'HIGH',
    category: 'PRIVACY',
    description: 'Accesses data on all encrypted HTTPS websites.',
    technicalImpact: 'Can read page contents on secure sites including webmail and social media.'
  },
  'debugger': {
    name: 'Browser Debugger Controls',
    riskLevel: 'CRITICAL',
    category: 'SECURITY',
    description: 'Can attach to browser devtools, inspect JS execution, and bypass security constraints.',
    technicalImpact: 'Full access to V8 JavaScript engine, memory heap, and network packet capture.'
  },
  'proxy': {
    name: 'Network Proxy Configuration',
    riskLevel: 'CRITICAL',
    category: 'SECURITY',
    description: 'Reroutes your internet traffic through external custom proxy servers.',
    technicalImpact: 'Can intercept, observe, or manipulate all outgoing browser network requests.'
  },
  'webRequest': {
    name: 'Network Request Inspection',
    riskLevel: 'HIGH',
    category: 'PRIVACY',
    description: 'Monitors network requests made by web pages in real-time.',
    technicalImpact: 'Exposes request URLs, request headers, and timing metadata.'
  },
  'webRequestBlocking': {
    name: 'Network Request Interception & Modification',
    riskLevel: 'CRITICAL',
    category: 'SECURITY',
    description: 'Can block, delay, or rewrite web requests and headers dynamically.',
    technicalImpact: 'Allows injecting headers, stripping CSP security rules, or redirecting connections.'
  },
  'cookies': {
    name: 'Cookie Access & Modification',
    riskLevel: 'HIGH',
    category: 'PRIVACY',
    description: 'Can read and write session cookies across visited websites.',
    technicalImpact: 'Exposes session identifiers, authentication tokens, and tracking preferences.'
  },
  'declarativeNetRequest': {
    name: 'Declarative Rule-Based Request Filtering',
    riskLevel: 'MEDIUM',
    category: 'PRIVACY',
    description: 'Applies preset rules to block or modify network requests safely (MV3 standard).',
    technicalImpact: 'Lightweight rule matching performed by Chrome without running JS per request.'
  },
  'tabs': {
    name: 'Tab Activity & Navigation Inspection',
    riskLevel: 'MEDIUM',
    category: 'PRIVACY',
    description: 'Reads open tab titles, URLs, and favicon icons.',
    technicalImpact: 'Allows tracking browsing history and current open page URLs.'
  },
  'activeTab': {
    name: 'On-Demand Current Tab Access',
    riskLevel: 'LOW',
    category: 'PRIVACY',
    description: 'Accesses the current page ONLY when you explicitly click the extension icon.',
    technicalImpact: 'Privacy-preserving temporary permission granted strictly during user action.'
  },
  'storage': {
    name: 'Local Offline Storage',
    riskLevel: 'LOW',
    category: 'PERFORMANCE',
    description: 'Saves extension settings and cache locally in your browser.',
    technicalImpact: 'Safe local Chrome storage access; does not grant web data access.'
  },
  'management': {
    name: 'Extension Management',
    riskLevel: 'HIGH',
    category: 'SYSTEM',
    description: 'Can view, enable, or disable other installed browser extensions.',
    technicalImpact: 'Grants control over browser extension state and capabilities.'
  },
  'contextMenus': {
    name: 'Right-Click Context Menu Options',
    riskLevel: 'LOW',
    category: 'SYSTEM',
    description: 'Adds custom action items when you right-click on web pages.',
    technicalImpact: 'Adds user-facing menu options; safe operational scope.'
  },
  'downloads': {
    name: 'Download Manager Controls',
    riskLevel: 'MEDIUM',
    category: 'SYSTEM',
    description: 'Initiates, monitors, and manages file downloads.',
    technicalImpact: 'Can trigger file downloads or rename downloaded files.'
  },
  'alarms': {
    name: 'Background Scheduling Alarms',
    riskLevel: 'LOW',
    category: 'PERFORMANCE',
    description: 'Schedules periodic background timer events efficiently.',
    technicalImpact: 'Event-driven background wakeup triggers using Chrome alarm API.'
  },
  'notifications': {
    name: 'Desktop Notifications',
    riskLevel: 'LOW',
    category: 'SYSTEM',
    description: 'Displays system popup alert notifications.',
    technicalImpact: 'Displays system tray notifications to the user.'
  },
  'clipboardRead': {
    name: 'Read Clipboard Data',
    riskLevel: 'HIGH',
    category: 'PRIVACY',
    description: 'Can read text and images copied to your clipboard.',
    technicalImpact: 'Exposes sensitive copied text, passwords, or personal credentials.'
  },
  'clipboardWrite': {
    name: 'Write Clipboard Data',
    riskLevel: 'LOW',
    category: 'SYSTEM',
    description: 'Can copy text or links to your clipboard.',
    technicalImpact: 'Allows programmatic copying of content to system clipboard.'
  }
};

export class PermissionTranslatorEngine {
  static translatePermission(perm: string): PermissionExplanation {
    const known = PERMISSION_MAP[perm];
    if (known) {
      return {
        permission: perm,
        ...known
      };
    }

    // Dynamic fallback for custom host permissions or rare permissions
    if (perm.startsWith('http://') || perm.startsWith('https://') || perm.includes('://')) {
      return {
        permission: perm,
        name: `Specific Web Domain Access (${perm})`,
        riskLevel: 'MEDIUM',
        category: 'PRIVACY',
        description: `This extension can access and read data on ${perm}.`,
        technicalImpact: 'Scoped host access permission limited to matching URL patterns.'
      };
    }

    return {
      permission: perm,
      name: perm.charAt(0).toUpperCase() + perm.slice(1) + ' Access',
      riskLevel: 'LOW',
      category: 'SYSTEM',
      description: `Standard browser capability request for '${perm}'.`,
      technicalImpact: 'Standard browser API scope.'
    };
  }

  static translateAll(permissions: string[] = [], hostPermissions: string[] = []): PermissionExplanation[] {
    const combined = Array.from(new Set([...permissions, ...hostPermissions]));
    return combined.map((p) => this.translatePermission(p));
  }
}
