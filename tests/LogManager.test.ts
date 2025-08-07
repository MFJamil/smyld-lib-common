import { Logger } from '../src/logging/Logger';
import { LogManager } from '../src/logging/LogManager';
import { LogLevel } from '../src/logging/LogSettings';

describe('LogManager', () => {
  test('should be a singleton', () => {
    const instance1 = LogManager.getInstance();
    const instance2 = LogManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should store and retrieve log level via getter', () => {
    const logManager = LogManager.getInstance();
    
    // Store the initial log level
    const initialLogLevel = logManager.logLevel;
    
    // Set a different log level
    logManager.setGeneralLogLevel(LogLevel.WARN);
    
    // Check that logLevel getter returns the new value
    expect(logManager.logLevel).toBe(LogLevel.WARN);
    
    // Reset to initial log level for other tests
    logManager.setGeneralLogLevel(initialLogLevel);
  });

  test('should set log level for all loggers', () => {
    // Create multiple loggers
    const logger1 = new Logger({ source: 'Logger1' });
    const logger2 = new Logger({ source: 'Logger2' });
    
    // Set global log level
    const logManager = LogManager.getInstance();
    logManager.setGeneralLogLevel(LogLevel.ERROR);
    
    // Check that all loggers have the new log level
    expect(logger1.logLevel).toBe(LogLevel.ERROR);
    expect(logger2.logLevel).toBe(LogLevel.ERROR);
    
    // Check that logManager's logLevel is also updated
    expect(logManager.logLevel).toBe(LogLevel.ERROR);
  });

  test('should set log level for specific logger', () => {
    // Create multiple loggers
    const logger1 = new Logger({ source: 'SpecificLogger1' });
    const logger2 = new Logger({ source: 'SpecificLogger2' });
    
    // Set log level for specific logger
    const logManager = LogManager.getInstance();
    logManager.setLogLevel('SpecificLogger1', LogLevel.DEBUG);
    
    // Check that only the specified logger has the new log level
    expect(logger1.logLevel).toBe(LogLevel.DEBUG);
    expect(logger2.logLevel).not.toBe(LogLevel.DEBUG);
  });

  test('should set log level for specific loggers group', () => {
    // Create multiple loggers
    const logger1 = new Logger({ source: 'app.components.SpecificLogger1' });
    const logger2 = new Logger({ source: 'app.components.SpecificLogger2' });
    const logger3 = new Logger({ source: 'app.service.SpecificLogger3' });
    const logger4 = new Logger({ source: 'app.service.SpecificLogger4' });
    
    // Set log level for specific logger
    const logManager = LogManager.getInstance();
    logManager.setLogLevel('app.components', LogLevel.DEBUG);
    logManager.setLogLevel('app.service', LogLevel.ALL);
    
    // Check that only the specified logger has the new log level
    expect(logger1.logLevel).toBe(LogLevel.DEBUG);
    expect(logger2.logLevel).not.toBe(LogLevel.ALL);
    expect(logger3.logLevel).toBe(LogLevel.ALL);
  });

  test('should set log level for loggers containing a specific string', () => {
    // Create multiple loggers with different naming patterns
    const logger1 = new Logger({ source: 'UserService' });
    const logger2 = new Logger({ source: 'AdminUserService' });
    const logger3 = new Logger({ source: 'ProductService' });
    
    // Set log level for loggers containing 'User'
    const logManager = LogManager.getInstance();
    logManager.setLogLevelContaining('User', LogLevel.WARN);
    
    // Check that only loggers with 'User' in their source have the new log level
    expect(logger1.logLevel).toBe(LogLevel.WARN);
    expect(logger2.logLevel).toBe(LogLevel.WARN);
    expect(logger3.logLevel).not.toBe(LogLevel.WARN);
  });

  test('should set log level for loggers matching a regex pattern', () => {
    // Create multiple loggers with different naming patterns
    const logger1 = new Logger({ source: 'api.v1.UserController', logLevel: LogLevel.DEBUG });
    const logger2 = new Logger({ source: 'api.v2.UserController', logLevel: LogLevel.DEBUG });
    const logger3 = new Logger({ source: 'service.UserService', logLevel: LogLevel.DEBUG });
    
    // Set log level for loggers matching the regex pattern
    const logManager = LogManager.getInstance();
    logManager.setLogLevelByRegex(/^api\.v\d+\..+$/, LogLevel.ERROR);
    
    // Check that only loggers matching the regex have the new log level
    expect(logger1.logLevel).toBe(LogLevel.ERROR);
    expect(logger2.logLevel).toBe(LogLevel.ERROR);
    expect(logger3.logLevel).toBe(LogLevel.DEBUG); // Should still be DEBUG, not ERROR
  });

  test('should retrieve loggers matching a regex pattern', () => {
    // Create multiple loggers with different naming patterns
    const logger1 = new Logger({ source: 'component.Button' });
    const logger2 = new Logger({ source: 'component.Form' });
    const logger3 = new Logger({ source: 'service.AuthService' });
    
    // Get loggers matching the regex pattern
    const logManager = LogManager.getInstance();
    const matchingLoggers = logManager.getLoggersByRegex(/^component\..+$/);
    
    // Check that only matching loggers are returned
    expect(matchingLoggers.length).toBe(2);
    expect(matchingLoggers).toContainEqual(logger1);
    expect(matchingLoggers).toContainEqual(logger2);
    expect(matchingLoggers).not.toContainEqual(logger3);
  });

  test('should retrieve all registered loggers', () => {
    // Clear existing loggers by creating a new instance
    const logManager = LogManager.getInstance();
    
    // Create a set of test loggers
    const logger1 = new Logger({ source: 'TestLogger1' });
    const logger2 = new Logger({ source: 'TestLogger2' });
    const logger3 = new Logger({ source: 'TestLogger3' });
    
    // Get all loggers
    const allLoggers = logManager.getAllLoggers();
    
    // Check that all our test loggers are included
    expect(allLoggers).toContainEqual(logger1);
    expect(allLoggers).toContainEqual(logger2);
    expect(allLoggers).toContainEqual(logger3);
    
    // Check that the length is at least the number of loggers we created
    // (there might be other loggers from previous tests)
    expect(allLoggers.length).toBeGreaterThanOrEqual(3);
  });
});