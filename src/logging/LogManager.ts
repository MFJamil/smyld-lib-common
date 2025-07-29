import {Logger} from "./Logger";
import {LogLevel} from "./LogSettings";

export class LogManager{
    private static _instance: LogManager;
    private _loggers: Map<string, Logger>;

    private constructor() {
        this._loggers = new Map<string, Logger >();
    }

    public static getInstance(): LogManager {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    }

    public registerLogger(name: string, logger: Logger): void {
        this._loggers.set(name, logger);
    }

    public getLogger(name: string): Logger | undefined {
        return this._loggers.get(name);
    }

    public hasLogger(name: string): boolean {
        return this._loggers.has(name);
    }
    public setGeneralLogLevel(logLevel: LogLevel): void {
        this._loggers.forEach(logger => {
            logger.logLevel = logLevel;
        })
    }


    public setLogLevel(name: string, logLevel: LogLevel): void {
        const logger = this.getLogger(name);
        if (logger) {
            logger.logLevel = logLevel;
        } else {
            console.warn(`Logger with name ${name} not found.`);
        }
    }
}