# @mirawision/chrome-pulse

A lightweight messaging library for Chrome extensions, `@mirawision/chrome-pulse` provides seamless communication between different extension contexts through service-based message handling. Create dedicated service classes for each feature by extending base pulse classes to handle messages across background scripts, content scripts, popups, side panels, and external websites.

## Features

### Service-Based Architecture
- **Global Services**: Background script services for centralized message handling
- **Local Services**: Content script services for page-specific functionality
- **Popup Services**: Dedicated services for extension popup features
- **Side Panel Services**: Specialized services for side panel operations
- **External Services**: Secure services for external website communication

### Communication
- **Message Routing**: Automatic message routing based on service categories
- **Type Safety**: Full TypeScript support with method-based message handling
- **Async Support**: Built-in support for async/await and Promise-based operations
- **Error Handling**: Robust error handling with response capabilities

### Developer Experience
- **Class-Based Design**: Intuitive service inheritance for organized code
- **Debugging Support**: Built-in debugging capabilities
- **Context Awareness**: Automatic context detection and appropriate message routing
- **Clean Architecture**: Separation of concerns through service-based design

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

### Global Service Example (Background Script)

```typescript
import { GlobalPulse } from '@mirawision/chrome-pulse/global-pulse';
import { Storage } from '@mirawision/chrome-api/storage-sync';

// Define a service class for handling settings in the background script
class SettingsGlobalService extends GlobalPulse {
  constructor() {
    // Pass a unique category identifier for message routing
    super('settings', {
      // Define message handlers
      updateTheme: this.updateTheme.bind(this),
      toggleNotifications: this.toggleNotifications.bind(this),
      getSettings: this.getSettings.bind(this),
    });
  }

  async updateTheme(payload) {
    await Storage.set({ theme: payload.theme });
    return { success: true };
  }

  async toggleNotifications(payload) {
    await Storage.set({ notifications: payload.enabled });
    return { success: true };
  }

  async getSettings() {
    return Storage.get(['theme', 'notifications']);
  }
}

// Initialize the service
const settingsService = new SettingsGlobalService();
```

### Local Service Example (Content Script)

```typescript
import { LocalPulse } from '@mirawision/chrome-pulse/local-pulse';

// Define a service class for handling settings in content scripts
class SettingsLocalService extends LocalPulse {
  constructor() {
    super('settings');
  }

  // Methods to interact with the global service
  async updateTheme(theme: 'light' | 'dark') {
    return this.sendMessage('updateTheme', { theme });
  }

  async toggleNotifications(enabled: boolean) {
    return this.sendMessage('toggleNotifications', { enabled });
  }

  async getSettings() {
    return this.sendMessage('getSettings');
  }
}

// Initialize and use the service
const settingsService = new SettingsLocalService();
settingsService.updateTheme('dark');
```

### Popup Service Example

```typescript
import { PopupPulse } from '@mirawision/chrome-pulse/popup-pulse';

// Define a service class for handling user actions in the popup
class UserPopupService extends PopupPulse {
  constructor() {
    super('user');
  }

  async login(username: string, password: string) {
    return this.sendMessage('login', { username, password });
  }

  async logout() {
    // Clear user data
    return { success: true };
  }
}

const userService = new UserPopupService();
```

### Side Panel Service Example

```typescript
import { SidePulse } from '@mirawision/chrome-pulse/side-pulse';

// Define a service class for the side panel
class PanelService extends SidePulse {
  constructor() {
    super('panel', {
      // Handle panel state updates
      updatePanelUI: this.updatePanelUI.bind(this),
    });
  }

  private updatePanelUI(state: any) {
    // Update UI based on state
  }

  // Method to change panel tab
  async changeTab(tabId: string) {
    return this.sendMessage('changeTab', { tabId });
  }
}

const panelService = new PanelService();
```

### External Service Example

```typescript
import { ExternalPulse } from '@mirawision/chrome-pulse/external-pulse';

// Define a service class for external website communication
class WebsiteService extends ExternalPulse {
  constructor() {
    super('website', {
      // Handle messages from the website
      dataRequest: this.dataRequst.bind(this),
    });
  }

  async dataRequest(payload) {
    const data = await this.processRequest(payload);
    return { data };
  }
}

const websiteService = new WebsiteService();
```

## Contributing

Contributions are always welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.