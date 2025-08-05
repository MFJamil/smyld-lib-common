import { LogMessage, Type } from './LogMessage';
import { LogSettings, LogLevel } from './LogSettings';
import { LogManager } from "./LogManager";

/**
 * @interface
 * Configuration options for creating a Logger instance.
 */
interface LoggerConfig {
    /**
     * The source identifier for the logger.
     * This will be displayed in log messages to identify which component generated the log.
     */
    source: string;
    
    /**
     * The initial log level for the logger.
     * If not provided, defaults to LogLevel.DEBUG for MainLogger and LogLevel.DEFAULT for other loggers.
     * @see LogLevel
     */
    logLevel?: LogLevel;
}

/**
 * @class
 * Core logging utility that provides methods for logging messages with different severity levels.
 * Supports log caching, custom formatting, and integration with browser console.
 */
export class Logger {
    /** Date format string for log timestamps */
    dateFormat: string = 'y-MM-dd_HH:mm:ss';
    
    /** Date formatting options */
    options = { month: "long", day: "numeric", year: "numeric" };
    
    /** Locale for date formatting */
    locale = "de-DE";
    
    /** Array to store cached log messages */
    logs: any[] = [];
    
    /** Reference to the standard log function */
    stdlog: Function;
    
    /** Array to store console logs */
    clogs: any[] = [];
    
    /** Logger settings */
    settings: LogSettings = { cacheLogs: false, logLevel: LogLevel.DEFAULT };
    
    /** Source identifier for this logger */
    source: string;
    
    /** Current log level */
    private _logLevel: LogLevel = LogLevel.ALL;

    sourceLog: string;

    


  
  /**
   * Creates a new Logger instance and registers it with the LogManager.
   * 
   * @param {LoggerConfig} [params={ source: 'MainLogger', logLevel: LogLevel.DEBUG }] - Configuration options
   * 
   * @example
   * // Create the default MainLogger
   * const mainLogger = new Logger();
   * 
   * @example
   * // Create a custom logger for a specific component
   * const authLogger = new Logger({ 
   *   source: 'AuthService', 
   *   logLevel: LogLevel.ERROR 
   * });
   */
  constructor(params: LoggerConfig = { source: 'MainLogger', logLevel: LogLevel.DEBUG}) {
    const { source, logLevel } = params;

    if (LogManager.getInstance().hasLogger(source) && this.settings?.pooledLoggers) {
      // If a logger with the same source already exists, return that instance
      return LogManager.getInstance().getLogger(source);
    }

    if (source !== undefined) {
      this.source = source;
      this.initSourceLog();

    }
    
    if (logLevel !== undefined) {
      this._logLevel = logLevel;
    } else {
      // Set different default log levels for MainLogger and non-MainLogger instances
      if (this.source === 'MainLogger') {
        this._logLevel = LogLevel.DEBUG;
      }else if (LogManager.getInstance().logLevel !== undefined) {
        this._logLevel = LogManager.getInstance().logLevel;
        // Fallback to DEFAULT log level if not set
      } else {
        this._logLevel = LogLevel.DEFAULT;
      }
    }

    LogManager.getInstance().registerLogger(this.source, this);
    
    // Enable log caching by default for MainLogger
    this.handleLogsCache();
    
  }

  /**
   * Gets the current log level.
   * 
   * @returns {LogLevel} The current log level
   */
  get logLevel(): LogLevel {
    return this._logLevel;
  }

  /**
   * Sets the log level.
   * 
   * @param {LogLevel} value - The new log level
   */
  set logLevel(value: LogLevel) {
    this._logLevel = value;
  }

  /**
   * Creates a formatted date string for log timestamps.
   * 
   * @private
   * @returns {string} Formatted date string
   */
  private createDate(): string {
    return new Date().toLocaleString();
    // Alternative date formatting options (currently commented out):
    // return new Date().toLocaleString(this.locale, this.options);
    // return new Intl.DateTimeFormat(this.locale, this.options).format();
  }

