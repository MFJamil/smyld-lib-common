/**
 * @enum {number}
 * Defines the available log levels for controlling logging output.
 * Higher values include all lower level logs.
 */
export enum LogLevel {
    /** No logs will be displayed */
    OFF = 0,
    /** Only error logs will be displayed */
    ERROR = 1,
    /** Error and warning logs will be displayed */
    WARN = 2,
    /** Error, warning, and info logs will be displayed */
    INFO = 3,
    /** All logs including debug messages will be displayed */
    DEBUG = 4,
    /** All logs will be displayed (same as DEBUG currently) */
    ALL = 5,
    /** Default log level (same as INFO) */
    DEFAULT = 3
}

/**
 * @interface
 * Configuration settings for the Logger.
 */
export interface LogSettings {
    /**
     * Whether to cache logs for later retrieval.
     * When enabled, logs can be accessed via getCachedLogs() or getCachedLogsAsBlob().
     */
    cacheLogs?: boolean;
    
    /**
     * The log level to use. Controls which messages are displayed.
     * @see LogLevel
     */
    logLevel?: LogLevel;

    /**
     * Pooled Loggers will reuse existing logger instances with the same source.
     */
    pooledLoggers?: boolean;

    /**
     * Additional custom properties.
     */
    [name: string]: any;
}