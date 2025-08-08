import MainLogger, {Logger} from '../src/logging/Logger';
import {LogLevel} from '../src/logging/LogSettings';

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

describe('MainLogger', () => {
  // Reset console spies after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

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
    MainLogger.setLogSettings({ cacheLogs: true, libLogLevel: LogLevel.OFF });
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