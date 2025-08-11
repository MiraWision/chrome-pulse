/** 
 * Represents valid payload types that can be sent in messages.
 * Includes primitive types, objects, and null values.
 */
type Payload = string | number | boolean | object | null;

/** 
 * Represents a message target in the Chrome extension context.
 * Used to specify which tab or context should receive the message.
 */
interface Target {
  /** The ID of the target Chrome tab */
  tabId: number;
}

/** 
 * Represents a message structure for communication between extension contexts.
 * Messages are used to send commands and data between different parts of the extension.
 */
interface Message {
  /** Category identifier for routing messages to correct handlers */
  category: string;
  
  /** Action identifier specifying the operation to perform */
  action: string;
  
  /** Data payload containing the message content */
  payload: Payload;
  
  /** Optional target specifying where the message should be sent */
  target?: Target;
}

export { Message, Payload, Target };
