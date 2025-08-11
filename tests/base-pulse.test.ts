import { BasePulse } from '../src/base-pulse';
import { Message, Payload } from '../src/types';

class TestPulse extends BasePulse {
  public sendMessage(action: string, payload: Payload): void {
    // Test implementation
    console.log(action, payload);
  }
}

describe('BasePulse', () => {
  let pulse: TestPulse;
  const testCategory = 'test';
  const testEvents = {
    'test-action': (payload: Payload) => payload
  };

  beforeEach(() => {
    pulse = new TestPulse(testCategory, testEvents);
  });

  describe('constructor', () => {
    it('should initialize with category and events', () => {
      expect(pulse['eventCategory']).toBe(testCategory);
      expect(pulse['eventActions']).toEqual(testEvents);
    });

    it('should initialize with empty events if none provided', () => {
      const emptyPulse = new TestPulse(testCategory);
      expect(emptyPulse['eventActions']).toEqual({});
    });
  });

  describe('processMessage', () => {
    it('should process message with matching category and action', () => {
      const message: Message = {
        category: testCategory,
        action: 'test-action',
        payload: { data: 'test' }
      };

      const result = pulse.processMessage(message);
      expect(result).toEqual(message.payload);
    });

    it('should return null for non-matching category', () => {
      const message: Message = {
        category: 'wrong-category',
        action: 'test-action',
        payload: { data: 'test' }
      };

      const result = pulse.processMessage(message);
      expect(result).toBeNull();
    });

    it('should return null for non-matching action', () => {
      const message: Message = {
        category: testCategory,
        action: 'wrong-action',
        payload: { data: 'test' }
      };

      const result = pulse.processMessage(message);
      expect(result).toBeNull();
    });
  });

  describe('setEvents', () => {
    it('should update event handlers', () => {
      const newEvents = {
        'new-action': (payload: Payload) => ({ ...payload, modified: true })
      };

      pulse['setEvents'](newEvents);
      expect(pulse['eventActions']).toEqual(newEvents);
    });
  });

  describe('sendMessage', () => {
    it('should throw error in base class', () => {
      const basePulse = new BasePulse(testCategory);
      expect(() => {
        basePulse.sendMessage('test', {});
      }).toThrow('sendMessage must be implemented in a subclass');
    });
  });
});