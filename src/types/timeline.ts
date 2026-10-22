import { RiskLevel } from './extension';

export type TimelineEventType = 
  | 'INSTALLED'
  | 'UNINSTALLED'
  | 'ENABLED'
  | 'DISABLED'
  | 'PERMISSION_CHANGE'
  | 'TRUST_UPDATE'
  | 'RISK_DETECTED'
  | 'CONFLICT_DETECTED';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  extensionId: string;
  extensionName: string;
  iconUrl?: string;
  eventType: TimelineEventType;
  severity: RiskLevel;
  title: string;
  description: string;
  impactSummary: string;
}
