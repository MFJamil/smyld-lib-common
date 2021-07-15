import { LogMessage, Type } from './LogMessage';


/*
function hookConsoleLog1(){
  stdlog = console.log.bind(console);
  clogs = [];
  console.log = function(){
    clogs.push(Array.from(arguments));
    stdlog.apply(console, arguments);
}
}
*/




export class Logger{
  dateFormat:string = 'y-MM-dd_HH:mm:ss';
  options = { month: "long", day: "numeric", year: "numeric" };
  locale = "de-DE";
  logs:any = [];
  stdlog:Function;
  clogs:any=[];

  
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

  /*
  private hookConsoleLog(){
    this.stdlog = console.log.bind(this);
    console.log = function(){
      this.clogs.push(Array.from(arguments));
      this.stdlog.apply(console, arguments);
    }
  }
  */
  
  public getLogs():any{
    return this.logs;
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
/*
console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function(){
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
}
*/

private composeLogMessage(msg:LogMessage):any{
    let newMessage:any= '%c[' + this.createDate() +'] %c' + msg.type + ' %c:: %c' + msg.text;
    this.logs.push(newMessage.replaceAll('%c',''));
    return newMessage;
  }
};
const MainLogger = new Logger();
console.log("new Main Logger intance ....");
export default MainLogger;

