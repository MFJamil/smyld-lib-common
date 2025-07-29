export enum LogLevel {
    OFF     = 0,
    ERROR   = 1,
    WARN    = 2,
    INFO    = 3,
    DEBUG   = 4,
    ALL     = 5,
    DEFAULT = 3
}

export interface LogSettings {
    cacheLogs?: boolean;
    [name: string]: any;
    logLevel?: LogLevel;
  }