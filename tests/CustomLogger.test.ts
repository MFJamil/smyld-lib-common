import { Logger } from '../src/logging/Logger';
import { LogManager } from '../src/logging/LogManager';
import { LogLevel } from '../src/logging/LogSettings';

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

describe('Custom Logger', () => {
  // Reset console spies after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create a custom logger with specified source', () => {
    const customLogger = new Logger({ source: 'TestLogger' });
    expect(customLogger.source).toBe('TestLogger');
    
    const infoSpy = setupConsoleSpy('info');
    
    customLogger.info('Custom logger message');
    expect(infoSpy.spy).toHaveBeenCalled();
    
    infoSpy.restore();
  });

  test('Should have a special source Log for nested Source names', () => {
    const customLogger = new Logger({ source: 'application.components.gui.TestField' });
    expect(customLogger.source).toBe('application.components.gui.TestField');
    expect(customLogger.sourceLog).toBe('a.c.g.TestField');

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

  test('should retrieve the same logger instance in case created twice with pooled loggers set to true', () => {
    const loggerName = 'ManagedLogger';

    // Create a logger
    const logger1 = new Logger({ source: loggerName });

    // Get the logger from LogManager
    const logManager = LogManager.getInstance();
    const retrievedLogger1 = logManager.getLogger(loggerName);

    const logger2 = new Logger({ source: loggerName });
    // It should be the same instance
    expect(retrievedLogger1).toBe(logger1);
    const retrievedLogger2 = logManager.getLogger(loggerName);
    expect(retrievedLogger2).toBe(logger2);
    //
    expect(logManager.getLogger(loggerName)).toBe(logger1);
    expect(logManager.getLogger(loggerName)).toBe(logger2);
  });

  test('should retrieve different logger instance in case created twice with the same source with pooled loggers set to false', () => {
    LogManager.getInstance().logSettings.pooledLoggers = false;
    const loggerName = 'ManagedLogger';

    // Create a logger
    const logger1 = new Logger({ source: loggerName });

    // Get the logger from LogManager
    const logManager = LogManager.getInstance();
    const retrievedLogger1 = logManager.getLogger(loggerName);

    const logger2 = new Logger({ source: loggerName });
    // It should be the same instance
    expect(retrievedLogger1).toBe(logger1);
    const retrievedLogger2 = logManager.getLogger(loggerName);
    expect(retrievedLogger2).toBe(logger2);
    //
    expect(logManager.getLogger(loggerName)).not.toBe(logger1);
    expect(logManager.getLogger(loggerName)).toBe(logger2);
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