    /**
     * Initializes the source log format by abbreviating namespace parts.
     * For namespaced sources (e.g. 'app.service.component'), abbreviates all parts except the last one.
     * Example: 'app.service.component' becomes 'a.s.component'
     */
    private initSourceLog(): void {
        const NAMESPACE_SEPARATOR = '.';

        if (!this.source.includes(NAMESPACE_SEPARATOR)) {
            this.sourceLog = this.source;
            return;
        }

        const sourceTokens = this.source.split(NAMESPACE_SEPARATOR);
        const lastToken = sourceTokens[sourceTokens.length - 1];

        this.sourceLog = this.formatNamespacedSource(sourceTokens, lastToken);
        console.log(`Logging Source value for '${this.source}' : ${this.sourceLog}`);
    }

    /**
     * Formats a namespaced source by abbreviating all parts except the last one.
     * @param tokens - Array of namespace tokens
     * @param lastToken - The last token to keep unchanged
     * @returns Formatted source string
     */
    private formatNamespacedSource(tokens: string[], lastToken: string): string {
        const abbreviatedParts = tokens
            .slice(0, -1)
            .map(token => token !== lastToken ? `${token.charAt(0)}.` : token)
            .join('');

        return `${abbreviatedParts}${lastToken}`;
    }

  /**
   * Applies settings to the logger.
   * 
   * @param {LogSettings} logSettings - The settings to apply
   * 
   * @example
   * logger.setLogSettings({
   *   cacheLogs: true,
   *   logLevel: LogLevel.DEBUG
   * });
   */
  public setLogSettings(logSettings: LogSettings): void {
    this.settings = logSettings;
    
    if (logSettings !== undefined) {
      if (logSettings.cacheLogs) {
        this.handleLogsCache();
      }
      
      if (logSettings.logLevel !== undefined) {
        this._logLevel = logSettings.logLevel;
      }
    }
  }
  

