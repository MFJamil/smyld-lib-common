[![](https://data.jsdelivr.com/v1/package/npm/smyld-lib-common/badge)](https://www.jsdelivr.com/package/npm/smyld-lib-common)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellowgreen.svg)](https://github.com/MFjamil/smyld-lib-common/blob/master/LICENSE)
[![](https://img.shields.io/badge/NPM-smyld--lib--common-blue)](https://www.npmjs.com/package/smyld-lib-common)
# SMYLD Common Library
is a library that contains some core APIs that helps the SPA developer, this library is a work in progress, it contains the following functionalities so far:



## 1 - Logging API:

The Logging API facilitates the work on Single Page Applications (SPAs) by providing syntax-highlighted messages with date and time stamps. It offers multiple log levels, custom loggers, log caching, and cross-environment support.

### Installation

The library is available on NPM and can be easily installed via the following command:
```npm
npm install smyld-lib-common
```

### Basic Usage

For quick and easy logging, the library provides a pre-configured `MainLogger` instance:

```javascript
import MainLogger from 'smyld-lib-common';

// Basic logging methods
MainLogger.info("This is an info message");
MainLogger.debug("This is a debug message");
MainLogger.warn("This is a warning message");
MainLogger.error("This is an error message");

// Logging objects (with optional compact formatting)
const user = { id: 123, name: "John Doe", role: "Admin" };
MainLogger.info(user);           // Pretty-printed JSON
MainLogger.info(user, true);     // Compact JSON
```

The output of the above code can be seen on the console of the browser as shown below:

![Library Common Logging API usage - from smyld.org site](images/LogMessages.png)

### Log Levels

The logger supports multiple log levels to control which messages are displayed:

```javascript
import { LogLevel } from 'smyld-lib-common';

// Available log levels (in order of increasing verbosity)
// LogLevel.OFF     - No logs displayed
// LogLevel.ERROR   - Only errors displayed
// LogLevel.WARN    - Errors and warnings displayed
// LogLevel.INFO    - Errors, warnings, and info displayed (DEFAULT)
// LogLevel.DEBUG   - All logs including debug messages displayed
// LogLevel.ALL     - All logs displayed

// Set log level for MainLogger
MainLogger.logLevel = LogLevel.DEBUG;
```

By default, `MainLogger` uses `LogLevel.DEBUG`, while custom loggers use `LogLevel.DEFAULT` (equivalent to `LogLevel.INFO`).

### Custom Loggers

You can create custom loggers for different components or modules of your application:

```javascript
import { Logger, LogLevel, LogManager } from 'smyld-lib-common';

// Create a custom logger with a specific source name
const userLogger = new Logger({ 
  source: 'UserService',
  logLevel: LogLevel.INFO
});

userLogger.info('User logged in');
userLogger.debug('Debug info will not show with INFO level');

// Create a logger with hierarchical source name
const componentLogger = new Logger({
  source: 'app.components.UserProfile',
  logLevel: LogLevel.DEBUG
});

// Log output will show abbreviated source: "a.c.UserProfile"
componentLogger.info('Profile component initialized');

// Access logger properties
console.log(componentLogger.source);      // "app.components.UserProfile"
console.log(componentLogger.sourceLog);   // "a.c.UserProfile"
console.log(componentLogger.logLevel);    // LogLevel.DEBUG
```

When using hierarchical source names (with dots), the logger automatically abbreviates the source name in log outputs. For example, `app.components.UserProfile` will appear as `a.c.UserProfile` in the logs, making them more readable while preserving the hierarchical structure.

#### Logger Methods

Each logger instance provides the following methods:

- `info(message, compact?)`: Logs an informational message
- `debug(message, compact?)`: Logs a debug message
- `warn(message, compact?)`: Logs a warning message
- `error(message, compact?)`: Logs an error message
- `log(message)`: Logs a plain message without formatting
- `setLogSettings(settings)`: Configures the logger settings
- `getCachedLogs()`: Returns an array of cached log messages
- `deleteCachedLogs()`: Clears the cached log messages
- `getCachedLogsAsBlob()`: Returns cached logs as a Blob for downloading

The `compact` parameter (optional boolean) controls whether objects are logged in compact format.

#### Logger Configuration

Logger settings are now managed centrally through the LogManager. When you create a new logger, it inherits settings from the LogManager:

```javascript
// Configure global settings
const logManager = LogManager.getInstance();
logManager.logSettings = {
  cacheLogs: true,
  logLevel: LogLevel.DEBUG,
  pooledLoggers: true
};

// Create a logger - it will inherit settings from LogManager
const logger = new Logger({ source: 'MyComponent' });

// You can still override specific settings per logger
logger.logLevel = LogLevel.ERROR;
```

By default, creating multiple loggers with the same source name will return the same instance (controlled by the `pooledLoggers` setting in LogManager).

### Log Manager

The `LogManager` allows you to control multiple loggers centrally:

```javascript
import { LogManager, LogLevel } from 'smyld-lib-common';

const logManager = LogManager.getInstance();

// Set log level for all registered loggers
logManager.setGeneralLogLevel(LogLevel.ERROR);

// Set log level for all loggers whose source name starts with the given prefix
logManager.setLogLevel('app.components', LogLevel.DEBUG);
// This affects loggers with sources like 'app.components.UserProfile', 'app.components.Button', etc.

// Set log level for all loggers whose source name contains the given string
logManager.setLogLevelContaining('Service', LogLevel.INFO);
// This affects loggers with sources like 'UserService', 'AuthService', 'app.services.DataService', etc.

// Set log level for all loggers whose source name matches a regex pattern
logManager.setLogLevelByRegex(/^api\.v\d+\..+$/, LogLevel.ERROR);
// This affects loggers with sources like 'api.v1.UserController', 'api.v2.ProductController', etc.

// Get all loggers matching a regex pattern
const apiLoggers = logManager.getLoggersByRegex(/^api\..+$/);
console.log(`Found ${apiLoggers.length} API loggers`);

// Get all registered loggers
const allLoggers = logManager.getAllLoggers();
console.log(`Total loggers: ${allLoggers.length}`);

// Check if a logger exists
if (logManager.hasLogger('UserService')) {
  // Get a reference to an existing logger
  const logger = logManager.getLogger('UserService');
}

// Configure global log settings
logManager.logSettings = {
  cacheLogs: true,
  logLevel: LogLevel.DEBUG,
  pooledLoggers: true // Controls whether loggers with the same source are pooled (default: true)
};
```

The `LogManager` provides several methods for filtering and configuring loggers:

- `setLogLevel(prefix, logLevel)`: Sets the log level for all loggers whose source name starts with the given prefix
- `setLogLevelContaining(substring, logLevel)`: Sets the log level for all loggers whose source name contains the given substring
- `setLogLevelByRegex(regex, logLevel)`: Sets the log level for all loggers whose source name matches the given regex pattern
- `getLoggersByRegex(regex)`: Returns all loggers whose source name matches the given regex pattern
- `getAllLoggers()`: Returns all registered loggers

The `logSettings` property allows you to configure global settings for all loggers:

- `cacheLogs`: Whether to cache log messages (default: false)
- `logLevel`: The default log level for new loggers (default: LogLevel.DEFAULT)
- `pooledLoggers`: Whether loggers with the same source name should be pooled (default: true)
- `libLogLevel`: Controls the logging level for the library's internal debug messages (default: LogLevel.OFF)

When `pooledLoggers` is true (default), creating a new logger with the same source name as an existing logger will return the existing instance. When false, a new instance will be created each time.

### Log Caching

The logger can cache log messages, which is useful for debugging or exporting logs:

```javascript
// MainLogger has caching enabled by default
// For custom loggers, enable caching with:
userLogger.setLogSettings({ cacheLogs: true });

// Get cached logs as an array
const logs = MainLogger.getCachedLogs();

// Get cached logs as a Blob (for downloading)
const logsBlob = MainLogger.getCachedLogsAsBlob();
```

### Node.js Support

The library includes a Blob polyfill for Node.js environments, making it fully compatible with both browser and Node.js applications. This allows you to use the same logging code across your entire application stack.

### Vue.js Integration

The library provides a Vue plugin for easy integration with Vue applications:

```javascript
import { createApp } from 'vue';
import { VueLoggerPlugin, LogLevel, LogManager } from 'smyld-lib-common';
import App from './App.vue';

const app = createApp(App);

// Install the logger plugin with optional settings
app.use(VueLoggerPlugin, {
  cacheLogs: true,
  logLevel: LogLevel.DEBUG,
  pooledLoggers: true,
  libLogLevel: LogLevel.OFF
});

app.mount('#app');
```

When you install the plugin with settings, it automatically:
1. Configures the MainLogger with these settings
2. Updates the LogManager's global settings to match
3. Makes the logger available throughout your Vue application

Once installed, you can access the logger in any component using the `$log` property:

```javascript
// In a Vue component
export default {
  mounted() {
    this.$log.info('Component mounted');
    this.$log.debug('Debug information');
  },
  methods: {
    handleClick() {
      this.$log.info('Button clicked');
    }
  }
}
```

The plugin also provides the logger via Vue's dependency injection system, allowing you to use it in the Composition API:

```javascript
// In a Vue component using Composition API
import { inject } from 'vue';

export default {
  setup() {
    const logger = inject('[log]: router');
    
    logger.info('Component setup');
    
    return {
      logMessage: () => {
        logger.info('Function called');
      }
    };
  }
}
```

You can also access and configure the LogManager directly in your Vue application:

```javascript
// In a Vue component or setup file
import { LogManager, LogLevel } from 'smyld-lib-common';

export default {
  methods: {
    configureLogging() {
      const logManager = LogManager.getInstance();
      
      // Set different log levels for different parts of your application
      logManager.setLogLevel('api', LogLevel.ERROR);  // Production setting
      logManager.setLogLevel('ui', LogLevel.INFO);    // Show important UI events
      
      if (process.env.NODE_ENV === 'development') {
        // Enable more verbose logging in development
        logManager.setLogLevelByRegex(/^(api|ui)\./, LogLevel.DEBUG);
      }
    }
  }
}
```


## 2 - Visibility API:

HTML elements can define a special behavior upon being visible in the page. Using these APIs will add a nice effect to the web page design.




### Usage
The library can be referenced inside any page as a usual JavaScript library:

```html
<script src='https://cdn.jsdelivr.net/npm/smyld-lib-common@1.0.35/main.min.js'></script>
```

 In your code, you need to define an attribute with the name **shown** inside the **div** element you want to animate when it is visible, this attribute should hold the **css class name(s)** that will be applied to your element once it is visible on the screen.
 
 ```html
  <div id="part1" class="testDiv" style="top:1600px;left:340px;" shown="myCssWhenVisible">One</div>
 ```
 
 Below is a sample of animation applied to the elements once they will be visible in the screen, the animation will take place only **once** in the opened page cycle, if the user would love to review the animation, he can refresh the page. 
 
![Library Common Logging API usage - from smyld.org site](images/visible_api_demo.gif)

