import { ExtensionConflict } from '../types/engines';
import { InstalledExtension, CategoryType } from '../types/extension';

export class ConflictEngine {
  static detectConflicts(extensions: InstalledExtension[]): ExtensionConflict[] {
    const enabledExts = extensions.filter((ext) => ext.enabled && ext.id !== 'inspector-self');
    const categoryGroups: Map<CategoryType, InstalledExtension[]> = new Map();

    enabledExts.forEach((ext) => {
      const cat = ext.category;
      if (cat !== 'OTHER' && cat !== 'PRODUCTIVITY' && cat !== 'ACCESSIBILITY') {
        const list = categoryGroups.get(cat) || [];
        list.push(ext);
        categoryGroups.set(cat, list);
      }
    });

    const conflicts: ExtensionConflict[] = [];

    categoryGroups.forEach((exts, cat) => {
      if (exts.length >= 2) {
        conflicts.push(this.buildConflictObject(cat, exts));
      }
    });

    return conflicts;
  }

  private static buildConflictObject(category: CategoryType, exts: InstalledExtension[]): ExtensionConflict {
    const names = exts.map((e) => e.name);
    const ids = exts.map((e) => e.id);

    switch (category) {
      case 'AD_BLOCKER':
        return {
          id: `conflict-adblocker`,
          category,
          categoryName: 'Ad Blockers',
          extensionIds: ids,
          extensionNames: names,
          severity: 'HIGH',
          whyConflictOccurs: 'Running multiple ad blockers causes overlapping network request interception, redundant rule matching, and broken page layouts.',
          performanceImpact: 'Doubles network request processing latency and increases RAM usage by ~50-80 MB.',
          howToFix: `Disable one ad blocker (e.g. keep ${names[0]} and disable ${names.slice(1).join(', ')}) to prevent page crashes.`
        };

      case 'PASSWORD_MANAGER':
        return {
          id: `conflict-password`,
          category,
          categoryName: 'Password Managers',
          extensionIds: ids,
          extensionNames: names,
          severity: 'HIGH',
          whyConflictOccurs: 'Multiple password managers attempt to autofill the same login inputs simultaneously, causing form glitching and password capture collisions.',
          performanceImpact: 'Repeated DOM MutationObserver execution on form inputs.',
          howToFix: `Select a primary password manager (${names[0]}) and disable alternative password extensions.`
        };

      case 'DARK_MODE':
        return {
          id: `conflict-darkmode`,
          category,
          categoryName: 'Dark Mode Extensions',
          extensionIds: ids,
          extensionNames: names,
          severity: 'MEDIUM',
          whyConflictOccurs: 'Multiple dark mode extensions apply competing CSS style injections and brightness inversions, causing flickering and white flashes.',
          performanceImpact: 'Duplicate CSS re-calc and layout repaint spikes on page load.',
          howToFix: `Keep only one dark mode manager (${names[0]}) enabled.`
        };

      case 'GRAMMAR_CHECK':
        return {
          id: `conflict-grammar`,
          category,
          categoryName: 'Grammar & Writing Inspectors',
          extensionIds: ids,
          extensionNames: names,
          severity: 'MEDIUM',
          whyConflictOccurs: 'Overlapping text edit listeners scan content editable text fields simultaneously, causing text duplication or typing lag.',
          performanceImpact: 'High CPU spikes during fast typing due to duplicate real-time text parsing.',
          howToFix: `Keep one writing inspector enabled (${names[0]}).`
        };

      case 'VPN':
        return {
          id: `conflict-vpn`,
          category,
          categoryName: 'VPN & Proxy Extensions',
          extensionIds: ids,
          extensionNames: names,
          severity: 'HIGH',
          whyConflictOccurs: 'Multiple proxy controllers battle to configure Chrome chrome.proxy API rules, leading to dropped connections or DNS leaks.',
          performanceImpact: 'Network connection drops and proxy configuration locks.',
          howToFix: `Disable secondary VPN extensions.`
        };

      default:
        return {
          id: `conflict-${category.toLowerCase()}`,
          category,
          categoryName: category.replace('_', ' '),
          extensionIds: ids,
          extensionNames: names,
          severity: 'LOW',
          whyConflictOccurs: `Multiple extensions installed providing similar ${category.replace('_', ' ')} functionality.`,
          performanceImpact: 'Minor redundant RAM consumption.',
          howToFix: `Consolidate to a single extension.`
        };
    }
  }
}