  /**
   * Saves a console message to the logs cache.
   * This method is used internally by the console method overrides.
   * 
   * @param {string} type - The type of log message (Log, Debug, Info, Error, Warn)
   * @param {any} args - The arguments passed to the console method
   * @param {Function} origFun - The original console function to call after caching
   */
  public doSaveMessage(type: string, args: any, origFun: Function): void {
    try {
      if (args && args !== undefined && Object.keys(args)) {
        let msg = '';
        for (const [key, value] of Object.entries(args)) {
          if (typeof value === 'string') {
            msg = msg + `${key}: ${value} `;
          }
        }
        
        // Cache the log message if it's not empty and is not formatted by the logger itself
        if ((msg !== '') &&(msg.indexOf('%c')===-1)) {
          this.logs.push(type + "- " + msg);
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        console.log('-------- ' + typeof args);
        this.logs.push(type + "- " + JSON.stringify(args));
      } else {
        console.error("Error upon trying to save the message with the following args ", error);
      }
    } finally {
      // Always call the original console function
      origFun.apply(console, args);
    }
  }
  
  /**
   * Sets up log caching by overriding console methods.
   * When enabled, all console logs will be captured in the logs array.
   * 
   * @private
   */
  private handleLogsCache(): void {
    if (this.source !== 'MainLogger' || (this.settings!==undefined && !this.settings.cacheLogs)) return;
    const instance = this;
    
    // Override console.log
    const origFunLog = console.log;
    console.log = function() { 
      instance.doSaveMessage("Log   ", arguments, origFunLog); 
    };
    
    // Override console.debug
    const origFunDbg = console.debug;
    console.debug = function() { 
      instance.doSaveMessage("Debug ", arguments, origFunDbg); 
    };
    
    // Override console.info
    const origFunInf = console.info;
    console.info = function() { 
      instance.doSaveMessage("Info  ", arguments, origFunInf); 
    };
    
    // Override console.error
    const origFunErr = console.error;
    console.error = function() { 
      instance.doSaveMessage("Error ", arguments, origFunErr); 
    };
    
    // Override console.warn
    const origFunWarn = console.warn;
    console.warn = function() { 
      instance.doSaveMessage("Warn  ", arguments, origFunWarn); 
    };
  }

  /**
   * Retrieves all cached log messages.
   * 
   * @returns {any[]} Array of cached log messages
   * 
   * @example
   * const logs = logger.getCachedLogs();
   * console.log(`Collected ${logs.length} log entries`);
   */
  public getCachedLogs(): any[] {
    return this.logs;
  }

  
  /**
   * Deletes all cached logs.
   * This will clear the logs array and remove all stored log messages.
   * 
   * @example
   * logger.deleteCachedLogs();
   */
  public deleteCachedLogs(): void {
    this.logs = [];
  }

  /**
   * Retrieves cached logs as a Blob object for downloading or storage.
   * Works in both browser and Node.js environments.
   * 
   * @returns {Blob} A Blob containing all cached logs
   * 
   * @example
   * // In browser: Create a download link for logs
   * const blob = logger.getCachedLogsAsBlob();
   * const url = URL.createObjectURL(blob);
   * const a = document.createElement('a');
   * a.href = url;
   * a.download = 'application-logs.txt';
   * a.click();
   */
  public getCachedLogsAsBlob(): any {
    // Check if Blob is available (browser environment)
    if (typeof Blob !== 'undefined') {
      return new Blob([this.logs.join("\n")], { type: "text/plain" });
    } 
    // In Node.js environment, create a global Blob polyfill if it doesn't exist
    else {
      if (typeof global !== 'undefined' && !global.Blob) {
        // Simple Blob polyfill for Node.js environment
        class NodeBlob {
          /** MIME type of the blob */
          type: string;
          
          /** Size of the blob in bytes */
          size: number;
          
          /** Content of the blob */
          private content: string;

          /**
           * Creates a NodeBlob instance.
           * 
           * @param {any[]} parts - Array of parts to concatenate
           * @param {object} [options={}] - Blob options
           */
          constructor(parts: any[], options: any = {}) {
            this.type = options.type || '';
            this.content = parts.join('');
            this.size = this.content.length;
          }

          /**
           * Returns the blob content as text.
           * 
           * @returns {Promise<string>} Promise resolving to the blob content
           */
          text(): Promise<string> {
            return Promise.resolve(this.content);
          }

          /**
           * Returns the blob content as an ArrayBuffer.
           * 
           * @returns {Promise<ArrayBuffer>} Promise resolving to the blob content as ArrayBuffer
           */
          arrayBuffer(): Promise<ArrayBuffer> {
            return Promise.resolve(new TextEncoder().encode(this.content).buffer);
          }
        }

        // Add the Blob to the global object
        (global as any).Blob = NodeBlob;
      }

      // Now we can use the global Blob
      return new (global as any).Blob([this.logs.join("\n")], { type: "text/plain" });
    }
  }
  
  /**
   * Logs a message to the console with basic formatting.
   * 
   * @param {any} text - The message to log
   */
  public log(text: any): void {
    console.log(
      '%c[' + this.createDate() + '] ' + (this.sourceLog ? this.sourceLog : '') + '  : %c' + text,
      'color:blue;',
      'color:black;'
    );
  }

  /**
   * Logs an informational message.
   * Only displayed if the current log level is INFO or higher.
   * 
   * @param {any} text - The message or object to log
   * @param {boolean} [compact=false] - Whether to format objects in compact mode
   * 
   * @example
   * logger.info("Operation completed successfully");
   * 
   * @example
   * // Log an object with pretty-printing
   * logger.info({ user: "john", status: "active" });
   * 
   * @example
   * // Log an object in compact format
   * logger.info({ user: "john", status: "active" }, true);
   */
  public info(text: any, compact: boolean = false): void {
    this.logMessage(new LogMessage(text, Type.Info, compact));
  }

  /**
   * Logs an error message.
   * Only displayed if the current log level is ERROR or higher.
   * 
   * @param {any} text - The error message or object to log
   * @param {boolean} [compact=false] - Whether to format objects in compact mode
   * 
   * @example
   * logger.error("Failed to connect to the server");
   * 
   * @example
   * // Log an error object
   * try {
   *   // Some code that might throw
   * } catch (error) {
   *   logger.error(error);
   * }
   */
  public error(text: any, compact: boolean = false): void {
    this.logMessage(new LogMessage(text, Type.Error, compact));
  }

  /**
   * Logs a warning message.
   * Only displayed if the current log level is WARN or higher.
   * 
   * @param {any} text - The warning message or object to log
   * @param {boolean} [compact=false] - Whether to format objects in compact mode
   * 
   * @example
   * logger.warn("API rate limit approaching");
   */
  public warn(text: any, compact: boolean = false): void {
    this.logMessage(new LogMessage(text, Type.Warning, compact));
  }

  /**
   * Logs a debug message.
   * Only displayed if the current log level is DEBUG or higher.
   * 
   * @param {any} text - The debug message or object to log
   * @param {boolean} [compact=false] - Whether to format objects in compact mode
   * 
   * @example
   * logger.debug("Variable state:", { count: 5, items: [...] });
   */
  public debug(text: any, compact: boolean = false): void {
    this.logMessage(new LogMessage(text, Type.Debug, compact));
  }

  /**
   * Legacy debug method.
   * @deprecated Use debug() instead
   * @private
   */
  private debugOld(text: any): void {
    console.debug(
      '%c[' + this.createDate() + '] : %c' + text,
      'color:blue;',
      'color:black;'
    );
  }

  /**
   * Processes and displays a log message based on its type and the current log level.
   * 
   * @param {LogMessage} msg - The log message to process
   */
  public logMessage(msg: LogMessage): void {
    // Don't log anything if logging is turned off
    if (this._logLevel === LogLevel.OFF) return;

    switch (msg.type) {
      case Type.Info:
        if (this._logLevel >= LogLevel.INFO) {
          console.info(
            this.composeLogMessage(msg), 
            'color:blue;', 
            'color:' + this.getMsgLogColor(msg) + ';', 
            'color:blue;', 
            'color:black;'
          );
        }
        break;
        
      case Type.Error:
        if (this._logLevel >= LogLevel.ERROR) {
          console.error(
            this.composeLogMessage(msg), 
            'color:blue;', 
            'color:' + this.getMsgLogColor(msg) + ';', 
            'color:blue;', 
            this.getMsgLogColor(msg)
          );
        }
        break;
        
      case Type.Warning:
        if (this._logLevel >= LogLevel.WARN) {
          console.warn(
            this.composeLogMessage(msg), 
            'color:blue;', 
            'color:' + this.getMsgLogColor(msg) + ';', 
            'color:blue;', 
            'color:black;'
          );
        }
        break;
        
      case Type.Debug:
        if (this._logLevel >= LogLevel.DEBUG) {
          console.debug(
            this.composeLogMessage(msg), 
            'color:blue;', 
            'color:' + this.getMsgLogColor(msg) + ';', 
            'color:blue;', 
            'color:black;'
          );
        }
        break;

      default:
        if (this._logLevel >= LogLevel.DEFAULT) {
          console.log(
            this.composeLogMessage(msg), 
            'color:blue;', 
            'color:' + this.getMsgLogColor(msg) + ';', 
            'color:blue;', 
            'color:black;'
          );
        }
        break;
    }
  }

  /**
   * Determines the color to use for a log message based on its type.
   * 
   * @private
   * @param {LogMessage} msg - The log message
   * @returns {string} The CSS color value
   */
  private getMsgLogColor(msg: LogMessage): string {
    switch (msg.type) {
      case Type.Info:
        return 'green';
      case Type.Error:
        return 'red';
      case Type.Warning:
        return 'orange'; // Fixed typo: 'orang' -> 'orange'
      case Type.Debug:
        return 'purple';
      default:
        return 'black';
    }
  }

  /**
   * Composes a formatted log message string with styling placeholders.
   * 
   * @private
   * @param {LogMessage} msg - The log message to format
   * @returns {string} Formatted message string with CSS style placeholders
   */
  private composeLogMessage(msg: LogMessage): string {
    let newMessage: string = '%c[' + this.createDate() + '] ' + 
                           (this.sourceLog ? this.sourceLog : '') +
                           ' - %c' + msg.type + 
                           ' %c:: %c' + msg.text;
    
    // Store a clean version of the message (without style placeholders) in the logs array
    // Using replace with global regex instead of replaceAll for better compatibility
    MainLogger.logs.push(newMessage.replace(/%c/g, ''));
    
    return newMessage;
  }
}

/**
 * Default logger instance for the application.
 * This is the main entry point for logging and is exported as the default export.
 *
 * @example
 * import MainLogger from 'smyld-lib-common';
 *
 * MainLogger.info('Application started');
 * MainLogger.debug('Debug information', { version: '1.0.0' });
 */
const MainLogger = new Logger();

export default MainLogger;

