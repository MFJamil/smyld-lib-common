# Logger Tests

This directory contains tests for the logging functionality in the smyld-lib-common library.

## Test Files

The tests have been organized into three separate files based on the components they test:

1. **MainLogger.test.ts** - Tests for the singleton MainLogger instance
   - Tests for basic logging functionality
   - Tests for log level handling
   - Tests for cached logs functionality

2. **CustomLogger.test.ts** - Tests for custom logger instances
   - Tests for creating custom loggers
   - Tests for source name handling
   - Tests for log level settings
   - Tests for LogManager integration

3. **LogManager.test.ts** - Tests for the LogManager functionality
   - Tests for singleton behavior
   - Tests for log level management
   - Tests for logger retrieval
   - Tests for logger filtering

## Original File

The original `Logger.test.ts` file contains all the tests that have now been split into the three files above. It can be kept as a reference or removed if no longer needed.

## Running Tests

To run all tests:

```
npx jest
```

To run tests for a specific component:

```
npx jest MainLogger
npx jest CustomLogger
npx jest LogManager
```

## Helper Functions

The `setupConsoleSpy` helper function is included in both MainLogger.test.ts and CustomLogger.test.ts as it's used by tests in both files.