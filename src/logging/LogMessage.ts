/**
 * @enum {string}
 * Defines the types of log messages that can be created.
 * Each type has a corresponding display label.
 */
export enum Type {
    /** Error message type */
    Error = 'ERR',
    /** Information message type */
    Info = 'INFO',
    /** Warning message type */
    Warning = 'WARN',
    /** Debug message type */
    Debug = 'DEBUG',
    /** Default log message type */
    Default = 'LOG'
}

/**
 * @class
 * Represents a log message with type, content, and timestamp.
 */
export class LogMessage {
    /** The type of log message */
    type: Type;
    
    /** The text content of the log message */
    text: string;
    
    /** The timestamp when the log message was created */
    date: Date;

    /**
     * Creates a new log message.
     * 
     * @param {any} msgText - The message content. If not a string, it will be converted to JSON.
     * @param {Type} msgType - The type of log message.
     * @param {boolean} [compact=false] - Whether to format JSON output in compact mode.
     * 
     * @example
     * // Create a simple text message
     * const infoMsg = new LogMessage("Operation completed", Type.Info);
     * 
     * @example
     * // Create a message from an object with pretty-printed JSON
     * const user = { id: 123, name: "John Doe" };
     * const debugMsg = new LogMessage(user, Type.Debug, false);
     * 
     * @example
     * // Create a message from an object with compact JSON
     * const errorMsg = new LogMessage(error, Type.Error, true);
     */
    constructor(msgText: any, msgType: Type, compact: boolean = false) {
        this.type = msgType;
        
        if (typeof msgText !== 'string') {
            msgText = compact 
                ? JSON.stringify(msgText) 
                : JSON.stringify(msgText, undefined, 2);
        }
        
        this.text = msgText;
        this.date = new Date();
    }
}
  