# @mirawision/chrome-pulse

A powerful state management library for Chrome extensions, `@mirawision/chrome-pulse` provides seamless communication and state synchronization between different extension contexts. Easily manage state across background scripts, content scripts, popups, and side panels with a unified and type-safe API.

## Features

### State Management
- **Global State**: Manage state that persists across all extension contexts
- **Local State**: Handle context-specific state with automatic cleanup
- **Popup State**: Dedicated state management for extension popups
- **Side Panel State**: Specialized state handling for side panels
- **External State**: Manage state for communication with external websites

### Communication
- **Cross-Context Sync**: Automatic state synchronization between different extension contexts
- **Type Safety**: Full TypeScript support with type inference
- **Real-time Updates**: Instant state updates across all contexts
- **Error Handling**: Robust error handling and recovery mechanisms

### Developer Experience
- **Easy Integration**: Simple setup process with minimal boilerplate
- **Debugging Support**: Built-in debugging capabilities
- **Context Awareness**: Automatic context detection and appropriate state handling
- **Memory Management**: Automatic cleanup of unused states and subscriptions

## Installation

```bash
npm install @mirawision/chrome-pulse
```

or 

```bash
yarn add @mirawision/chrome-pulse
```

## Usage

Here's a quick overview of how to use the core functionalities of @mirawision/chrome-pulse:

### Global State Example

```typescript
import { GlobalPulse } from '@mirawision/chrome-pulse/global-pulse';

// Create a global state instance
const userState = new GlobalPulse<{
  isLoggedIn: boolean;
  username: string;
}>({
  isLoggedIn: false,
  username: ''
});

// Subscribe to state changes
userState.subscribe((state) => {
  console.log('User state changed:', state);
});

// Update state
userState.set({
  isLoggedIn: true,
  username: 'john.doe'
});
```

### Popup State Example

```typescript
import { PopupPulse } from '@mirawision/chrome-pulse/popup-pulse';

// Create a popup state instance
const settingsState = new PopupPulse<{
  theme: 'light' | 'dark';
  notifications: boolean;
}>({
  theme: 'light',
  notifications: true
});

// Handle state updates
settingsState.subscribe((settings) => {
  updateUITheme(settings.theme);
  toggleNotifications(settings.notifications);
});
```

### Side Panel State Example

```typescript
import { SidePulse } from '@mirawision/chrome-pulse/side-pulse';

// Create a side panel state instance
const panelState = new SidePulse<{
  selectedTab: string;
  isExpanded: boolean;
}>({
  selectedTab: 'home',
  isExpanded: true
});

// React to state changes
panelState.subscribe((state) => {
  updatePanelUI(state);
});
```

### Local State Example

```typescript
import { LocalPulse } from '@mirawision/chrome-pulse/local-pulse';

// Create a local state instance
const pageState = new LocalPulse<{
  scrollPosition: number;
  selectedElements: string[];
}>({
  scrollPosition: 0,
  selectedElements: []
});

// Update state based on page interactions
window.addEventListener('scroll', () => {
  pageState.set({
    ...pageState.get(),
    scrollPosition: window.scrollY
  });
});
```

### External Communication Example

```typescript
import { ExternalPulse } from '@mirawision/chrome-pulse/external-pulse';

// Create an external communication state
const websiteComm = new ExternalPulse<{
  message: string;
  timestamp: number;
}>({
  message: '',
  timestamp: Date.now()
});

// Send message to website
websiteComm.send({
  message: 'Hello from extension!',
  timestamp: Date.now()
});

// Listen for website messages
websiteComm.onMessage((data) => {
  console.log('Received from website:', data);
});
```

## Contributing

Contributions are always welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.