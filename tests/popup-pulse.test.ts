import { PopupPulse } from '../src/popup-pulse';
import { Message, Payload } from '../src/types';

describe('PopupPulse', () => {
  let pulse: PopupPulse;
  const testCategory = 'test';
  const testEvents = {
    'test-action': (payload: Payload) => payload
  };

  beforeEach(() => {
    pulse = new PopupPulse(testCategory, testEvents);
  });

  describe('constructor', () => {
    it('should initialize with category and events', () => {
      expect(pulse['eventCategory']).toBe(testCategory);
      expect(pulse['eventActions']).toEqual(testEvents);
    });

    it('should initialize with empty events if none provided', () => {
      const emptyPulse = new PopupPulse(testCategory);
      expect(emptyPulse['eventActions']).toEqual({});
    });

    it('should start listening for messages', () => {
      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    const testPayload = { test: 'data' };

    beforeEach(() => {
      (chrome.runtime.sendMessage as jest.Mock).mockResolvedValue({ success: true });
    });

    it('should send message with correct format', async () => {
      const result = await pulse.sendMessage('test-action', testPayload);
      
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        category: testCategory,
        action: 'test-action',
        payload: testPayload
      });
      expect(result).toEqual({ success: true });
    });

    it('should send message with default empty payload', async () => {
      await pulse.sendMessage('test-action');
      
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        category: testCategory,
        action: 'test-action',
        payload: {}
      });
    });
  });

  describe('startListening', () => {
    it('should handle synchronous responses', () => {
      const testMessage: Message = {
        category: testCategory,
        action: 'test-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
      listener(testMessage, {}, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith(testMessage.payload);
    });

    it('should handle asynchronous responses', async () => {
      const asyncEvents = {
        'async-action': async (payload: Payload) => {
          return { ...payload, modified: true };
        }
      };
      const asyncPulse = new PopupPulse(testCategory, asyncEvents);

      const testMessage: Message = {
        category: testCategory,
        action: 'async-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[1][0];
      const keepChannelOpen = listener(testMessage, {}, mockSendResponse);

      expect(keepChannelOpen).toBe(true);
      
      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSendResponse).toHaveBeenCalledWith({
        test: 'data',
        modified: true
      });
    });

    it('should not process messages with non-matching category', () => {
      const testMessage: Message = {
        category: 'wrong-category',
        action: 'test-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
      const result = listener(testMessage, {}, mockSendResponse);

      expect(result).toBe(false);
      expect(mockSendResponse).not.toHaveBeenCalled();
    });

    it('should not process messages with non-matching action', () => {
      const testMessage: Message = {
        category: testCategory,
        action: 'wrong-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
      const result = listener(testMessage, {}, mockSendResponse);

      expect(result).toBe(false);
      expect(mockSendResponse).not.toHaveBeenCalled();
    });
  });
});