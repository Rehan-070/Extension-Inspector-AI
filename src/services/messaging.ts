export type MessageAction = 
  | 'GET_ECOSYSTEM_DATA'
  | 'RESCAN_ECOSYSTEM'
  | 'TOGGLE_EXTENSION'
  | 'UNINSTALL_EXTENSION'
  | 'GET_SETTINGS'
  | 'SAVE_SETTINGS'
  | 'GET_TIMELINE'
  | 'CLEAR_TIMELINE';

export interface ExtensionMessage {
  action: MessageAction;
  payload?: any;
}

export interface ExtensionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class MessagingService {
  static async sendMessage<T = any>(message: ExtensionMessage): Promise<ExtensionResponse<T>> {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: true });
          }
        });
      });
    } else {
      console.log(`[Messaging Mock] Action: ${message.action}`, message.payload);
      return { success: true };
    }
  }
}
