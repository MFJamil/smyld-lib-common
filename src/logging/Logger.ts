import { LogMessage, Type } from './LogMessage';
import { LogSettings } from './LogSettings';






export class Logger{
  dateFormat:string = 'y-MM-dd_HH:mm:ss';
  options = { month: "long", day: "numeric", year: "numeric" };
  locale = "de-DE";
  logs:any = [];
  stdlog:Function;
  clogs:any=[];
  settings:LogSettings = undefined;


  
  /**
   * This constructor will be triggering the hooking on the console log to add the hack the 
   * reported messages, in order to 
   * 
   */
  constructor (){
    //this.hookConsoleLog();
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
    }
  }
  

  public doSaveMessage(type:String,args:any,origFun:Function){
      let msg = String(Array.from(args));
      let flag = msg.indexOf(" :: ");
      if ((flag<0 )&& (flag>40)){
        this.logs.push(type + "- " + msg);
      }
      origFun.apply(console,args)
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

  

  public getCachedLogsAsBlob():Blob{
    return new Blob([this.logs.join("\n")], {type: "text/plain"});
    
  }
  
  public log(text:any){
    //arguments.callee.caller.name to be checked later
    console.log('%c[' + this.createDate() + '] : %c' + text ,'color:blue;','color:black;');
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
    switch(msg.type){
          case Type.Info:
            console.info(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
          case Type.Error:
            console.error(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;',this.getMsgLogColor(msg));
            break;
          case Type.Warning:
            console.warn(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
          case Type.Debug:
            console.debug(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
  
            default:
            console.log(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
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
    let newMessage:any= '%c[' + this.createDate() +'] %c' + msg.type + ' %c:: %c' + msg.text;
    this.logs.push(newMessage.replaceAll('%c',''));
    return newMessage;
  }
};
const MainLogger = new Logger();
console.log("new Main Logger intance ....");
export default MainLogger;

