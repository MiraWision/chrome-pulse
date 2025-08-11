import { Tabs } from '@mirawision/chrome-api/tabs'
import { Runtime } from '@mirawision/chrome-api/runtime'

import { BasePulse } from './base-pulse'
import type { Message, Payload, Target } from './types'

/**
 * Handler function type for processing messages in GlobalPulse.
 * @param payload - The data payload of the message
 * @param sender - Information about the message sender
 * @param sendResponse - Callback function to send a response
 * @param message - The complete message object including target information
 * @returns Response data, promise of response data, or boolean indicating async response
 */
type Handler = (
  payload: Payload,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void,
  message: Message & { target?: Target }
) => any | Promise<any> | boolean

/**
 * Manages global state and communication across all extension contexts.
 * Provides centralized message handling and state management capabilities.
 * @extends BasePulse
 */
class GlobalPulse extends BasePulse {
  /**
   * Creates a new GlobalPulse instance and sets up message handling.
   * @param eventCategory - Unique identifier for routing messages
   * @param handlers - Map of action handlers for processing messages
   */
  constructor(
    eventCategory: string,
    handlers: Record<string, Handler>
  ) {
    super(eventCategory, {})

    Runtime.addMessageListener((message, sender, sendResponse) => {
      if (message.category !== eventCategory) return

      const handler = handlers[message.action]
      if (!handler) return

      const result = handler(message.payload, sender, sendResponse, message as any)

      if (result === true) {
        return
      }

      if (result instanceof Promise) {
        result.then(res => {
          if (res !== undefined) sendResponse(res)
        })
        return true
      }

      if (result !== undefined) {
        sendResponse(result)
      }

      return false
    })
  }

  /**
   * Sends a message to one or all tabs.
   * @template T - Expected response type
   * @param action - The action identifier for the message
   * @param payload - The data to be sent with the message
   * @param tabId - Optional specific tab ID to send the message to
   * @returns Promise resolving to the response(s) from the tab(s)
   */
  public async sendMessage<T = any>(
    action: string,
    payload: Payload = {},
    tabId?: number
  ): Promise<T | T[]> {
    const msg: Message = { category: this.eventCategory, action, payload }
    if (tabId != null) {
      return Tabs.sendMessageToTab<T>(tabId, msg)
    }
    return Tabs.sendMessageToAllTabs<T>(msg)
  }
}

export { GlobalPulse };
