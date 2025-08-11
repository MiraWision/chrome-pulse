import { ExternalPulse } from '../src/external-pulse';
import { Message, Payload } from '../src/types';

describe('ExternalPulse', () => {
  let pulse: ExternalPulse;
  const testCategory = 'test';
  const testEvents = {
    'test-action': (payload: Payload) => payload
  };

  beforeEach(() => {
    pulse = new ExternalPulse(testCategory, testEvents);
  });

  describe('constructor', () => {
    it('should initialize with category and events', () => {
      expect(pulse['eventCategory']).toBe(testCategory);
      expect(pulse['eventActions']).toEqual(testEvents);
    });

    it('should initialize with empty events if none provided', () => {
      const emptyPulse = new ExternalPulse(testCategory);
      expect(emptyPulse['eventActions']).toEqual({});
    });

    it('should start listening for messages', () => {
      expect(chrome.runtime.onMessageExternal.addListener).toHaveBeenCalled();
    });
  });

  describe('setEvents', () => {
    it('should update event handlers', () => {
      const newEvents = {
        'new-action': (payload: Payload) => ({ ...payload, modified: true })
      };

      pulse.setEvents(newEvents);
      expect(pulse['eventActions']).toEqual(newEvents);
    });
  });

  describe('sendMessage', () => {
    const testPayload = { test: 'data' };
    const testTabId = 123;

    beforeEach(() => {
      (chrome.tabs.sendMessage as jest.Mock).mockResolvedValue({ success: true });
      (chrome.tabs.query as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
    });

    it('should send message to specific tab', async () => {
      const result = await pulse.sendMessage('test-action', testPayload, testTabId);
      
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
        testTabId,
        {
          category: testCategory,
          action: 'test-action',
          payload: testPayload
        }
      );
      expect(result).toEqual({ success: true });
    });

    it('should send message to all tabs when no tabId provided', async () => {
      const result = await pulse.sendMessage('test-action', testPayload);
      
      expect(chrome.tabs.query).toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
      expect(result).toEqual([{ success: true }, { success: true }]);
    });
  });

  describe('startListening', () => {
    it('should process messages and send response', () => {
      const testMessage: Message = {
        category: testCategory,
        action: 'test-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      // Get the listener function that was registered
      const listener = (chrome.runtime.onMessageExternal.addListener as jest.Mock).mock.calls[0][0];
      
      // Call the listener with test data
      listener(testMessage, {}, mockSendResponse);

      expect(mockSendResponse).toHaveBeenCalledWith(testMessage.payload);
    });

    it('should not send response for non-matching category', () => {
      const testMessage: Message = {
        category: 'wrong-category',
        action: 'test-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessageExternal.addListener as jest.Mock).mock.calls[0][0];
      listener(testMessage, {}, mockSendResponse);

      expect(mockSendResponse).not.toHaveBeenCalled();
    });

    it('should not send response for non-matching action', () => {
      const testMessage: Message = {
        category: testCategory,
        action: 'wrong-action',
        payload: { test: 'data' }
      };
      const mockSendResponse = jest.fn();

      const listener = (chrome.runtime.onMessageExternal.addListener as jest.Mock).mock.calls[0][0];
      listener(testMessage, {}, mockSendResponse);

      expect(mockSendResponse).not.toHaveBeenCalled();
    });
  });
});