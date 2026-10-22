import { BehaviorAnalysis, CategoryType } from '../types/extension';

export class BehaviorEngine {
  static analyzeBehavior(
    rawPermissions: string[] = [],
    hostPermissions: string[] = [],
    manifestVersion: 2 | 3 = 3,
    description: string = '',
    name: string = ''
  ): BehaviorAnalysis {
    const allPerms = [...rawPermissions, ...hostPermissions];
    
    const hasHostPermissions = hostPermissions.length > 0 || allPerms.some(p => p.includes('://') || p === '<all_urls>');
    const accessesAllSites = allPerms.includes('<all_urls>') || allPerms.includes('*://*/*') || allPerms.includes('https://*/*');
    const usesWebRequest = allPerms.includes('webRequest') || allPerms.includes('webRequestBlocking') || allPerms.includes('declarativeNetRequest');
    const usesCookies = allPerms.includes('cookies');
    const usesNativeMessaging = allPerms.includes('nativeMessaging');
    const usesDebugger = allPerms.includes('debugger');
    const usesClipboard = allPerms.includes('clipboardRead') || allPerms.includes('clipboardWrite');
    const injectsContentScripts = hasHostPermissions || allPerms.includes('activeTab') || allPerms.includes('scripting');
    const canExecuteScript = allPerms.includes('scripting') || allPerms.includes('tabs') || accessesAllSites;
    const isMV3 = manifestVersion === 3;

    const category = this.detectCategory(name, description, allPerms);
    const detectedBehaviors: string[] = [];

    if (accessesAllSites) detectedBehaviors.push('Reads & modifies web page content on ALL websites');
    if (usesWebRequest) detectedBehaviors.push('Inspects or filters live network traffic');
    if (usesCookies) detectedBehaviors.push('Reads authentication & tracking cookies');
    if (usesDebugger) detectedBehaviors.push('Can attach browser debugger tools');
    if (usesNativeMessaging) detectedBehaviors.push('Communicates with external desktop applications');
    if (usesClipboard) detectedBehaviors.push('Reads or writes clipboard content');
    if (isMV3) detectedBehaviors.push('Uses event-driven Manifest V3 service worker');

    return {
      hasHostPermissions,
      accessesAllSites,
      injectsContentScripts,
      usesWebRequest,
      usesCookies,
      usesNativeMessaging,
      usesDebugger,
      usesClipboard,
      canExecuteScript,
      isMV3,
      primaryCategory: category,
      detectedBehaviors
    };
  }

  static detectCategory(name: string, description: string, permissions: string[]): CategoryType {
    const text = (name + ' ' + description).toLowerCase();

    if (text.includes('adblock') || text.includes('ad blocker') || text.includes('ublock') || text.includes('popup blocker') || permissions.includes('declarativeNetRequest')) {
      return 'AD_BLOCKER';
    }
    if (text.includes('password') || text.includes('bitwarden') || text.includes('1password') || text.includes('lastpass') || text.includes('vault')) {
      return 'PASSWORD_MANAGER';
    }
    if (text.includes('dark mode') || text.includes('dark reader') || text.includes('night mode') || text.includes('theme')) {
      return 'DARK_MODE';
    }
    if (text.includes('grammar') || text.includes('spell') || text.includes('writing') || text.includes('languagetool') || text.includes('grammarly')) {
      return 'GRAMMAR_CHECK';
    }
    if (text.includes('vpn') || text.includes('proxy') || text.includes('unblock') || permissions.includes('proxy')) {
      return 'VPN';
    }
    if (text.includes('pdf') || text.includes('document viewer') || text.includes('acrobat')) {
      return 'PDF_VIEWER';
    }
    if (text.includes('coupon') || text.includes('cashback') || text.includes('shopping') || text.includes('price tracker') || text.includes('honey')) {
      return 'SHOPPING_ASSISTANT';
    }
    if (text.includes('devtools') || text.includes('react devtools') || text.includes('inspector') || permissions.includes('debugger')) {
      return 'DEVELOPER_TOOLS';
    }
    if (text.includes('screen reader') || text.includes('font') || text.includes('contrast') || text.includes('zoom')) {
      return 'ACCESSIBILITY';
    }

    return 'PRODUCTIVITY';
  }
}
