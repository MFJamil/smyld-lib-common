import MainLogger, { Logger } from '../src/logging/Logger';
import { LogManager } from '../src/logging/LogManager';
import { LogLevel } from '../src/logging/LogSettings';
import { Type } from '../src/logging/LogMessage';

// Helper function to spy on console methods
function setupConsoleSpy(method: 'log' | 'info' | 'warn' | 'error' | 'debug') {
  const originalMethod = console[method];
  const spy = jest.spyOn(console, method).mockImplementation(() => {});
  
  return {
    spy,
    restore: () => {
      spy.mockRestore();
      console[method] = originalMethod;
    }
  };
}

describe('Logger', () => {
  // Reset console spies after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('MainLogger', () => {
    test('should be a singleton instance of Logger', () => {
      expect(MainLogger).toBeInstanceOf(Logger);
      expect(MainLogger.source).toBe('MainLogger');
    });

    test('should log messages with different levels', () => {
      // Setup spies for all console methods
      const infoSpy = setupConsoleSpy('info');
      const warnSpy = setupConsoleSpy('warn');
      const errorSpy = setupConsoleSpy('error');
      const debugSpy = setupConsoleSpy('debug');
      
      // Log messages with different levels
      MainLogger.info('Info message');
      MainLogger.warn('Warning message');
      MainLogger.error('Error message');
      MainLogger.debug('Debug message');
      
      // Verify that console methods were called
      expect(infoSpy.spy).toHaveBeenCalled();
      expect(warnSpy.spy).toHaveBeenCalled();
      expect(errorSpy.spy).toHaveBeenCalled();
      expect(debugSpy.spy).toHaveBeenCalled();
      
      // Restore console methods
      infoSpy.restore();
      warnSpy.restore();
      errorSpy.restore();
      debugSpy.restore();
    });

    test('should handle different input types', () => {
      const infoSpy = setupConsoleSpy('info');
      
      // Test with string
      MainLogger.info('String message');
      expect(infoSpy.spy).toHaveBeenCalled();
      infoSpy.spy.mockClear();
      
      // Test with object
      const testObj = { id: 'myObject', text: 'This is an object' };
      MainLogger.info(testObj);
      expect(infoSpy.spy).toHaveBeenCalled();
      infoSpy.spy.mockClear();
      
      // Test with object in compact mode
      MainLogger.info(testObj, true);
      expect(infoSpy.spy).toHaveBeenCalled();
      
      infoSpy.restore();
    });

    test('should cache logs when enabled', () => {
      const testLogger:Logger = new Logger({source:'testCachedLogs'})
      // Clear existing logs
      MainLogger.deleteCachedLogs();
      
      // Log some messages
      testLogger.info('Test message 1');
      testLogger.warn('Test message 2');
      
      // Check that logs were cached
      const cachedLogs = MainLogger.getCachedLogs();
      expect(cachedLogs.length).toBeGreaterThan(0);
      
      // Test getting logs as blob
      const logsBlob = MainLogger.getCachedLogsAsBlob();
      expect(logsBlob).toBeInstanceOf(Blob);
      expect(logsBlob.type).toBe('text/plain');
    });
    test('Cached logs should not be duplicated', () => {
      const testLogger:Logger = new Logger({source:'testDuplicateCachedLogs'})
      // Clear existing logs
      MainLogger.deleteCachedLogs();
      MainLogger.setLogSettings({ cacheLogs: true });
      // Log some messages
      testLogger.info('Test message 1');
      testLogger.warn('Test message 2');
      
      // Check that logs were cached
      const cachedLogs = MainLogger.getCachedLogs();
      console.log('Cached Logs :', cachedLogs);
      
      expect(cachedLogs.filter(log =>log.indexOf('Test message 1') !== -1).length).toBe(1);
    });
    
    test('should delete cached logs when requested', () => {
      // Clear existing logs
      MainLogger.logs = [];
      
      // Log some messages
      MainLogger.info('Test message for deletion 1');
      MainLogger.warn('Test message for deletion 2');
      
      // Verify logs were cached
      expect(MainLogger.getCachedLogs().length).toBeGreaterThan(0);
      
      // Delete cached logs
      MainLogger.deleteCachedLogs();
      
      // Verify logs were deleted
      expect(MainLogger.getCachedLogs().length).toBe(0);
    });
  });

  describe('Custom Logger', () => {
    test('should create a custom logger with specified source', () => {
      const customLogger = new Logger({ source: 'TestLogger' });
      expect(customLogger.source).toBe('TestLogger');
      
      const infoSpy = setupConsoleSpy('info');
      
      customLogger.info('Custom logger message');
      expect(infoSpy.spy).toHaveBeenCalled();
      
      infoSpy.restore();
    });

    test('should register with LogManager', () => {
      const loggerName = 'RegisteredLogger';
      const customLogger = new Logger({ source: loggerName });
      
      // Check that logger was registered
      const logManager = LogManager.getInstance();
      expect(logManager.hasLogger(loggerName)).toBe(true);
      expect(logManager.getLogger(loggerName)).toBe(customLogger);
    });
    
    test('should retrieve the same logger instance from LogManager', () => {
      const loggerName = 'ManagedLogger';
      
      // Create a logger
      const logger1 = new Logger({ source: loggerName });
      
      // Get the logger from LogManager
      const logManager = LogManager.getInstance();
      const retrievedLogger = logManager.getLogger(loggerName);
      
      // It should be the same instance
      expect(retrievedLogger).toBe(logger1);
      
      // Create a logger with a different source
      const differentLogger = new Logger({ source: 'DifferentLogger' });
      
      // It should be a different instance
      expect(logManager.getLogger('DifferentLogger')).toBe(differentLogger);
      expect(logManager.getLogger('DifferentLogger')).not.toBe(logger1);
    });

    test('should respect log level settings', () => {
      // Create logger with ERROR level
      const restrictedLogger = new Logger({ 
        source: 'RestrictedLogger', 
        logLevel: LogLevel.ERROR 
      });
      
      // Setup spies
      const infoSpy = setupConsoleSpy('info');
      const errorSpy = setupConsoleSpy('error');
      
      // Info should not be logged (below ERROR level)
      restrictedLogger.info('This should not be logged');
      expect(infoSpy.spy).not.toHaveBeenCalled();
      
      // Error should be logged
      restrictedLogger.error('This should be logged');
      expect(errorSpy.spy).toHaveBeenCalled();
      
      infoSpy.restore();
      errorSpy.restore();
    });

    test('should update log level dynamically', () => {
      const dynamicLogger = new Logger({ 
        source: 'DynamicLogger', 
        logLevel: LogLevel.ERROR // Start with ERROR level
      });
      
      const infoSpy = setupConsoleSpy('info');
      
      // Info should not be logged initially
      dynamicLogger.info('This should not be logged');
      expect(infoSpy.spy).not.toHaveBeenCalled();
      infoSpy.spy.mockClear();
      
      // Change log level to INFO
      dynamicLogger.logLevel = LogLevel.INFO;
      
      // Now info should be logged
      dynamicLogger.info('This should be logged');
      expect(infoSpy.spy).toHaveBeenCalled();
      
      infoSpy.restore();
    });

    test('should initialize with LogManager log level when not specified', () => {
      // Set LogManager log level
      const logManager = LogManager.getInstance();
      logManager.setGeneralLogLevel(LogLevel.WARN);
      
      // Create logger without specifying log level
      const logger = new Logger({ source: 'LogManagerLevelLogger' });
      
      // Logger should have LogManager's log level
      expect(logger.logLevel).toBe(LogLevel.WARN);
      
      // Test that it respects this level
      const debugSpy = setupConsoleSpy('debug');
      const warnSpy = setupConsoleSpy('warn');
      
      // Debug should not be logged (below WARN level)
      logger.debug('This should not be logged');
      expect(debugSpy.spy).not.toHaveBeenCalled();
      
      // Warn should be logged
      logger.warn('This should be logged');
      expect(warnSpy.spy).toHaveBeenCalled();
      
      debugSpy.restore();
      warnSpy.restore();
      
      // Reset LogManager log level for other tests
      logManager.setGeneralLogLevel(LogLevel.DEBUG);
    });
  });

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
  });
});