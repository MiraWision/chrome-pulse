import { Runtime } from '@mirawision/chrome-api/runtime';

import { BasePulse } from './base-pulse';
import { Message, Payload } from './types';

/**
 * Manages state and communication for extension popup windows.
 * Provides specialized handling for popup-specific messaging and state management.
 * @extends BasePulse
 */
class PopupPulse extends BasePulse {
  /**
   * Creates a new PopupPulse instance and initializes message handling.
   * @param eventCategory - Unique identifier for routing messages
   * @param events - Map of event handlers with access to sender and response capabilities
   */
  public constructor(
    eventCategory: string,
    events: Record<string, (payload: Payload, sender: chrome.runtime.MessageSender, sendResponse: (res: any) => void) => any> = {}
  ) {
    super(eventCategory, {} as any);

    this.setEvents(events as any);
    this.startListening();
  }

  /**
   * Sends a message from the popup context.
   * @template T - Expected response type
   * @param action - The action identifier for the message
   * @param payload - Optional data to be sent with the message
   * @returns Promise resolving to the response
   */
  public async sendMessage<T extends {}>(action: string, payload: Payload = {}): Promise<T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
    };
    return Runtime.sendMessage<T>(message);
  }

  /**
   * Starts listening for messages in the popup context.
   * Sets up message handling and response processing.
   * Supports synchronous, asynchronous, and promise-based responses.
   */
  public startListening(): void {
    Runtime.addMessageListener((message: Message, sender, sendResponse) => {
      if (message.category !== this.eventCategory) {
        return false;
      }

      const handler = (this as any).eventActions[message.action];
      if (!handler) {
        return false;
      }

      const result = handler(message.payload, sender, sendResponse);

      if (result === true) {
        return true;
      }

      if (result instanceof Promise) {
        result.then(res => {
          if (res !== undefined) sendResponse(res);
        });
        return true;
      }

      if (result !== undefined) {
        sendResponse(result);
      }
      return false;
    });
  }
}

export { PopupPulse };
