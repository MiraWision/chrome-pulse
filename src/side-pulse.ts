import { Runtime } from '@mirawision/chrome-api/runtime';

import { BasePulse } from './base-pulse';
import { Message, Target, Payload } from './types';

/**
 * Manages state and communication for extension side panel.
 * Provides specialized handling for side panel-specific messaging and state management.
 * @extends BasePulse
 */
class SidePulse extends BasePulse {
  /**
   * Creates a new SidePulse instance and initializes message handling.
   * @param eventCategory - Unique identifier for routing messages
   * @param events - Map of event handlers for processing messages
   */
  constructor(
    eventCategory: string,
    events: Record<string, (payload: Payload) => any> = {}
  ) {
    super(eventCategory, events);
    this.startListening();
  }

  /**
   * Starts listening for messages in the side panel context.
   * Sets up message handling and response processing.
   */
  public startListening() {
    Runtime.addMessageListener((message: Message, sender, sendResponse) => {
      if (message.category !== this.eventCategory) {
        return;
      }
      const result = this.processMessage(message);
      if (result !== null) {
        sendResponse(result);
      }
    });
  }

  /**
   * Sends a message from the side panel context.
   * @template T - Expected response type
   * @param action - The action identifier for the message
   * @param payload - Optional data to be sent with the message
   * @param target - Optional target specifying where to send the message
   * @returns Promise resolving to the response
   */
  public async sendMessage<T extends {}>(
    action: string,
    payload: Payload = {},
    target?: Target
  ): Promise<T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
      target,
    };
    return Runtime.sendMessage<T>(message);
  }
}

export { SidePulse };
