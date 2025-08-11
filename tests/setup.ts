// Mock Chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    },
    onMessageExternal: {
      addListener: jest.fn()
    }
  },
  tabs: {
    sendMessage: jest.fn(),
    query: jest.fn()
  }
} as any;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});