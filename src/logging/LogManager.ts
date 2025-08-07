import {Logger} from "./Logger";
import {LogLevel, LogSettings} from "./LogSettings";
import {LogConfiguration} from "./LogConfiguration";
import {RuleCondition} from "./config/LogRule";

/**
 * @class
 * Singleton manager for all logger instances in the application.
 * Provides methods to register, retrieve, and configure loggers.
 */
export class LogManager {
    /** The singleton instance of LogManager */
    private static _instance: LogManager;
    
    /** Map of logger names to logger instances */
    private _loggers: Map<string, Logger>;

    private _allLoggers:Logger[] = [];

    private _logLevel: LogLevel = undefined;

    private _logSettings : LogSettings  = { cacheLogs: false, logLevel: LogLevel.DEFAULT , pooledLoggers: true };

    private _logConfiguration:LogConfiguration = new LogConfiguration();

    /**
     * Private constructor to prevent direct instantiation.
     * Use getInstance() instead.
     */
    private constructor() {
        this._loggers = new Map<string, Logger>();
    }

    get logSettings(): LogSettings{
        return this._logSettings;
    }

    get logLevel(): LogLevel {
        return this._logLevel;
    }

    set logSettings(value:LogSettings){
        this._logSettings = value;
    }

    /**
     * Gets the singleton instance of LogManager.
     * Creates the instance if it doesn't exist yet.
     * 
     * @returns {LogManager} The singleton LogManager instance
     * 
     * @example
     * const logManager = LogManager.getInstance();
     */
    public static getInstance(): LogManager {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    }

    /**
     * Registers a logger with the manager.
     * 
     * @param {string} name - The name to identify the logger
     * @param {Logger} logger - The logger instance to register
     * 
     * @example
     * const userLogger = new Logger({ source: 'UserService' });
     * LogManager.getInstance().registerLogger('UserService', userLogger);
     */
    public registerLogger(name: string, logger: Logger): void {
        const configLogLevel:LogLevel = this._logConfiguration.detectLogLevel(logger);
        logger.logLevel = configLogLevel;
        this._allLoggers.push(logger);
        this._loggers.set(name, logger);
    }

    /**
     * Retrieves a logger by name.
     * 
     * @param {string} name - The name of the logger to retrieve
     * @returns {Logger | undefined} The logger instance if found, undefined otherwise
     * 
     * @example
     * const userLogger = LogManager.getInstance().getLogger('UserService');
     * if (userLogger) {
     *     userLogger.info('User service initialized');
     * }
     */
    public getLogger(name: string): Logger | undefined {
        return this._loggers.get(name);
    }

    /**
     * Checks if a logger with the given name exists.
     * 
     * @param {string} name - The name of the logger to check
     * @returns {boolean} True if the logger exists, false otherwise
     * 
     * @example
     * if (LogManager.getInstance().hasLogger('UserService')) {
     *     // Use existing logger
     * } else {
     *     // Create new logger
     * }
     */
    public hasLogger(name: string): boolean {
        return this._loggers.has(name);
    }

    /**
     * Sets the log level for all registered loggers.
     * 
     * @param {LogLevel} logLevel - The log level to set
     * 
     * @example
     * // Set all loggers to only show errors in production
     * if (process.env.NODE_ENV === 'production') {
     *     LogManager.getInstance().setGeneralLogLevel(LogLevel.ERROR);
     * }
     */
    public setGeneralLogLevel(logLevel: LogLevel): void {
        this._logLevel = logLevel;
        this._allLoggers.forEach(logger => {
            logger.logLevel = logLevel;
        });
    }

    /**
     * Sets the log level for any logger that holds a source that starts with the given name
     * 
     * @param {string} name - The name of the logger
     * @param {LogLevel} logLevel - The log level to set
     * 
     * @example
     * // Enable debug logs for a specific component
     * LogManager.getInstance().setLogLevel('AuthService', LogLevel.DEBUG);
     */
    public setLogLevel(name: string, logLevel: LogLevel): void {
        this._logConfiguration.addRule(RuleCondition.startsWith, name, logLevel);
        this._allLoggers.forEach(curLogger =>{
            if (curLogger.source.startsWith(name)){
                curLogger.logLevel = logLevel;
            }
        })
    }

  
    /**
     * Setting the log level for any logger that its name contains the given name parameter
     * @param name 
     * @param logLevel 
     */
    public setLogLevelContaining(name: string, logLevel: LogLevel): void {
        this._logConfiguration.addRule(RuleCondition.contains, name, logLevel);
        this._allLoggers.forEach(curLogger =>{
            if (curLogger.source.indexOf(name)!==-1){
                curLogger.logLevel = logLevel;
            }
        })
    }
    public setLogLevelByRegex(regex:RegExp, logLevel: LogLevel): void {
        this._logConfiguration.addRule(RuleCondition.regex, regex, logLevel);
        const targetLoggers = this.getLoggersByRegex(regex);
        targetLoggers.forEach(curLogger => curLogger.logLevel=logLevel);
    }

    public getLoggersByRegex(regex:RegExp):Logger[]{
        let result:Logger[] = [];
        this._allLoggers.forEach(curLogger =>{
            if (regex.test(curLogger.source)){
                result.push(curLogger);
            }
        });
        return result;
    }

    /**
     * Returns all registered loggers.
     * 
     * @returns {Logger[]} Array of all registered logger instances
     * 
     * @example
     * const allLoggers = LogManager.getInstance().getAllLoggers();
     * console.log(`Total loggers: ${allLoggers.length}`);
     */
    public getAllLoggers(): Logger[] {
        return this._allLoggers;
    }


    public clearLoggers(): void{
        this._allLoggers = [];
        this._loggers.clear();
    }
    public clearConfiguration(): void{
        this._logConfiguration.clearConfigurations();
    }

    public clearAll():void{
        this.clearLoggers();
        this.clearConfiguration();
    }


}