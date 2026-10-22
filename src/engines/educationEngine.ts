import { EducationTip } from '../types/engines';

export class EducationEngine {
  static getTips(): EducationTip[] {
    return [
      {
        id: 'tip-mv3-architecture',
        category: 'ARCHITECTURE',
        title: 'Why Manifest V3 Matters for Battery & CPU',
        summary: 'Manifest V3 replaces continuous background pages with event-driven Service Workers.',
        actionableAdvice: 'Prefer MV3 extensions whenever possible. They sleep when idle, reducing idle CPU usage to ~0%.'
      },
      {
        id: 'tip-least-privilege',
        category: 'SECURITY',
        title: 'The Principle of Least Privilege',
        summary: 'Extensions should only request permissions strictly required for their main task.',
        actionableAdvice: 'Be cautious of extensions asking for "<all_urls>" or "debugger" when simple tab access is enough.'
      },
      {
        id: 'tip-host-permissions',
        category: 'PRIVACY',
        title: 'Controlling Site Access Scope',
        summary: 'Chrome allows you to restrict extension permissions to specific websites or on click only.',
        actionableAdvice: 'Right-click any extension icon -> "This Can Read and Change Site Data" -> Select "When You Click the Extension".'
      },
      {
        id: 'tip-overlapping-adblockers',
        category: 'PERFORMANCE',
        title: 'Why Multiple Ad Blockers Slow Down Web Surfing',
        summary: 'Ad blockers check every web request against thousands of filter rules.',
        actionableAdvice: 'Use only one primary ad blocker (e.g. uBlock Origin) to prevent double rule evaluations on every web request.'
      },
      {
        id: 'tip-declarative-net-request',
        category: 'PRIVACY',
        title: 'Declarative Net Request vs webRequest',
        summary: 'DeclarativeNetRequest passes rules to Chrome, eliminating JS execution per packet.',
        actionableAdvice: 'Declarative Net Request extensions prevent extension code from reading your web traffic while still blocking ads.'
      }
    ];
  }
}
