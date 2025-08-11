import { SidePulse } from '../src/side-pulse';
import { Message, Payload } from '../src/types';

describe('SidePulse', () => {
  let pulse: SidePulse;
  const testCategory = 'test';
  const testEvents = {
    'test-action': (payload: Payload) => payload
  };

  beforeEach(() => {
    pulse = new SidePulse(testCategory, testEvents);
  });

  describe('constructor', () => {
    it('should initialize with category and events', () => {
      expect(pulse['eventCategory']).toBe(testCategory);
      expect(pulse['eventActions']).toEqual(testEvents);
    });

    it('should initialize with empty events if none provided', () => {
      const emptyPulse = new SidePulse(testCategory);
      expect(emptyPulse['eventActions']).toEqual({});
    });

    it('should start listening for messages', () => {
      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    const testPayload = { test: 'data' };
    const testTarget = { tabId: 123 };

    beforeEach(() => {
      (chrome.runtime.sendMessage as jest.Mock).mockResolvedValue({ success: true });
    });

    it('should send message with correct format and target', async () => {
      const result = await pulse.sendMessage('test-action', testPayload, testTarget);
      
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        category: testCategory,
        action: 'test-action',
        payload: testPayload,
        target: testTarget
      });
      expect(result).toEqual({ success: true });
    });

    it('should send message with default empty payload and no target', async () => {
      await pulse.sendMessage('test-action');
      
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        category: testCategory,
        action: 'test-action',
        payload: {}
      });
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

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
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

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
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

      const listener = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[0][0];
      listener(testMessage, {}, mockSendResponse);

      expect(mockSendResponse).not.toHaveBeenCalled();
    });
  });
});