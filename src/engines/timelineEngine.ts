import { TimelineEvent, TimelineEventType } from '../types/timeline';
import { RiskLevel } from '../types/extension';
import { ChromeStorageService } from '../services/chromeStorage';

export class TimelineEngine {
  static async recordEvent(
    extensionId: string,
    extensionName: string,
    eventType: TimelineEventType,
    severity: RiskLevel,
    title: string,
    description: string,
    impactSummary: string,
    iconUrl?: string
  ): Promise<TimelineEvent> {
    const event: TimelineEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      extensionId,
      extensionName,
      iconUrl,
      eventType,
      severity,
      title,
      description,
      impactSummary
    };

    await ChromeStorageService.addTimelineEvent(event);
    return event;
  }

  static async getEvents(): Promise<TimelineEvent[]> {
    return ChromeStorageService.getTimeline();
  }

  static async clearHistory(): Promise<void> {
    return ChromeStorageService.clearTimeline();
  }
}
