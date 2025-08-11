import { Message, Payload } from './types';

/**
 * Base class for managing state and communication in Chrome extension contexts.
 * Provides core functionality for message handling and event processing.
 */
class BasePulse {
  /** Category identifier for message routing */
  protected eventCategory: string;

  /** Map of event action handlers */
  protected eventActions: Record<string, (payload: Payload) => any>;

  /**
   * Creates a new BasePulse instance.
   * @param eventCategory - Unique identifier for routing messages to correct handlers
   * @param events - Initial event handlers mapping action names to handler functions
   */
  public constructor(eventCategory: string, events: Record<string, (payload: Payload) => any> = {}) {
    this.eventCategory = eventCategory;
    this.eventActions = { ...events };
  }

  /**
   * Updates the event handlers map.
   * @param events - New event handlers to replace existing ones
   */
  protected setEvents(events: Record<string, (payload: Payload) => any>): void {
    this.eventActions = { ...events };
  }

  /**
   * Processes an incoming message by routing it to the appropriate handler.
   * @param message - The message to process containing category, action, and payload
   * @returns The result of the handler function or null if no handler exists
   */
  public processMessage(message: Message): any {
    if (message.category !== this.eventCategory) {
      return null;
    }

    const handler = this.eventActions[message.action];

    if (handler) {
      return handler.call(this, message.payload);
    }
    
    return null;
  }

  /**
   * Sends a message with the specified action and payload.
   * Must be implemented by subclasses to define specific message sending behavior.
   * @param action - The action identifier for the message
   * @param payload - The data to be sent with the message
   * @throws {Error} When called directly on BasePulse (must be implemented by subclass)
   */
  public sendMessage(action: string, payload: Payload): void {
    throw new Error("sendMessage must be implemented in a subclass");
  }
}

export { BasePulse };
