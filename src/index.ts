
/**
 * @file Main entry point for the smyld-lib-common library
 * @module smyld-lib-common
 * 
 * This library provides logging utilities for JavaScript/TypeScript applications,
 * with special support for Vue.js applications through the VueLoggerPlugin.
 * 
 * @example
 * // Basic usage with the default MainLogger
 * import MainLogger from 'smyld-lib-common';
 * 
 * MainLogger.info('Application started');
 * MainLogger.debug('Configuration:', { apiUrl: 'https://api.example.com' });
 * 
 * @example
 * // Using a custom logger
 * import { Logger, LogLevel } from 'smyld-lib-common';
 * 
 * const userLogger = new Logger({ 
 *   source: 'UserService',
 *   logLevel: LogLevel.INFO
 * });
 * 
 * userLogger.info('User logged in');
 */

import { Logger } from './logging/Logger';


console.log("smyld-lib-common: Initializing logging library...");

/**
 * Default logger instance for the application.
 * This is the main entry point for logging and is exported as the default export.
 */
const MainLogger = new Logger();

// Export all components of the library
export { VueLoggerPlugin } from './VueLoggerPlugin';
export { Logger } from './logging/Logger';
export { LogManager } from './logging/LogManager';
export { LogLevel, LogSettings } from './logging/LogSettings';
export { LogMessage, Type } from './logging/LogMessage';

/**
 * Default export is the MainLogger instance for convenient usage.
 */
export default MainLogger;


