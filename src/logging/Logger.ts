import { LogMessage, Type } from './LogMessage';
import { LogSettings,LogLevel } from './LogSettings';
import {LogManager} from "./LogManager";



interface LoggerConfig {
  source: string;
  logLevel?: LogLevel;
}

export class Logger{
  dateFormat:string = 'y-MM-dd_HH:mm:ss';
  options = { month: "long", day: "numeric", year: "numeric" };
  locale = "de-DE";
  logs:any = [];
  stdlog:Function;
  clogs:any=[];
  settings:LogSettings = undefined;
  source:string;
  private _logLevel:LogLevel = LogLevel.ALL;


  
  /**
   * This constructor will be triggering the hooking on the console log to add the hack the 
   * reported messages, in order to 
   * 
   */
  constructor (params:LoggerConfig={source:'MainLogger', logLevel: LogLevel.DEBUG}) {
    const { source, logLevel } = params;
    if (source !==undefined) this.source = source;
    if (logLevel !==undefined){
      this._logLevel = logLevel;
    } else{
      // Set different default log levels for MainLogger and non-MainLogger instances
      if (this.source === 'MainLogger') {
        this._logLevel = LogLevel.DEBUG;
      } else {
        this._logLevel = LogLevel.DEFAULT;
      }
    }

    LogManager.getInstance().registerLogger(this.source,this)
    
    // Enable log caching by default for MainLogger
    if (this.source === 'MainLogger') {
      this.handleLogsCache();
    }
  }


  get logLevel(): LogLevel {
    return this._logLevel;
  }

  set logLevel(value: LogLevel) {
    this._logLevel = value;
  }

  private createDate():string{
    return new Date().toLocaleString();
    //return new Date().toLocaleString(this.locale, this.options);
    //return new Intl.DateTimeFormat(this.locale, this.options).format();
  }

  public setLogSettings(logSettings:LogSettings){
    this.settings = logSettings;
    if (logSettings!==undefined){
      if (logSettings.cacheLogs){
        this.handleLogsCache();
      }
      if (logSettings.logLevel!==undefined){
          this._logLevel = logSettings.logLevel;
      }
    }
  }
  

  public doSaveMessage(type:String,args:any,origFun:Function){
    try{
      if ((args)&&(args!==undefined)&&(Object.keys(args))){
        let msg = '';
        for (const [key, value] of Object.entries(args)) {
            if (typeof value==='string') msg = msg + `${key}: ${value} `;
        }
        // Need to check the below 
        //let flag = msg.indexOf(" :: ");
        //if ((flag < 0) && (flag > 40)) {
        if (msg!=='')
            this.logs.push(type + "- " + msg);
        }
      }
      catch (error) {
          if (error instanceof TypeError) {
              console.log('-------- ' + typeof args);
              this.logs.push(type + "- " + JSON.stringify(args));
          }
          else {
              console.error("Error upon trying to save the messgae with the following args ", error);
          }
      }
      finally{
        origFun.apply(console,args)
      }
  }
  
  
  private handleLogsCache(){
    const instance = this;
    const origFunLog = console.log;

    console.log = function(){instance.doSaveMessage("Log   ",arguments,origFunLog);};
    const origFunDbg = console.debug;
    console.debug = function(){instance.doSaveMessage("Debug ",arguments,origFunDbg);};
    const origFunInf = console.info;
    console.info = function(){instance.doSaveMessage("Info  ",arguments,origFunInf);};
    const origFunErr = console.error;
    console.error = function(){instance.doSaveMessage("Error ",arguments,origFunErr);};
    const origFunWarn = console.warn;
    console.warn = function(){instance.doSaveMessage("Warn  ",arguments,origFunWarn);};
  
  }

  public getCachedLogs():[]{
    return this.logs;
  }

  

  public getCachedLogsAsBlob():any{
    // Check if Blob is available (browser environment)
    if (typeof Blob !== 'undefined') {
      return new Blob([this.logs.join("\n")], {type: "text/plain"});
    } 
    // In Node.js environment, create a global Blob polyfill if it doesn't exist
    else {
      if (typeof global !== 'undefined' && !global.Blob) {
        // Simple Blob polyfill for Node.js environment
        class NodeBlob {
          type: string;
          size: number;
          private content: string;

          constructor(parts: any[], options: any = {}) {
            this.type = options.type || '';
            this.content = parts.join('');
            this.size = this.content.length;
          }

          text() {
            return Promise.resolve(this.content);
          }

          arrayBuffer() {
            return Promise.resolve(new TextEncoder().encode(this.content).buffer);
          }
        }

        // Add the Blob to the global object
        (global as any).Blob = NodeBlob;
      }

      // Now we can use the global Blob
      return new (global as any).Blob([this.logs.join("\n")], {type: "text/plain"});
    }
  }
  
  public log(text:any){
    //arguments.callee.caller.name to be checked later
    console.log('%c[' + this.createDate() + '] ' +  (this.source?this.source:'') + '  : %c' + text ,'color:blue;','color:black;');
  }

  public info(text:any,compact:boolean=false){
    
    this.logMessage(new LogMessage(text,Type.Info,compact));
  }
  public error(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Error,compact));
  }
  public warn(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Warning,compact));
  }
  public debug(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Debug,compact));
  }



  private debugOld(text:any){
    console.debug('%c[' + this.createDate() + '] : %c' + text,'color:blue;','color:black;');
  }

  logMessage(msg:LogMessage){
    if (this._logLevel === LogLevel.OFF) return;

    switch (msg.type) {
      case Type.Info:
        if (this._logLevel >= LogLevel.INFO)
          console.info(this.composeLogMessage(msg), 'color:blue;', 'color:' + this.getMsgLogColor(msg) + ';', 'color:blue;', 'color:black;');
        break;
      case Type.Error:
        if (this._logLevel >= LogLevel.ERROR)
          console.error(this.composeLogMessage(msg), 'color:blue;', 'color:' + this.getMsgLogColor(msg) + ';', 'color:blue;', this.getMsgLogColor(msg));
        break;
      case Type.Warning:
        if (this._logLevel >= LogLevel.WARN)
          console.warn(this.composeLogMessage(msg), 'color:blue;', 'color:' + this.getMsgLogColor(msg) + ';', 'color:blue;', 'color:black;');
        break;
      case Type.Debug:
        if (this._logLevel >= LogLevel.DEBUG)
          console.debug(this.composeLogMessage(msg), 'color:blue;', 'color:' + this.getMsgLogColor(msg) + ';', 'color:blue;', 'color:black;');
        break;

      default:
        if(this._logLevel >= LogLevel.DEFAULT)
          console.log(this.composeLogMessage(msg), 'color:blue;', 'color:' + this.getMsgLogColor(msg) + ';', 'color:blue;', 'color:black;');
        break;
    }
  }
  private getMsgLogColor(msg:LogMessage):string{
    switch(msg.type){
      case Type.Info:
        return 'green';
      case Type.Error:
        return 'red';
      case Type.Warning:
        return 'orang';
      case Type.Debug:
        return 'purple';
      default:
        return 'black';
    }
}

private composeLogMessage(msg:LogMessage):any{
    let newMessage:any= '%c[' + this.createDate() +'] ' +  (this.source?this.source:'') + ' - %c' + msg.type + ' %c:: %c' + msg.text;
    MainLogger.logs.push(newMessage.replaceAll('%c',''));
    return newMessage;
  }
};
const MainLogger = new Logger();
console.log("new Main Logger intance ....");
export default MainLogger;

