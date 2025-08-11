import { Tabs } from '@mirawision/chrome-api/tabs';
import { Runtime } from '@mirawision/chrome-api/runtime';

import { BasePulse } from './base-pulse';
import { Message, Payload } from './types';

/**
 * Manages communication between the extension and external websites.
 * Handles message passing and event handling for external communication.
 * @extends BasePulse
 */
class ExternalPulse extends BasePulse {
  /**
   * Creates a new ExternalPulse instance and starts listening for messages.
   * @param eventCategory - Unique identifier for routing messages
   * @param events - Initial event handlers mapping action names to handler functions
   */
  public constructor(eventCategory: string, events: Record<string, (payload: Payload) => any> = {}) {
    super(eventCategory, events);

    this.startListening();
  }

  /**
   * Updates the event handlers map.
   * @param events - New event handlers to replace existing ones
   */
  public setEvents(events: Record<string, (payload: Payload) => any>): void {
    this.eventActions = events;
  }

  /**
   * Sends a message to external websites through Chrome's messaging system.
   * @template T - Expected response type
   * @param action - The action identifier for the message
   * @param payload - The data to be sent with the message
   * @param tabId - Optional specific tab ID to send the message to
   * @returns Promise resolving to the response from the external website
   */
  public async sendMessage<T extends {}>(action: string, payload: Payload, tabId?: number): Promise<T[] | T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
    };

    if (tabId !== undefined) {
      return Tabs.sendMessageToTab<T>(tabId, message);
    } else {
      return Tabs.sendMessageToAllTabs<T>(message);
    }
  }

  /**
   * Starts listening for messages from external websites.
   * Sets up message handling and response processing.
   */
  public startListening(): void {
    Runtime.addExternalMessageListener((message: Message, sender, sendResponse) => {
      const result = this.processMessage(message);

      if (result !== null) {
        sendResponse(result);
      }
    });
  }
}

export { ExternalPulse };
